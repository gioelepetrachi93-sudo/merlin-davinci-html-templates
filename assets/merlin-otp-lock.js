(function () {
  if (window.__merlinVerificationLockStop) {
    try {
      window.__merlinVerificationLockStop();
    } catch (error) {}
  }

  const VERIFICATION_MAX_INVALID_ATTEMPTS = 3;
  const VERIFICATION_LOCK_SECONDS = 60;
  const VERIFICATION_VALIDITY_SECONDS = 15 * 60;
  const VERIFICATION_LOCK_MESSAGE_ID = "merlin-verification-lock-message";
  const VERIFICATION_LOCK_SECONDS_ID = "merlin-verification-lock-seconds";
  const VERIFICATION_STORAGE_PREFIX = "merlin_verification_lock_v1:";
  const LEGACY_LOCK_MESSAGE_IDS = [
    "merlin-otp-lock-message",
    "merlin-passcode-lock-message",
    "merlin-unified-otp-lock-message",
    "merlin-registration-verify-lock-message",
    "merlin-persistent-verification-lock-message"
  ];

  let verificationMode = null;
  let verificationInvalidAttempts = 0;
  let verificationLockedUntil = 0;
  let verificationValidUntil = 0;
  let verificationSubmitSequence = 0;
  let verificationCountedSequence = 0;
  let verificationLockTimer = null;
  let verificationValidityTimer = null;
  let verificationClickHandlerInstalled = false;
  let verificationLastErrorElement = null;
  let verificationLastRenderedSecond = null;
  let verificationLastValiditySecond = null;

  const VERIFICATION_DISABLED_STATE = new WeakMap();
  const VERIFICATION_DISABLED_ELEMENTS = new Set();

  function normalizeText(text) {
    return String(text || "")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function getVerificationRoot() {
    return document.querySelector(".mv-body-inner") ||
      document.querySelector(".mv-body") ||
      document.querySelector(".merlin-verify") ||
      document.body;
  }

  function isElementVisible(element) {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== "none" &&
      style.visibility !== "hidden"
    );
  }

  function getVisibleVerificationInputs() {
    return Array.from(getVerificationRoot().querySelectorAll("input")).filter(isElementVisible);
  }

  function detectVerificationMode() {
    const root = getVerificationRoot();
    const text = normalizeText(root.textContent);
    const inputs = getVisibleVerificationInputs();

    if (
      inputs.length >= 4 ||
      text.includes("resend passcode") ||
      text.includes("email sent to:") ||
      text.includes("one-time passcode") ||
      text.includes("6-digit")
    ) {
      return "split-passcode";
    }

    if (
      (text.includes("verify your account") || text.includes("verify your email")) &&
      (inputs.length > 0 ||
        text.includes("didn't receive a code") ||
        text.includes("invalid verification code") ||
        text.includes("resend") ||
        text.includes("send another"))
    ) {
      return "single-code";
    }

    return null;
  }

  function getVerificationStorageKey(mode) {
    const params = new URLSearchParams(window.location.search);
    const scope = [
      window.location.origin,
      window.location.pathname,
      params.get("client_id") || "",
      params.get("login_hint") || "",
      params.get("from") || "",
      mode || "unknown"
    ].join("|");

    return VERIFICATION_STORAGE_PREFIX + scope;
  }

  function readStoredVerificationState(mode) {
    try {
      return JSON.parse(sessionStorage.getItem(getVerificationStorageKey(mode)) || "null");
    } catch (error) {
      return null;
    }
  }

  function writeStoredVerificationState() {
    if (!verificationMode) return;

    try {
      sessionStorage.setItem(
        getVerificationStorageKey(verificationMode),
        JSON.stringify({
          attempts: verificationInvalidAttempts,
          lockedUntil: verificationLockedUntil
        })
      );
    } catch (error) {}
  }

  function clearStoredVerificationState(mode) {
    try {
      sessionStorage.removeItem(getVerificationStorageKey(mode || verificationMode));
    } catch (error) {}
  }

  function loadStoredVerificationState(mode) {
    const stored = readStoredVerificationState(mode);

    verificationInvalidAttempts = Math.max(0, Number(stored && stored.attempts ? stored.attempts : 0));
    verificationLockedUntil = Math.max(0, Number(stored && stored.lockedUntil ? stored.lockedUntil : 0));

    if (verificationLockedUntil && verificationLockedUntil <= Date.now()) {
      clearStoredVerificationState(mode);
      verificationInvalidAttempts = 0;
      verificationLockedUntil = 0;
    }
  }

  function removeLegacyVerificationLockMessages() {
    LEGACY_LOCK_MESSAGE_IDS.forEach(function (id) {
      const element = document.getElementById(id);

      if (element) {
        element.remove();
      }
    });
  }

  function findVerificationContinueButton() {
    return Array.from(
      getVerificationRoot().querySelectorAll("button, [role='button'], input[type='submit']")
    ).find(function (element) {
      const text = normalizeText(
        element.textContent || element.value || element.getAttribute("aria-label")
      );
      const value = normalizeText(element.getAttribute("data-skbuttonvalue"));
      const id = normalizeText(element.id);

      return (
        text.includes("continue") ||
        text.includes("let's go") ||
        text.includes("lets go") ||
        value === "next" ||
        value === "continue" ||
        id === "submit"
      );
    });
  }

  function findVerificationResendAction() {
    return Array.from(
      getVerificationRoot().querySelectorAll("a, button, [role='button']")
    ).find(function (element) {
      const text = normalizeText(element.textContent || element.getAttribute("aria-label"));
      const value = normalizeText(element.getAttribute("data-skbuttonvalue"));

      return text.includes("resend") || text.includes("send another") || value === "resend";
    });
  }

  function findVerificationValidityElement() {
    return document.querySelector(".mv-validity") ||
      document.querySelector("[data-merlin-validity-timer]");
  }

  function formatValidityTime(totalSeconds) {
    const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    return minutes + ":" + String(seconds).padStart(2, "0");
  }

  function resetVerificationValidityTimer() {
    verificationValidUntil = Date.now() + VERIFICATION_VALIDITY_SECONDS * 1000;
    verificationLastValiditySecond = VERIFICATION_VALIDITY_SECONDS;

    const timerElement = findVerificationValidityElement();

    if (timerElement) {
      timerElement.textContent = "Valid for " + formatValidityTime(VERIFICATION_VALIDITY_SECONDS);
    }
  }

  function updateVerificationValidityUi() {
    const timerElement = findVerificationValidityElement();

    if (!timerElement) return;

    if (!verificationValidUntil) {
      resetVerificationValidityTimer();
      return;
    }

    const remainingSeconds = Math.max(0, Math.ceil((verificationValidUntil - Date.now()) / 1000));

    if (remainingSeconds === verificationLastValiditySecond) return;

    verificationLastValiditySecond = remainingSeconds;

    if (remainingSeconds <= 0) {
      timerElement.textContent = "Expired";

      const continueButton = findVerificationContinueButton();
      setVerificationControlDisabled(continueButton, true);
      return;
    }

    timerElement.textContent = "Valid for " + formatValidityTime(remainingSeconds);
  }

  function isInvalidVerificationText(text) {
    const value = normalizeText(text);

    if (value === "invalid verification code") return true;

    const mentionsOtp =
      value.includes("code") ||
      value.includes("passcode") ||
      value.includes("one-time");

    const saysInvalid =
      value.includes("invalid") ||
      value.includes("isn't valid") ||
      value.includes("is not valid") ||
      value.includes("not valid") ||
      value.includes("try again");

    return mentionsOtp && saysInvalid;
  }

  function findVerificationInvalidError() {
    const error = Array.from(getVerificationRoot().querySelectorAll("*"))
      .filter(isElementVisible)
      .find(function (element) {
        if (
          element.id === VERIFICATION_LOCK_MESSAGE_ID ||
          element.closest("#" + VERIFICATION_LOCK_MESSAGE_ID)
        ) {
          return false;
        }

        if (
          LEGACY_LOCK_MESSAGE_IDS.some(function (id) {
            return element.id === id || element.closest("#" + id);
          })
        ) {
          return false;
        }

        if (!isInvalidVerificationText(element.textContent)) return false;

        return !Array.from(element.children || []).some(function (child) {
          return isInvalidVerificationText(child.textContent);
        });
      });

    if (error) {
      verificationLastErrorElement = error;
    }

    return error || (isElementVisible(verificationLastErrorElement) ? verificationLastErrorElement : null);
  }

  function rememberVerificationDisabledState(element) {
    if (!element || VERIFICATION_DISABLED_STATE.has(element)) return;

    VERIFICATION_DISABLED_STATE.set(element, {
      disabled: "disabled" in element ? element.disabled : null,
      ariaDisabled: element.getAttribute("aria-disabled"),
      pointerEvents: element.style.getPropertyValue("pointer-events"),
      pointerEventsPriority: element.style.getPropertyPriority("pointer-events"),
      opacity: element.style.getPropertyValue("opacity"),
      opacityPriority: element.style.getPropertyPriority("opacity")
    });

    VERIFICATION_DISABLED_ELEMENTS.add(element);
  }

  function restoreVerificationDisabledState(element) {
    const state = VERIFICATION_DISABLED_STATE.get(element);

    if (!element || !state) return;

    if (state.disabled !== null && "disabled" in element) {
      element.disabled = state.disabled;
    }

    if (state.ariaDisabled === null) {
      element.removeAttribute("aria-disabled");
    } else {
      element.setAttribute("aria-disabled", state.ariaDisabled);
    }

    if (state.pointerEvents) {
      element.style.setProperty("pointer-events", state.pointerEvents, state.pointerEventsPriority);
    } else {
      element.style.removeProperty("pointer-events");
    }

    if (state.opacity) {
      element.style.setProperty("opacity", state.opacity, state.opacityPriority);
    } else {
      element.style.removeProperty("opacity");
    }

    VERIFICATION_DISABLED_STATE.delete(element);
    VERIFICATION_DISABLED_ELEMENTS.delete(element);
  }

  function setVerificationControlDisabled(element, disabled) {
    if (!element) return;

    if (disabled) {
      rememberVerificationDisabledState(element);

      if ("disabled" in element) {
        element.disabled = true;
      }

      element.setAttribute("aria-disabled", "true");
      element.style.setProperty("pointer-events", "none", "important");
      element.style.setProperty("opacity", "0.45", "important");
      return;
    }

    restoreVerificationDisabledState(element);
  }

  function removeVerificationLockMessage() {
    const message = document.getElementById(VERIFICATION_LOCK_MESSAGE_ID);

    if (message) {
      message.remove();
    }
  }

  function resetVerificationLockState(clearStorage) {
    verificationInvalidAttempts = 0;
    verificationLockedUntil = 0;
    verificationSubmitSequence = 0;
    verificationCountedSequence = 0;
    verificationLastErrorElement = null;
    verificationLastRenderedSecond = null;

    removeVerificationLockMessage();

    VERIFICATION_DISABLED_ELEMENTS.forEach(function (element) {
      restoreVerificationDisabledState(element);
    });

    if (clearStorage !== false) {
      clearStoredVerificationState();
    }

    updateVerificationValidityUi();
  }

  function resetVerificationLockIfExpired() {
    if (verificationLockedUntil && verificationLockedUntil <= Date.now()) {
      resetVerificationLockState(true);
      return true;
    }

    return false;
  }

  function syncVerificationMode() {
    const nextMode = detectVerificationMode();

    if (verificationMode !== nextMode) {
      VERIFICATION_DISABLED_ELEMENTS.forEach(function (element) {
        restoreVerificationDisabledState(element);
      });

      removeVerificationLockMessage();

      verificationSubmitSequence = 0;
      verificationCountedSequence = 0;
      verificationLastErrorElement = null;
      verificationLastRenderedSecond = null;
      verificationMode = nextMode;

      if (verificationMode) {
        loadStoredVerificationState(verificationMode);
        resetVerificationValidityTimer();
      } else {
        verificationInvalidAttempts = 0;
        verificationLockedUntil = 0;
      }
    }

    return verificationMode;
  }

  function getVerificationInputAnchor() {
    const root = getVerificationRoot();
    const codeInput = root.querySelector(".mv-code-input");

    if (codeInput) return codeInput;

    const input = getVisibleVerificationInputs()[0];

    if (!input) return null;

    return input.closest("div") || input;
  }

  function getVerificationErrorBlock(errorElement) {
    if (!errorElement) return null;

    const parent = errorElement.parentElement;

    if (
      parent &&
      parent !== getVerificationRoot() &&
      parent.children.length <= 3 &&
      isInvalidVerificationText(parent.textContent)
    ) {
      return parent;
    }

    return errorElement;
  }

  function getVerificationLockMessage(errorElement) {
    let message = document.getElementById(VERIFICATION_LOCK_MESSAGE_ID);

    if (!message) {
      message = document.createElement("div");
      message.id = VERIFICATION_LOCK_MESSAGE_ID;
    }

    const currentSeconds =
      message.querySelector("#" + VERIFICATION_LOCK_SECONDS_ID)?.textContent || "";

    if (!message.querySelector(".merlin-lock-error")) {
      message.innerHTML = `
        <div class="merlin-lock-error">Invalid verification code</div>
        <div class="merlin-lock-timer">Too many attempts. Try again in <span id="${VERIFICATION_LOCK_SECONDS_ID}">${currentSeconds}</span>s.</div>
      `;
    }

    const errorBlock = getVerificationErrorBlock(errorElement);
    const inputAnchor = getVerificationInputAnchor();
    const root = getVerificationRoot();

    if (errorBlock && message.previousElementSibling !== errorBlock) {
      errorBlock.insertAdjacentElement("afterend", message);
    } else if (!errorBlock && inputAnchor && message.nextElementSibling !== inputAnchor) {
      inputAnchor.insertAdjacentElement("beforebegin", message);
    } else if (!errorBlock && !inputAnchor && message.parentElement !== root) {
      root.prepend(message);
    }

    message.style.setProperty("position", "static", "important");
    message.style.setProperty("display", "block", "important");
    message.style.setProperty("visibility", "visible", "important");
    message.style.setProperty("opacity", "1", "important");
    message.style.setProperty("width", "100%", "important");
    message.style.setProperty("max-width", "100%", "important");
    message.style.setProperty("box-sizing", "border-box", "important");
    message.style.setProperty("margin", "0 0 12px 0", "important");
    message.style.setProperty("padding", "0", "important");
    message.style.setProperty("font-family", "inherit", "important");
    message.style.setProperty("font-size", "13px", "important");
    message.style.setProperty("line-height", "17px", "important");
    message.style.setProperty("color", "#d93025", "important");
    message.style.setProperty("text-align", "center", "important");
    message.style.setProperty("background", "transparent", "important");
    message.style.setProperty("pointer-events", "none", "important");

    const errorLine = message.querySelector(".merlin-lock-error");
    const timerLine = message.querySelector(".merlin-lock-timer");

    if (errorLine) {
      errorLine.style.setProperty("font-weight", "400", "important");
      errorLine.style.setProperty("margin", "0 0 2px 0", "important");
    }

    if (timerLine) {
      timerLine.style.setProperty("font-weight", "700", "important");
      timerLine.style.setProperty("margin", "0", "important");
    }

    return message;
  }

  function updateVerificationLockMessage(remainingSeconds, errorElement) {
    const message = getVerificationLockMessage(errorElement);
    const seconds = message.querySelector("#" + VERIFICATION_LOCK_SECONDS_ID);

    if (seconds && verificationLastRenderedSecond !== remainingSeconds) {
      seconds.textContent = String(remainingSeconds);
      verificationLastRenderedSecond = remainingSeconds;
    }
  }

  function updateVerificationLockUi() {
    removeLegacyVerificationLockMessages();

    const mode = syncVerificationMode();

    if (!mode) {
      removeVerificationLockMessage();
      return;
    }

    if (resetVerificationLockIfExpired()) return;

    const isLocked = verificationLockedUntil > Date.now();
    const isValidityExpired = verificationValidUntil > 0 && verificationValidUntil <= Date.now();
    const remainingSeconds = Math.max(0, Math.ceil((verificationLockedUntil - Date.now()) / 1000));
    const continueButton = findVerificationContinueButton();
    const resendAction = findVerificationResendAction();
    const errorElement = findVerificationInvalidError();

    setVerificationControlDisabled(continueButton, isLocked || isValidityExpired);
    setVerificationControlDisabled(resendAction, isLocked);

    if (isLocked) {
      updateVerificationLockMessage(remainingSeconds, errorElement);
    }

    updateVerificationValidityUi();
  }

  function lockVerificationControls() {
    verificationLockedUntil = Date.now() + VERIFICATION_LOCK_SECONDS * 1000;
    writeStoredVerificationState();
    updateVerificationLockUi();
  }

  function countVerificationInvalidAttempt(sequence) {
    removeLegacyVerificationLockMessages();
    syncVerificationMode();
    resetVerificationLockIfExpired();

    if (sequence <= verificationCountedSequence) return;

    const errorElement = findVerificationInvalidError();

    if (!errorElement) return;

    verificationCountedSequence = sequence;
    verificationInvalidAttempts += 1;
    writeStoredVerificationState();

    if (verificationInvalidAttempts >= VERIFICATION_MAX_INVALID_ATTEMPTS) {
      lockVerificationControls();
      return;
    }

    updateVerificationLockUi();
  }

  function handleVerificationClick(event) {
    removeLegacyVerificationLockMessages();

    const mode = syncVerificationMode();

    if (!mode) return;

    const expired = resetVerificationLockIfExpired();
    const continueButton = findVerificationContinueButton();
    const resendAction = findVerificationResendAction();
    const isLocked = verificationLockedUntil > Date.now();
    const isValidityExpired = verificationValidUntil > 0 && verificationValidUntil <= Date.now();

    if (!isLocked && expired && resendAction && resendAction.contains(event.target)) {
      resetVerificationLockState(true);
      resetVerificationValidityTimer();
      return;
    }

    if (!isLocked && resendAction && resendAction.contains(event.target)) {
      resetVerificationLockState(true);
      resetVerificationValidityTimer();
      return;
    }

    if (isLocked && resendAction && resendAction.contains(event.target)) {
      event.preventDefault();
      event.stopPropagation();
      updateVerificationLockUi();
      return;
    }

    if (!continueButton || !continueButton.contains(event.target)) return;

    if (isLocked || isValidityExpired) {
      event.preventDefault();
      event.stopPropagation();
      updateVerificationLockUi();
      return;
    }

    verificationSubmitSequence += 1;

    const sequence = verificationSubmitSequence;

    [400, 900, 1500, 2500, 4000].forEach(function (delay) {
      setTimeout(function () {
        countVerificationInvalidAttempt(sequence);
      }, delay);
    });
  }

  function installVerificationRetryLock() {
    if (!verificationClickHandlerInstalled) {
      document.addEventListener("click", handleVerificationClick, true);
      verificationClickHandlerInstalled = true;
    }

    if (!verificationLockTimer) {
      verificationLockTimer = setInterval(updateVerificationLockUi, 250);
    }

    if (!verificationValidityTimer) {
      verificationValidityTimer = setInterval(updateVerificationValidityUi, 1000);
    }

    window.__merlinVerificationLockStop = function () {
      document.removeEventListener("click", handleVerificationClick, true);
      verificationClickHandlerInstalled = false;

      if (verificationLockTimer) {
        clearInterval(verificationLockTimer);
        verificationLockTimer = null;
      }

      if (verificationValidityTimer) {
        clearInterval(verificationValidityTimer);
        verificationValidityTimer = null;
      }

      resetVerificationLockState(false);
      removeLegacyVerificationLockMessages();

      console.log("[Merlin OTP Lock] Verification lock stopped");
    };

    updateVerificationLockUi();
  }

  function init() {
    console.log("[Merlin OTP Lock] loaded");
    installVerificationRetryLock();
    resetVerificationValidityTimer();
    setTimeout(updateVerificationLockUi, 100);
    setTimeout(updateVerificationLockUi, 500);
    setTimeout(updateVerificationLockUi, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();