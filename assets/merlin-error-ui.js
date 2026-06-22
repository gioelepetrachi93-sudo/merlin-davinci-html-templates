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
    { wrapper: ".mv-otp-wrapper", cell: ".mv-otp-wrapper > .mv-otp-cell" },
    { wrapper: ".mv-otp-boxes", cell: ".mv-otp-boxes > .mv-otp-box" }
  ];

  const EMAIL_FORMAT_ERROR_TEXT = "Please check your email format (e.g. name@mail.com)";
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  let timer = null;
  let dismissedOtpInvalid = false;
  let emailFormatErrorBox = null;
  let emailFormatTimers = [];
  let recordsErrorTimers = [];

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

      .merlin-login .merlin-records-error {
        display: grid !important;
        grid-template-columns: 15px 1fr !important;
        column-gap: 8px !important;
        align-items: start !important;
        width: 100% !important;
        margin: 8px 0 0 !important;
        padding: 12px 16px !important;
        border-radius: 22px !important;
        background: #FFFFFF !important;
        border: 0 !important;
        box-shadow: none !important;
        color: #475569 !important;
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
        text-align: left !important;
      }

      .merlin-records-error__icon {
        width: 15px !important;
        height: 13px !important;
        margin-top: 1px !important;
        display: block !important;
      }

      .merlin-records-error__title {
        margin: 0 0 2px !important;
        color: ${ERROR_RED} !important;
        font-size: 12px !important;
        font-weight: 400 !important;
        line-height: 17px !important;
      }

      .merlin-records-error__body {
        margin: 0 !important;
        color: #475569 !important;
        font-size: 14px !important;
        font-weight: 400 !important;
        line-height: 20px !important;
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
      return !!(root.querySelector(config.wrapper) && root.querySelector(config.cell));
    }) || null;
  }

  function isVerifyEmailPage() {
    return !!(document.querySelector(".merlin-verify") && getActiveOtpConfig());
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

    if (findNativeInvalidOtpErrors().length > 0) {
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

    if (!root) return {};

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

    return !!(nodes.root && nodes.form && nodes.input && nodes.button);
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
    scheduleRecordsErrorCheck();
  }

  function onLoginEmailSubmit(event) {
    if (!isLoginEmailPage()) return;

    const nodes = getLoginEmailNodes();

    if (event.target === nodes.form) {
      blockLoginEmailFormatIfInvalid(event);
      scheduleRecordsErrorCheck();
    }
  }

  function onLoginEmailKey(event) {
    if (!isLoginEmailPage()) return;

    const nodes = getLoginEmailNodes();

    if (event.target !== nodes.input) return;
    if (event.key !== "Enter") return;

    blockLoginEmailFormatIfInvalid(event);
    scheduleRecordsErrorCheck();
  }

  function onLoginEmailInput(event) {
    if (!isLoginEmailPage()) return;

    const nodes = getLoginEmailNodes();

    if (event.target !== nodes.input) return;

    clearRecordsErrors();

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

  function getRecordsIconSvg() {
    return (
      '<svg class="merlin-records-error__icon" width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path d="M7.24909 7.75V5.25M8.14971 1.26375L13.616 10.7556C13.9991 11.4244 13.5041 12.25 12.7153 12.25H1.78284C0.994086 12.25 0.499086 11.4244 0.882211 10.7556L6.34846 1.26375C6.74221 0.57875 7.75596 0.57875 8.14971 1.26375ZM7.24909 10.625C7.59427 10.625 7.87409 10.3452 7.87409 10C7.87409 9.65482 7.59427 9.375 7.24909 9.375C6.90391 9.375 6.62409 9.65482 6.62409 10C6.62409 10.3452 6.90391 10.625 7.24909 10.625Z" stroke="#FF383C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>'
    );
  }

  function renderRecordsError(target, type) {
    const copy = type === "phone"
      ? {
          title: "This mobile number is not in our records",
          body: "We don't recognise this mobile number. Please check it's entered correctly, or try a different one."
        }
      : {
          title: "This email address is not in our records",
          body: "We don't recognise this email address. Please check it's entered correctly, or try a different one."
        };

    if (!target) return;

    target.dataset.merlinRecordsErrorType = type;
    target.classList.add("merlin-records-error");

    target.innerHTML =
      getRecordsIconSvg() +
      '<div>' +
        '<p class="merlin-records-error__title">' + copy.title + '</p>' +
        '<p class="merlin-records-error__body">' + copy.body + '</p>' +
      '</div>';
  }

  function isEmailRecordsText(text) {
    const value = normalizeText(text);

    return (
      value.includes("email address is not in our records") ||
      value.includes("email adress is not in our records") ||
      value.includes("try with a different one")
    );
  }

  function isPhoneRecordsText(text) {
    const value = normalizeText(text);

    return value === "something went wrong." || value === "something went wrong";
  }

  function isPhoneRecordsContext(target) {
    const root = document.querySelector(".merlin-login");

    if (!root || !target) return false;
    if (target.classList.contains("ml-phone-error-card")) return true;

    const pageText = normalizeText(root.textContent);

    return (
      pageText.includes("mobile number") ||
      pageText.includes("choose email") ||
      pageText.includes("unable to access sms")
    );
  }

  function applyRecordsErrors() {
    const root = document.querySelector(".merlin-login");

    if (!root) return;
    if (isLoginEmailInvalidFormat()) return;

    Array.from(root.querySelectorAll(".ml-flow-error, [data-skcomponent='skerror']")).forEach(function (target) {
      if (!target || !isVisible(target)) return;

      const existingType = target.dataset.merlinRecordsErrorType;

      if (existingType === "email" || existingType === "phone") {
        return;
      }

      const text = target.textContent;

      if (isEmailRecordsText(text)) {
        renderRecordsError(target, "email");
        return;
      }

      if (isPhoneRecordsText(text) && isPhoneRecordsContext(target)) {
        renderRecordsError(target, "phone");
      }
    });
  }

  function scheduleRecordsErrorCheck() {
    recordsErrorTimers.forEach(clearTimeout);

    recordsErrorTimers = [0, 100, 300, 700, 1200, 2000, 3500, 5000].map(function (delay) {
      return window.setTimeout(applyRecordsErrors, delay);
    });
  }

  function clearRecordsErrors() {
    document.querySelectorAll(".merlin-records-error").forEach(function (target) {
      target.classList.remove("merlin-records-error");
      target.removeAttribute("data-merlin-records-error-type");
      target.textContent = "";
    });
  }

  function onAnyLoginInput(event) {
    const root = document.querySelector(".merlin-login");

    if (!root || !event.target || !root.contains(event.target)) return;
    if (!event.target.matches || !event.target.matches("input, select, textarea")) return;

    clearRecordsErrors();
  }

  function onAnyLoginAction(event) {
    const root = document.querySelector(".merlin-login");

    if (!root || !event.target || !root.contains(event.target)) return;

    const action =
      event.target.closest &&
      event.target.closest("#btnContinue, button, input[type='submit'], [role='button']");

    if (!action) return;

    scheduleRecordsErrorCheck();
  }

  function onAnyLoginSubmit(event) {
    const root = document.querySelector(".merlin-login");

    if (!root || !event.target || !root.contains(event.target)) return;

    scheduleRecordsErrorCheck();
  }

  function onAnySubmitForOtp() {
    dismissedOtpInvalid = false;
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

    document.addEventListener("pointerdown", onAnyLoginAction, true);
    document.addEventListener("click", onAnyLoginAction, true);
    document.addEventListener("submit", onAnyLoginSubmit, true);
    document.addEventListener("input", onAnyLoginInput, true);
    document.addEventListener("change", onAnyLoginInput, true);

    document.addEventListener("submit", onAnySubmitForOtp, true);

    timer = window.setInterval(function () {
      checkOtpInvalidState();
      prepareLoginEmailValidation();
      applyRecordsErrors();
    }, CHECK_INTERVAL_MS);

    checkOtpInvalidState();
    applyRecordsErrors();

    console.log("[Merlin Error UI] loaded");
  }

  window.__merlinErrorUiStop = function () {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }

    emailFormatTimers.forEach(clearTimeout);
    emailFormatTimers = [];

    recordsErrorTimers.forEach(clearTimeout);
    recordsErrorTimers = [];

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

    document.removeEventListener("pointerdown", onAnyLoginAction, true);
    document.removeEventListener("click", onAnyLoginAction, true);
    document.removeEventListener("submit", onAnyLoginSubmit, true);
    document.removeEventListener("input", onAnyLoginInput, true);
    document.removeEventListener("change", onAnyLoginInput, true);

    document.removeEventListener("submit", onAnySubmitForOtp, true);

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

    clearRecordsErrors();
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