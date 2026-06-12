(function () {
  "use strict";

  if (window.__merlinErrorUiStop) {
    try {
      window.__merlinErrorUiStop();
    } catch (error) {}
  }

  const STYLE_ID = "merlin-error-ui-style";
  const CHECK_INTERVAL_MS = 300;

  let timer = null;
  let dismissedOtpInvalid = false;

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
      .merlin-verify .mv-otp-boxes > .mv-otp-box.is-invalid {
        border-color: #FF3434 !important;
        box-shadow: none !important;
        outline-color: #FF3434 !important;
      }

      .merlin-verify .mv-otp-error {
        display: block;
        margin: 10px 0 0;
        padding: 0;
        color: #FF3434;
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

      .merlin-error-ui-native-hidden {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
    `;

    document.head.appendChild(style);
  }

  function isVerifyEmailPage() {
    return !!(
      document.querySelector(".merlin-verify") &&
      document.querySelector(".mv-otp-boxes") &&
      document.querySelector(".mv-otp-boxes > .mv-otp-box")
    );
  }

  function getVerifyRoot() {
    return document.querySelector(".merlin-verify") || document.body;
  }

  function getOtpBoxes() {
    return Array.from(
      getVerifyRoot().querySelectorAll(".mv-otp-boxes > .mv-otp-box")
    ).filter(isVisible);
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

    return Array.from(
      root.querySelectorAll("[role='alert'], [aria-live], .error, .Error, [class*='error'], [class*='Error'], p, span, div")
    )
      .filter(isVisible)
      .filter(function (element) {
        if (element.id === "mvOtpInvalidMessage") return false;
        if (element.closest("#mvOtpInvalidMessage")) return false;
        if (element.closest(".mv-otp-boxes")) return false;
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

    const boxes = getOtpBoxes();
    const message = getOtpInvalidMessage();

    if (!boxes.length || !message) return;

    boxes.forEach(function (box) {
      box.classList.add("is-invalid");
      box.setAttribute("aria-invalid", "true");
    });

    message.hidden = false;
    hideNativeInvalidOtpErrors();
  }

  function clearOtpInvalidState() {
    dismissedOtpInvalid = true;

    getOtpBoxes().forEach(function (box) {
      box.classList.remove("is-invalid");
      box.removeAttribute("aria-invalid");
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

  function onUserEditingOtp(event) {
    if (!isVerifyEmailPage()) return;

    const isEditing =
      event.type === "paste" ||
      event.type === "input" ||
      (
        event.type === "keydown" &&
        (
          event.key === "Backspace" ||
          event.key === "Delete" ||
          (event.key && event.key.length === 1)
        )
      );

    if (!isEditing) return;

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

  function start() {
    injectStyles();

    document.addEventListener("keydown", onUserEditingOtp, true);
    document.addEventListener("input", onUserEditingOtp, true);
    document.addEventListener("paste", onUserEditingOtp, true);
    document.addEventListener("click", onSubmitOtp, true);
    document.addEventListener(
      "submit",
      function () {
        dismissedOtpInvalid = false;
      },
      true
    );

    timer = window.setInterval(checkOtpInvalidState, CHECK_INTERVAL_MS);
    checkOtpInvalidState();

    console.log("[Merlin Error UI] loaded");
  }

  window.__merlinErrorUiStop = function () {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }

    document.removeEventListener("keydown", onUserEditingOtp, true);
    document.removeEventListener("input", onUserEditingOtp, true);
    document.removeEventListener("paste", onUserEditingOtp, true);
    document.removeEventListener("click", onSubmitOtp, true);

    getOtpBoxes().forEach(function (box) {
      box.classList.remove("is-invalid");
      box.removeAttribute("aria-invalid");
    });

    const message = getOtpInvalidMessage();

    if (message) {
      message.hidden = true;
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