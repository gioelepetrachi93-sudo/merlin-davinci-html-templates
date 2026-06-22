(function () {
  "use strict";

  if (window.__merlinErrorUiStop) {
    try {
      window.__merlinErrorUiStop();
    } catch (error) {}
  }

  const STYLE_ID = "merlin-error-ui-style";
  const CHECK_INTERVAL_MS = 300;
  const ERROR_RED = "#FF383C";

  const OTP_SELECTORS = [
    {
      wrapper: ".mv-otp-wrapper",
      cell: ".mv-otp-wrapper > .mv-otp-cell"
    },
    {
      wrapper: ".mv-otp-boxes",
      cell: ".mv-otp-boxes > .mv-otp-box"
    }
  ];

  const EMAIL_FORMAT_ERROR_TEXT = "Please check your email format (e.g. name@mail.com)";
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  let timer = null;
  let dismissedOtpInvalid = false;
  let emailFormatErrorBox = null;
  let emailFormatTimers = [];

  function normalizeText(text) {
    return String(text || "")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function isVisible(element) {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0"
    );
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .merlin-verify .mv-otp-wrapper > .mv-otp-cell.is-invalid,
      .merlin-verify .mv-otp-boxes > .mv-otp-box.is-invalid {
        border-color: ${ERROR_RED} !important;
        box-shadow: none !important;
        outline-color: ${ERROR_RED} !important;
      }

      .merlin-verify .mv-otp-wrapper > .mv-otp-cell.is-invalid:focus,
      .merlin-verify .mv-otp-wrapper > .mv-otp-cell.is-invalid:focus-visible,
      .merlin-verify .mv-otp-boxes > .mv-otp-box.is-invalid:focus,
      .merlin-verify .mv-otp-boxes > .mv-otp-box.is-invalid:focus-visible {
        border-color: ${ERROR_RED} !important;
        box-shadow: 0 0 0 1px ${ERROR_RED} !important;
        outline-color: ${ERROR_RED} !important;
      }

      .merlin-verify .mv-otp-error {
        display: block;
        margin: 10px 0 0;
        padding: 0;
        color: ${ERROR_RED};
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        text-align: left;
        background: transparent;
        border: 0;
      }

      .merlin-verify .mv-otp-error[hidden] {
        display: none !important;
      }

      .merlin-login .ml-label.ml-has-format-error {
        color: ${ERROR_RED} !important;
      }

      .merlin-login .ml-input.ml-has-format-error {
        border-color: ${ERROR_RED} !important;
        box-shadow: none !important;
      }

      .merlin-login .ml-input.ml-has-format-error:focus {
        border-color: ${ERROR_RED} !important;
        box-shadow: 0 0 0 1px ${ERROR_RED} !important;
      }

      .merlin-login .ml-email-format-error {
        display: block !important;
        color: ${ERROR_RED} !important;
        font-size: 12px !important;
        font-weight: 400 !important;
        line-height: 17px !important;
        margin-top: 6px !important;
        min-height: 0 !important;
        text-align: left !important;
      }

      .merlin-login .ml-flow-error.ml-format-error-hidden {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }

      .merlin-error-ui-native-hidden {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
    `;

    document.head.appendChild(style);
  }

  function getVerifyRoot() {
    return document.querySelector(".merlin-verify") || document.body;
  }

  function getActiveOtpConfig() {
    const root = getVerifyRoot();

    return OTP_SELECTORS.find(function (config) {
      return !!(
        root.querySelector(config.wrapper) &&
        root.querySelector(config.cell)
      );
    }) || null;
  }

  function isVerifyEmailPage() {
    return !!(
      document.querySelector(".merlin-verify") &&
      getActiveOtpConfig()
    );
  }

  function getOtpWrapper() {
    const root = getVerifyRoot();
    const config = getActiveOtpConfig();

    return config ? root.querySelector(config.wrapper) : null;
  }

  function getOtpCells() {
    const root = getVerifyRoot();
    const config = getActiveOtpConfig();

    if (!config) return [];

    return Array.from(root.querySelectorAll(config.cell)).filter(isVisible);
  }

  function getOtpInvalidMessage() {
    return document.getElementById("mvOtpInvalidMessage");
  }

  function isInvalidOtpText(text) {
    const value = normalizeText(text);

    if (!value) return false;
    if (value.length > 180) return false;
    if (value.includes("too many attempts")) return false;
    if (value.includes("valid for")) return false;
    if (value.includes("code expired")) return false;
    if (value.includes("didn't receive")) return false;
    if (value.includes("email sent to")) return false;

    return (
      value === "invalid verification code" ||
      value === "enter the 6-digit one-time passcode." ||
      value.includes("passcode you entered isn't valid") ||
      value.includes("passcode you entered is not valid") ||
      (
        (value.includes("code") || value.includes("passcode") || value.includes("verification")) &&
        (value.includes("invalid") || value.includes("not valid") || value.includes("try again"))
      )
    );
  }

  function hasVisibleFormControl(element) {
    return Array.from(
      element.querySelectorAll("input, button, a, select, textarea, [role='button']")
    ).some(isVisible);
  }

  function findNativeInvalidOtpErrors() {
    const root = getVerifyRoot();
    const wrapper = getOtpWrapper();

    return Array.from(
      root.querySelectorAll("[role='alert'], [aria-live], .error, .Error, [class*='error'], [class*='Error'], p, span, div")
    )
      .filter(isVisible)
      .filter(function (element) {
        if (element.id === "mvOtpInvalidMessage") return false;
        if (element.closest("#mvOtpInvalidMessage")) return false;
        if (wrapper && wrapper.contains(element)) return false;
        if (element.id === "merlin-verification-lock-message") return false;
        if (element.closest("#merlin-verification-lock-message")) return false;
        if (hasVisibleFormControl(element)) return false;

        return isInvalidOtpText(element.textContent);
      });
  }

  function hasNativeInvalidOtpError() {
    return findNativeInvalidOtpErrors().length > 0;
  }

  function hideNativeInvalidOtpErrors() {
    findNativeInvalidOtpErrors().forEach(function (element) {
      element.classList.add("merlin-error-ui-native-hidden");
    });
  }

  function restoreNativeInvalidOtpErrors() {
    document.querySelectorAll(".merlin-error-ui-native-hidden").forEach(function (element) {
      element.classList.remove("merlin-error-ui-native-hidden");
    });
  }

  function showOtpInvalidState() {
    if (!isVerifyEmailPage()) return;

    const cells = getOtpCells();
    const message = getOtpInvalidMessage();

    if (!cells.length) return;

    cells.forEach(function (cell) {
      cell.classList.add("is-invalid");
      cell.setAttribute("aria-invalid", "true");
    });

    if (message) {
      message.hidden = false;
      hideNativeInvalidOtpErrors();
    }
  }

  function clearOtpInvalidState() {
    dismissedOtpInvalid = true;

    getOtpCells().forEach(function (cell) {
      cell.classList.remove("is-invalid");
      cell.removeAttribute("aria-invalid");
    });

    const message = getOtpInvalidMessage();

    if (message) {
      message.hidden = true;
    }

    restoreNativeInvalidOtpErrors();
  }

  function checkOtpInvalidState() {
    if (!isVerifyEmailPage()) return;
    if (dismissedOtpInvalid) return;

    if (hasNativeInvalidOtpError()) {
      showOtpInvalidState();
    }
  }

  function isOtpEditEvent(event) {
    const target = event.target;
    const wrapper = getOtpWrapper();

    if (!target || !wrapper || !wrapper.contains(target)) return false;

    return (
      event.type === "paste" ||
      event.type === "input" ||
      (
        event.type === "keydown" &&
        (
          event.key === "Backspace" ||
          event.key === "Delete" ||
          (event.key && event.key.length === 1)
        )
      )
    );
  }

  function onUserEditingOtp(event) {
    if (!isVerifyEmailPage()) return;
    if (!isOtpEditEvent(event)) return;

    clearOtpInvalidState();
  }

  function onSubmitOtp(event) {
    if (!isVerifyEmailPage()) return;

    const action =
      event.target &&
      event.target.closest("button, [role='button'], input[type='submit']");

    if (!action) return;

    const text = normalizeText(
      action.textContent ||
      action.value ||
      action.getAttribute("aria-label") ||
      ""
    );

    if (text.includes("continue") || text.includes("let's go")) {
      dismissedOtpInvalid = false;

      window.setTimeout(checkOtpInvalidState, 300);
      window.setTimeout(checkOtpInvalidState, 700);
      window.setTimeout(checkOtpInvalidState, 1200);
    }
  }

  function getLoginEmailNodes() {
    const root = document.querySelector(".merlin-login");

    if (!root) {
      return {};
    }

    const input = root.querySelector("#userEmail");
    const form = root.querySelector("#loginForm") || (input && input.closest("form"));
    const label = input ? root.querySelector('label[for="' + input.id + '"]') : null;
    const button = root.querySelector("#btnContinue");
    const flowError = root.querySelector(".ml-flow-error");

    return {
      root: root,
      form: form,
      input: input,
      label: label,
      button: button,
      flowError: flowError
    };
  }

  function isLoginEmailPage() {
    const nodes = getLoginEmailNodes();

    return !!(
      nodes.root &&
      nodes.form &&
      nodes.input &&
      nodes.button
    );
  }

  function getLoginEmailValue() {
    const nodes = getLoginEmailNodes();

    return String((nodes.input && nodes.input.value) || "").trim();
  }

  function isLoginEmailInvalidFormat() {
    const value = getLoginEmailValue();

    return value.length > 0 && !EMAIL_RE.test(value);
  }

  function getEmailFormatErrorBox() {
    const nodes = getLoginEmailNodes();

    if (!nodes.input) return null;

    if (emailFormatErrorBox && document.documentElement.contains(emailFormatErrorBox)) {
      return emailFormatErrorBox;
    }

    emailFormatErrorBox = document.getElementById("merlinEmailFormatError");

    if (!emailFormatErrorBox) {
      emailFormatErrorBox = document.createElement("div");
      emailFormatErrorBox.id = "merlinEmailFormatError";
      emailFormatErrorBox.className = "ml-email-format-error";
      emailFormatErrorBox.setAttribute("role", "status");
      emailFormatErrorBox.setAttribute("aria-live", "polite");
      nodes.input.insertAdjacentElement("afterend", emailFormatErrorBox);
    }

    return emailFormatErrorBox;
  }

  function hideLoginFlowError() {
    const nodes = getLoginEmailNodes();

    if (nodes.flowError && isLoginEmailInvalidFormat()) {
      nodes.flowError.classList.add("ml-format-error-hidden");
    }
  }

  function showLoginEmailFormatError() {
    const nodes = getLoginEmailNodes();
    const box = getEmailFormatErrorBox();

    if (!nodes.input || !box) return;

    if (nodes.label) {
      nodes.label.classList.add("ml-has-format-error");
    }

    nodes.input.classList.add("ml-has-format-error");
    nodes.input.setAttribute("aria-invalid", "true");

    box.textContent = EMAIL_FORMAT_ERROR_TEXT;

    hideLoginFlowError();
  }

  function clearLoginEmailFormatError() {
    const nodes = getLoginEmailNodes();

    if (nodes.label) {
      nodes.label.classList.remove("ml-has-format-error");
    }

    if (nodes.input) {
      nodes.input.classList.remove("ml-has-format-error");
      nodes.input.removeAttribute("aria-invalid");
    }

    if (emailFormatErrorBox) {
      emailFormatErrorBox.textContent = "";
    }

    if (nodes.flowError) {
      nodes.flowError.classList.remove("ml-format-error-hidden");
    }
  }

  function validateLoginEmailFormat(show) {
    if (!isLoginEmailPage()) return true;

    if (isLoginEmailInvalidFormat()) {
      if (show) {
        showLoginEmailFormatError();
      }

      return false;
    }

    clearLoginEmailFormatError();
    return true;
  }

  function scheduleHideLoginFlowError() {
    emailFormatTimers.forEach(clearTimeout);

    emailFormatTimers = [0, 50, 150, 350, 700].map(function (delay) {
      return window.setTimeout(function () {
        if (isLoginEmailInvalidFormat()) {
          showLoginEmailFormatError();
        }
      }, delay);
    });
  }

  function blockLoginEmailFormatIfInvalid(event) {
    if (validateLoginEmailFormat(true)) return;

    event.preventDefault();
    event.stopPropagation();

    if (event.stopImmediatePropagation) {
      event.stopImmediatePropagation();
    }

    scheduleHideLoginFlowError();

    const nodes = getLoginEmailNodes();

    if (nodes.input) {
      nodes.input.focus();
    }

    return false;
  }

  function isLoginPrimaryAction(target) {
    return !!(
      target &&
      target.closest &&
      target.closest("#btnContinue, button[data-skbuttonvalue='continue'], button[data-skbuttonvalue='Continue']")
    );
  }

  function onLoginEmailAction(event) {
    if (!isLoginEmailPage()) return;
    if (!isLoginPrimaryAction(event.target)) return;

    blockLoginEmailFormatIfInvalid(event);
  }

  function onLoginEmailSubmit(event) {
    if (!isLoginEmailPage()) return;

    const nodes = getLoginEmailNodes();

    if (event.target !== nodes.form) return;

    blockLoginEmailFormatIfInvalid(event);
  }

  function onLoginEmailKey(event) {
    if (!isLoginEmailPage()) return;

    const nodes = getLoginEmailNodes();

    if (event.target !== nodes.input) return;
    if (event.key !== "Enter") return;

    blockLoginEmailFormatIfInvalid(event);
  }

  function onLoginEmailInput(event) {
    if (!isLoginEmailPage()) return;

    const nodes = getLoginEmailNodes();

    if (event.target !== nodes.input) return;

    if (isLoginEmailInvalidFormat()) {
      if (nodes.input.classList.contains("ml-has-format-error")) {
        showLoginEmailFormatError();
      }

      return;
    }

    clearLoginEmailFormatError();
  }

  function onLoginEmailBlur(event) {
    if (!isLoginEmailPage()) return;

    const nodes = getLoginEmailNodes();

    if (event.target !== nodes.input) return;

    validateLoginEmailFormat(true);
  }

  function prepareLoginEmailValidation() {
    const nodes = getLoginEmailNodes();

    if (nodes.form) {
      nodes.form.setAttribute("novalidate", "novalidate");
    }
  }

  function start() {
    injectStyles();
    prepareLoginEmailValidation();

    document.addEventListener("keydown", onUserEditingOtp, true);
    document.addEventListener("input", onUserEditingOtp, true);
    document.addEventListener("paste", onUserEditingOtp, true);
    document.addEventListener("click", onSubmitOtp, true);

    document.addEventListener("pointerdown", onLoginEmailAction, true);
    document.addEventListener("click", onLoginEmailAction, true);
    document.addEventListener("submit", onLoginEmailSubmit, true);
    document.addEventListener("keydown", onLoginEmailKey, true);
    document.addEventListener("keyup", onLoginEmailKey, true);
    document.addEventListener("input", onLoginEmailInput, true);
    document.addEventListener("change", onLoginEmailInput, true);
    document.addEventListener("blur", onLoginEmailBlur, true);

    document.addEventListener(
      "submit",
      function () {
        dismissedOtpInvalid = false;
      },
      true
    );

    timer = window.setInterval(function () {
      checkOtpInvalidState();
      prepareLoginEmailValidation();
    }, CHECK_INTERVAL_MS);

    checkOtpInvalidState();

    console.log("[Merlin Error UI] loaded");
  }

  window.__merlinErrorUiStop = function () {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }

    emailFormatTimers.forEach(clearTimeout);
    emailFormatTimers = [];

    document.removeEventListener("keydown", onUserEditingOtp, true);
    document.removeEventListener("input", onUserEditingOtp, true);
    document.removeEventListener("paste", onUserEditingOtp, true);
    document.removeEventListener("click", onSubmitOtp, true);

    document.removeEventListener("pointerdown", onLoginEmailAction, true);
    document.removeEventListener("click", onLoginEmailAction, true);
    document.removeEventListener("submit", onLoginEmailSubmit, true);
    document.removeEventListener("keydown", onLoginEmailKey, true);
    document.removeEventListener("keyup", onLoginEmailKey, true);
    document.removeEventListener("input", onLoginEmailInput, true);
    document.removeEventListener("change", onLoginEmailInput, true);
    document.removeEventListener("blur", onLoginEmailBlur, true);

    getOtpCells().forEach(function (cell) {
      cell.classList.remove("is-invalid");
      cell.removeAttribute("aria-invalid");
    });

    const message = getOtpInvalidMessage();

    if (message) {
      message.hidden = true;
    }

    clearLoginEmailFormatError();

    if (emailFormatErrorBox) {
      emailFormatErrorBox.remove();
      emailFormatErrorBox = null;
    }

    restoreNativeInvalidOtpErrors();

    const style = document.getElementById(STYLE_ID);

    if (style) {
      style.remove();
    }

    delete window.__merlinErrorUiStop;

    console.log("[Merlin Error UI] stopped");
  };

  start();
})();