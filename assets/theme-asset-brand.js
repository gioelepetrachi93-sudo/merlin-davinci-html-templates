(function () {
  const DEFAULT_THEME_CODE = "000";
  const SESSION_KEY = "merlin_asset_theme_code";
  const STYLE_ID = "merlin-asset-brand-style";

  const CDN_BASE =
    "https://cdn.jsdelivr.net/gh/gioelepetrachi93-sudo/merlin-davinci-html-templates@main/assets/brand-logos/";

  const ASSET_VERSION = "v=1";
  const PAGE_BACKGROUND = "#FFF8E2";
  const BASE_TEXT = "#000B5E";
  const INPUT_BACKGROUND = "#FFFFFF";
  const INPUT_BORDER = "rgba(0, 11, 94, 0.25)";
  const MOBILE_HEADER_HEIGHT = "140px";
  const DESKTOP_BREAKPOINT = 900;

  const VERIFICATION_MAX_INVALID_ATTEMPTS = 3;
  const VERIFICATION_LOCK_SECONDS = 60;
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

  const THEMES = {
    "001": {
      code: "001",
      name: "Alton Towers",
      background: "#283269",
      logoFile: "001-alton-towers.svg",
      logoWidth: "auto",
      logoHeight: "175px",
      logoMaxWidth: "250px",
      logoMaxHeight: "190px",
      logoScale: "1",
      mobileLogoWidth: "auto",
      mobileLogoHeight: "95px",
      mobileLogoMaxWidth: "150px",
      mobileLogoMaxHeight: "105px",
      mobileLogoScale: "1",
      stageWidth: "300px",
      stageHeight: "300px",
      mobileStageWidth: "180px",
      mobileStageHeight: "140px"
    },

    "002": {
      code: "002",
      name: "LEGOLAND",
      background: "#FFCF00",
      logoFile: "002-legoland.svg",
      logoWidth: "300px",
      logoHeight: "auto",
      logoMaxWidth: "none",
      logoMaxHeight: "145px",
      logoScale: "1",
      mobileLogoWidth: "170px",
      mobileLogoHeight: "auto",
      mobileLogoMaxWidth: "76%",
      mobileLogoMaxHeight: "110px",
      mobileLogoScale: "1",
      stageWidth: "320px",
      stageHeight: "220px",
      mobileStageWidth: "180px",
      mobileStageHeight: "140px"
    },

    "003": {
      code: "003",
      name: "Warwick Castle",
      background: "#00415F",
      logoFile: "003-warwick-castle.svg",
      logoWidth: "230px",
      logoHeight: "auto",
      logoMaxWidth: "80%",
      logoMaxHeight: "145px",
      logoScale: "1",
      mobileLogoWidth: "145px",
      mobileLogoHeight: "auto",
      mobileLogoMaxWidth: "none",
      mobileLogoMaxHeight: "88px",
      mobileLogoScale: "1",
      stageWidth: "240px",
      stageHeight: "240px",
      mobileStageWidth: "180px",
      mobileStageHeight: "140px"
    },

    "004": {
      code: "004",
      name: "Gruffalo Blackpool",
      background: "#4A82BC",
      logoFile: "004-gruffalo-blackpool.svg",
      logoWidth: "420px",
      logoHeight: "auto",
      logoMaxWidth: "none",
      logoMaxHeight: "240px",
      logoScale: "1",
      mobileLogoWidth: "155px",
      mobileLogoHeight: "auto",
      mobileLogoMaxWidth: "none",
      mobileLogoMaxHeight: "95px",
      mobileLogoScale: "1",
      stageWidth: "460px",
      stageHeight: "300px",
      mobileStageWidth: "180px",
      mobileStageHeight: "140px"
    },

    "005": {
      code: "005",
      name: "Cadbury World",
      background: "#462F92",
      logoFile: "005-cadbury-world.svg",
      logoWidth: "300px",
      logoHeight: "auto",
      logoMaxWidth: "none",
      logoMaxHeight: "170px",
      logoScale: "1",
      mobileLogoWidth: "145px",
      mobileLogoHeight: "auto",
      mobileLogoMaxWidth: "none",
      mobileLogoMaxHeight: "88px",
      mobileLogoScale: "1",
      stageWidth: "340px",
      stageHeight: "230px",
      mobileStageWidth: "180px",
      mobileStageHeight: "140px"
    },

    "006": {
      code: "006",
      name: "Sea Life",
      background: "#282B91",
      logoFile: "006-sea-life.svg",
      logoWidth: "230px",
      logoHeight: "auto",
      logoMaxWidth: "80%",
      logoMaxHeight: "130px",
      logoScale: "1",
      mobileLogoWidth: "180px",
      mobileLogoHeight: "auto",
      mobileLogoMaxWidth: "78%",
      mobileLogoMaxHeight: "110px",
      mobileLogoScale: "1",
      stageWidth: "240px",
      stageHeight: "240px",
      mobileStageWidth: "180px",
      mobileStageHeight: "140px"
    },

    "007": {
      code: "007",
      name: "The Dungeons",
      background: "#000000",
      logoFile: "007-the-dungeons.svg",
      logoWidth: "700px",
      logoHeight: "auto",
      logoMaxWidth: "none",
      logoMaxHeight: "none",
      logoScale: "1.05",
      mobileLogoWidth: "285px",
      mobileLogoHeight: "auto",
      mobileLogoMaxWidth: "none",
      mobileLogoMaxHeight: "none",
      mobileLogoScale: "1",
      stageWidth: "760px",
      stageHeight: "420px",
      mobileStageWidth: "320px",
      mobileStageHeight: "140px"
    },

    "008": {
      code: "008",
      name: "Chessington",
      background: "#00A13A",
      logoFile: "008-chessington.svg",
      logoWidth: "360px",
      logoHeight: "auto",
      logoMaxWidth: "none",
      logoMaxHeight: "200px",
      logoScale: "1",
      mobileLogoWidth: "115px",
      mobileLogoHeight: "auto",
      mobileLogoMaxWidth: "none",
      mobileLogoMaxHeight: "86px",
      mobileLogoScale: "1",
      stageWidth: "400px",
      stageHeight: "260px",
      mobileStageWidth: "145px",
      mobileStageHeight: "140px"
    },

    "009": {
      code: "009",
      name: "Thorpe Park",
      background: "#FFFFFF",
      logoFile: "009-thorpe-park.svg",
      logoWidth: "310px",
      logoHeight: "auto",
      logoMaxWidth: "none",
      logoMaxHeight: "145px",
      logoScale: "1",
      mobileLogoWidth: "190px",
      mobileLogoHeight: "auto",
      mobileLogoMaxWidth: "none",
      mobileLogoMaxHeight: "95px",
      mobileLogoScale: "1",
      stageWidth: "350px",
      stageHeight: "220px",
      mobileStageWidth: "210px",
      mobileStageHeight: "140px"
    }
  };

  const VALID_THEME_CODES = [DEFAULT_THEME_CODE].concat(Object.keys(THEMES));

  let isApplyingTheme = false;
  let isApplyScheduled = false;
  let lastAppliedThemeCode = null;
  let lastAppliedMode = null;

  let verificationMode = null;
  let verificationInvalidAttempts = 0;
  let verificationLockedUntil = 0;
  let verificationSubmitSequence = 0;
  let verificationCountedSequence = 0;
  let verificationLockTimer = null;
  let verificationClickHandlerInstalled = false;
  let verificationLastErrorElement = null;
  let verificationLastRenderedSecond = null;

  const ORIGINAL_STYLES = new WeakMap();
  const TRACKED_ELEMENTS = new Set();
  const VERIFICATION_DISABLED_STATE = new WeakMap();
  const VERIFICATION_DISABLED_ELEMENTS = new Set();

  function getLogoUrl(theme) {
    return CDN_BASE + theme.logoFile + "?" + ASSET_VERSION;
  }

  function getFromParam() {
    return new URLSearchParams(window.location.search).get("from");
  }

  function getStoredThemeCode() {
    try {
      return sessionStorage.getItem(SESSION_KEY);
    } catch (error) {
      return null;
    }
  }

  function setStoredThemeCode(code) {
    try {
      sessionStorage.setItem(SESSION_KEY, code);
    } catch (error) {}
  }

  function resolveThemeCode() {
    const from = getFromParam();

    if (VALID_THEME_CODES.includes(from)) {
      setStoredThemeCode(from);
      return from;
    }

    return getStoredThemeCode() || DEFAULT_THEME_CODE;
  }

  function rememberStyle(element, property) {
    if (!element || !element.style) return;

    let record = ORIGINAL_STYLES.get(element);

    if (!record) {
      record = {};
      ORIGINAL_STYLES.set(element, record);
      TRACKED_ELEMENTS.add(element);
    }

    if (!Object.prototype.hasOwnProperty.call(record, property)) {
      record[property] = {
        value: element.style.getPropertyValue(property),
        priority: element.style.getPropertyPriority(property)
      };
    }
  }

  function setImportant(element, property, value) {
    if (!element || !element.style || value === undefined || value === null) return;

    rememberStyle(element, property);

    if (
      element.style.getPropertyValue(property) !== String(value) ||
      element.style.getPropertyPriority(property) !== "important"
    ) {
      element.style.setProperty(property, String(value), "important");
    }
  }

  function removeInlineProperty(element, property) {
    if (!element || !element.style) return;

    rememberStyle(element, property);

    if (element.style.getPropertyValue(property)) {
      element.style.removeProperty(property);
    }
  }

  function restoreTrackedStyles() {
    TRACKED_ELEMENTS.forEach(function (element) {
      const record = ORIGINAL_STYLES.get(element);

      if (!element || !element.style || !record) return;

      Object.keys(record).forEach(function (property) {
        const original = record[property];

        if (original.value) {
          element.style.setProperty(property, original.value, original.priority);
        } else {
          element.style.removeProperty(property);
        }
      });
    });

    TRACKED_ELEMENTS.clear();
  }

  function isDesktopLayout() {
    return window.innerWidth >= DESKTOP_BREAKPOINT;
  }

  function getResponsiveValue(theme, desktopKey, mobileKey, fallback) {
    return isDesktopLayout()
      ? theme[desktopKey] || fallback
      : theme[mobileKey] || theme[desktopKey] || fallback;
  }

  function normalizeText(text) {
    return String(text || "")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function getHeroElement() {
    return document.querySelector(".mv-hero") || document.querySelector(".mr-hero");
  }

  function getVerificationRoot() {
    return document.querySelector(".mv-body") || document.querySelector(".merlin-verify") || document.body;
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
      text.includes("verify your account") &&
      (inputs.length > 0 ||
        text.includes("didn't receive a code") ||
        text.includes("invalid verification code") ||
        text.includes("resend"))
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

      return text.includes("continue");
    });
  }

  function findVerificationResendAction() {
    return Array.from(
      getVerificationRoot().querySelectorAll("a, button, [role='button']")
    ).find(function (element) {
      const text = normalizeText(element.textContent || element.getAttribute("aria-label"));

      return text.includes("resend") || text.includes("send another");
    });
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
      } else {
        verificationInvalidAttempts = 0;
        verificationLockedUntil = 0;
      }
    }

    return verificationMode;
  }

  function getVerificationInputAnchor() {
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
      message.innerHTML =
        'Too many attempts. Try again in <span id="' + VERIFICATION_LOCK_SECONDS_ID + '"></span>s.';
    }

    const errorBlock = getVerificationErrorBlock(errorElement);
    const inputAnchor = getVerificationInputAnchor();

    if (errorBlock && message.previousElementSibling !== errorBlock) {
      errorBlock.insertAdjacentElement("afterend", message);
    } else if (!errorBlock && inputAnchor && !document.documentElement.contains(message)) {
      inputAnchor.insertAdjacentElement("beforebegin", message);
    } else if (!document.documentElement.contains(message)) {
      getVerificationRoot().prepend(message);
    }

    const styleSource = errorElement || errorBlock;
    const computed = styleSource ? getComputedStyle(styleSource) : null;

    message.style.setProperty("position", "static", "important");
    message.style.setProperty("display", "block", "important");
    message.style.setProperty("visibility", "visible", "important");
    message.style.setProperty("opacity", "1", "important");
    message.style.setProperty("width", "100%", "important");
    message.style.setProperty("box-sizing", "border-box", "important");
    message.style.setProperty("margin", "4px 0 14px 0", "important");
    message.style.setProperty("padding", "0", "important");
    message.style.setProperty("font-size", computed ? computed.fontSize : "14px", "important");
    message.style.setProperty("font-family", computed ? computed.fontFamily : "inherit", "important");
    message.style.setProperty("font-weight", "700", "important");
    message.style.setProperty("line-height", computed ? computed.lineHeight : "18px", "important");
    message.style.setProperty("color", computed ? computed.color : "#d93025", "important");
    message.style.setProperty("text-align", "center", "important");
    message.style.setProperty("background", "transparent", "important");
    message.style.setProperty("pointer-events", "none", "important");

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
    const remainingSeconds = Math.max(0, Math.ceil((verificationLockedUntil - Date.now()) / 1000));
    const continueButton = findVerificationContinueButton();
    const resendAction = findVerificationResendAction();
    const errorElement = findVerificationInvalidError();

    setVerificationControlDisabled(continueButton, isLocked);
    setVerificationControlDisabled(resendAction, isLocked);

    if (isLocked) {
      updateVerificationLockMessage(remainingSeconds, errorElement);
    }
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

    if (!isLocked && expired && resendAction && resendAction.contains(event.target)) {
      resetVerificationLockState(true);
      return;
    }

    if (!isLocked && resendAction && resendAction.contains(event.target)) {
      resetVerificationLockState(true);
      return;
    }

    if (isLocked && resendAction && resendAction.contains(event.target)) {
      event.preventDefault();
      event.stopPropagation();
      updateVerificationLockUi();
      return;
    }

    if (!continueButton || !continueButton.contains(event.target)) return;

    if (isLocked) {
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

    window.__merlinVerificationLockStop = function () {
      document.removeEventListener("click", handleVerificationClick, true);
      verificationClickHandlerInstalled = false;

      if (verificationLockTimer) {
        clearInterval(verificationLockTimer);
        verificationLockTimer = null;
      }

      resetVerificationLockState(false);
      removeLegacyVerificationLockMessages();

      console.log("[Merlin Asset Brand] Verification lock stopped");
    };

    updateVerificationLockUi();
  }

  function installRegistrationCreamGuard() {
    if (window.__merlinRegistrationCreamGuardInstalled) return;

    window.__merlinRegistrationCreamGuardInstalled = true;

    const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
    const darkValues = ["rgb(23, 17, 31)", "rgb(24, 20, 35)", "#17111f", "#181423"];

    function isRegistrationBackgroundTarget(style) {
      return [
        document.documentElement,
        document.body,
        document.querySelector(".reactSingularKey_CC_main_generic"),
        document.querySelector(".merlin-register"),
        document.querySelector(".mr-shell"),
        document.querySelector(".mr-body"),
        document.querySelector(".mr-body-inner")
      ].filter(Boolean).some(function (element) {
        return element.style === style;
      });
    }

    CSSStyleDeclaration.prototype.setProperty = function (name, value, priority) {
      const property = String(name || "").toLowerCase();
      const nextValue = String(value || "").toLowerCase();

      if (
        document.querySelector(".merlin-register .mr-body") &&
        isRegistrationBackgroundTarget(this) &&
        (property === "background" || property === "background-color") &&
        darkValues.some(function (darkValue) {
          return nextValue.includes(darkValue);
        })
      ) {
        return originalSetProperty.call(this, name, PAGE_BACKGROUND, "important");
      }

      return originalSetProperty.call(this, name, value, priority);
    };
  }

  function injectBaseStyle() {
    let style = document.getElementById(STYLE_ID);

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = `
      html,
      body,
      .merlin-register,
      .merlin-register .mr-shell,
      .merlin-register .mr-body,
      .merlin-register .mr-body-inner {
        color-scheme: light !important;
      }

      html,
      body,
      .merlin-register,
      .merlin-register .mr-shell,
      .merlin-register .mr-body,
      .merlin-register .mr-body-inner {
        --mr-cream-soft: ${PAGE_BACKGROUND} !important;
        --mr-cream: ${PAGE_BACKGROUND} !important;
        --mr-ink: ${BASE_TEXT} !important;
      }

      .merlin-register,
      .merlin-register .mr-shell,
      .merlin-register .mr-shell > .mr-body,
      main.merlin-register .mr-body,
      section.mr-body,
      .merlin-register .mr-body-inner {
        background: ${PAGE_BACKGROUND} !important;
        background-color: ${PAGE_BACKGROUND} !important;
        color: ${BASE_TEXT} !important;
      }

      .merlin-register .mr-body h1,
      .merlin-register .mr-body h2,
      .merlin-register .mr-body h3,
      .merlin-register .mr-body h4,
      .merlin-register .mr-body h5,
      .merlin-register .mr-body h6,
      .merlin-register .mr-body p,
      .merlin-register .mr-body label,
      .merlin-register .mr-body span,
      .merlin-register .mr-body small,
      .merlin-register .mr-body strong,
      .merlin-register .mr-body em,
      .merlin-register .mr-body li,
      .merlin-register .mr-body legend,
      .merlin-register .mr-body div {
        color: ${BASE_TEXT} !important;
      }

      .merlin-register .mr-body input,
      .merlin-register .mr-body textarea,
      .merlin-register .mr-body select {
        background: ${INPUT_BACKGROUND} !important;
        background-color: ${INPUT_BACKGROUND} !important;
        color: ${BASE_TEXT} !important;
        border-color: ${INPUT_BORDER} !important;
      }

      @media (prefers-color-scheme: dark) {
        html,
        body,
        .merlin-register,
        .merlin-register .mr-shell,
        .merlin-register .mr-body,
        .merlin-register .mr-body-inner {
          color-scheme: light !important;
          --mr-cream-soft: ${PAGE_BACKGROUND} !important;
          --mr-cream: ${PAGE_BACKGROUND} !important;
          --mr-ink: ${BASE_TEXT} !important;
        }

        .merlin-register,
        .merlin-register .mr-shell,
        .merlin-register .mr-shell > .mr-body,
        main.merlin-register .mr-body,
        section.mr-body,
        .merlin-register .mr-body-inner {
          background: ${PAGE_BACKGROUND} !important;
          background-color: ${PAGE_BACKGROUND} !important;
          color: ${BASE_TEXT} !important;
        }
      }

      html[data-theme]:not([data-theme="000"]) .mv-hero,
      html[data-theme]:not([data-theme="000"]) .mr-hero {
        position: relative !important;
        overflow: hidden !important;
        padding: 0 !important;
      }

      html[data-theme]:not([data-theme="000"]) .mv-hero-bg,
      html[data-theme]:not([data-theme="000"]) .mv-hero-logo,
      html[data-theme]:not([data-theme="000"]) .mr-hero svg {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }

      html[data-theme]:not([data-theme="000"]) .mv-hero-brand-wrapper {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        pointer-events: none !important;
        z-index: 999 !important;
      }

      html[data-theme]:not([data-theme="000"]) .mv-hero-brand-stage,
      html[data-theme]:not([data-theme="000"]) .mv-hero-brand-layer {
        box-sizing: border-box !important;
      }

      html[data-theme]:not([data-theme="000"]) .mv-hero-brand-img {
        display: block !important;
        object-fit: contain !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        transform-origin: center center !important;
      }
    `;
  }

  function removeInjectedStyle() {
    const style = document.getElementById(STYLE_ID);

    if (style) {
      style.remove();
    }
  }

  function clearRegistrationDesktopScrollState() {
    [
      document.documentElement,
      document.body,
      document.querySelector(".merlin-register"),
      document.querySelector(".mr-shell"),
      document.querySelector(".mr-hero"),
      document.querySelector(".mr-body"),
      document.querySelector(".mr-hero .mv-hero-brand-wrapper"),
      document.querySelector(".mr-hero .mv-hero-brand-layer")
    ].forEach(function (element) {
      if (!element) return;

      [
        "height",
        "min-height",
        "max-height",
        "overflow",
        "overflow-y",
        "overflow-x",
        "align-items"
      ].forEach(function (property) {
        removeInlineProperty(element, property);
      });
    });
  }

  function applyRegistrationDesktopScrollState() {
    if (!document.querySelector(".mr-body")) return;

    if (!isDesktopLayout()) {
      clearRegistrationDesktopScrollState();
      return;
    }

    const register = document.querySelector(".merlin-register");
    const shell = document.querySelector(".mr-shell");
    const hero = document.querySelector(".mr-hero");
    const body = document.querySelector(".mr-body");
    const wrapper = document.querySelector(".mr-hero .mv-hero-brand-wrapper");
    const layer = document.querySelector(".mr-hero .mv-hero-brand-layer");

    [document.documentElement, document.body].forEach(function (element) {
      setImportant(element, "height", "100%");
      setImportant(element, "overflow", "hidden");
    });

    [register, shell, hero].forEach(function (element) {
      if (!element) return;

      setImportant(element, "height", "100vh");
      setImportant(element, "min-height", "100vh");
      setImportant(element, "max-height", "100vh");
      setImportant(element, "overflow", "hidden");
    });

    setImportant(shell, "align-items", "stretch");

    if (body) {
      setImportant(body, "height", "100vh");
      setImportant(body, "min-height", "0");
      setImportant(body, "max-height", "100vh");
      setImportant(body, "overflow-y", "auto");
      setImportant(body, "overflow-x", "hidden");
      setImportant(body, "background", PAGE_BACKGROUND);
      setImportant(body, "background-color", PAGE_BACKGROUND);
      setImportant(body, "color", BASE_TEXT);
    }

    [wrapper, layer].forEach(function (element) {
      if (!element) return;

      setImportant(element, "height", "100%");
      setImportant(element, "min-height", "100%");
      setImportant(element, "max-height", "none");
    });
  }

  function applyPageBackgrounds() {
    clearRegistrationDesktopScrollState();

    [
      document.documentElement,
      document.body,
      document.querySelector(".merlin-verify"),
      document.querySelector(".mv-shell"),
      document.querySelector(".mv-body")
    ].forEach(function (element) {
      setImportant(element, "background", PAGE_BACKGROUND);
      setImportant(element, "background-color", PAGE_BACKGROUND);
    });
  }

  function applyRegistrationBackgrounds() {
    installRegistrationCreamGuard();

    [
      document.documentElement,
      document.body,
      document.querySelector(".reactSingularKey_CC_main_generic"),
      document.querySelector(".merlin-register"),
      document.querySelector(".mr-shell"),
      document.querySelector(".mr-body"),
      document.querySelector(".mr-body-inner")
    ].forEach(function (element) {
      if (!element) return;

      setImportant(element, "background", PAGE_BACKGROUND);
      setImportant(element, "background-color", PAGE_BACKGROUND);
      setImportant(element, "color", BASE_TEXT);
      setImportant(element, "color-scheme", "light");
      setImportant(element, "--mr-cream-soft", PAGE_BACKGROUND);
      setImportant(element, "--mr-cream", PAGE_BACKGROUND);
      setImportant(element, "--mr-ink", BASE_TEXT);
    });

    document.querySelectorAll(".mr-body, .mr-body *, .mr-body-inner, .mr-body-inner *").forEach(function (element) {
      if (element.matches("button, [role='button']") || element.closest("button, [role='button']")) {
        return;
      }

      setImportant(element, "color", BASE_TEXT);
      setImportant(element, "--mr-ink", BASE_TEXT);
    });

    document.querySelectorAll(".mr-body input, .mr-body textarea, .mr-body select").forEach(function (element) {
      setImportant(element, "background", INPUT_BACKGROUND);
      setImportant(element, "background-color", INPUT_BACKGROUND);
      setImportant(element, "color", BASE_TEXT);
      setImportant(element, "border-color", INPUT_BORDER);
    });

    const hero = document.querySelector(".mr-hero");
    const layer = document.querySelector(".mr-hero .mv-hero-brand-layer");
    const themeCode = resolveThemeCode();
    const theme = THEMES[themeCode];

    if (hero) {
      setImportant(hero, "background", "transparent");
      setImportant(hero, "background-color", "transparent");
    }

    if (layer && theme) {
      setImportant(layer, "background", theme.background);
      setImportant(layer, "background-color", theme.background);
    }

    applyRegistrationDesktopScrollState();
  }

  function applyBaseBackgroundsForCurrentLayout() {
    if (document.querySelector(".mr-body")) {
      applyRegistrationBackgrounds();
      return;
    }

    applyPageBackgrounds();
  }

  function hideNativeHeroAssets(hero) {
    document.querySelectorAll(".mv-hero-bg, .mv-hero-logo").forEach(function (element) {
      setImportant(element, "display", "none");
      setImportant(element, "visibility", "hidden");
      setImportant(element, "opacity", "0");
    });

    if (hero && hero.matches(".mr-hero")) {
      hero.querySelectorAll("svg").forEach(function (element) {
        if (element.closest(".mv-hero-brand-wrapper")) return;

        setImportant(element, "display", "none");
        setImportant(element, "visibility", "hidden");
        setImportant(element, "opacity", "0");
      });

      setImportant(hero, "background-image", "none");
    }
  }

  function ensureBrandDom(hero) {
    let wrapper = hero.querySelector(".mv-hero-brand-wrapper");

    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.className = "mv-hero-brand-wrapper";
      hero.appendChild(wrapper);
    }

    let layer = wrapper.querySelector(".mv-hero-brand-layer");

    if (!layer) {
      layer = document.createElement("div");
      layer.className = "mv-hero-brand-layer";
      wrapper.appendChild(layer);
    }

    let stage = layer.querySelector(".mv-hero-brand-stage");

    if (!stage) {
      stage = document.createElement("div");
      stage.className = "mv-hero-brand-stage";
      layer.appendChild(stage);
    }

    let image = stage.querySelector(".mv-hero-brand-img");

    if (!image) {
      image = document.createElement("img");
      image.className = "mv-hero-brand-img";
      image.setAttribute("role", "img");
      stage.appendChild(image);
    }

    return {
      wrapper: wrapper,
      layer: layer,
      stage: stage,
      image: image
    };
  }

  function configureLayout(hero, theme) {
    const shell = document.querySelector(".mv-shell");
    const isRegistrationHero = hero.matches(".mr-hero");
    const brandDom = ensureBrandDom(hero);
    const desktopMode = isDesktopLayout();
    const logoUrl = getLogoUrl(theme);

    const stageWidth = getResponsiveValue(theme, "stageWidth", "mobileStageWidth", "240px");
    const stageHeight = getResponsiveValue(theme, "stageHeight", "mobileStageHeight", "240px");
    const logoWidth = getResponsiveValue(theme, "logoWidth", "mobileLogoWidth", "auto");
    const logoHeight = getResponsiveValue(theme, "logoHeight", "mobileLogoHeight", "auto");
    const logoMaxWidth = getResponsiveValue(theme, "logoMaxWidth", "mobileLogoMaxWidth", "80%");
    const logoMaxHeight = getResponsiveValue(theme, "logoMaxHeight", "mobileLogoMaxHeight", "150px");
    const logoOffsetY = getResponsiveValue(theme, "logoOffsetY", "mobileLogoOffsetY", "0px");
    const logoScale = getResponsiveValue(theme, "logoScale", "mobileLogoScale", "1");

    if (isRegistrationHero) {
      applyRegistrationBackgrounds();
    } else {
      applyPageBackgrounds();
    }

    setImportant(hero, "position", "relative");
    setImportant(hero, "overflow", "hidden");
    setImportant(hero, "padding", "0");
    setImportant(hero, "background", "transparent");
    setImportant(hero, "background-color", "transparent");

    setImportant(brandDom.wrapper, "position", "absolute");
    setImportant(brandDom.wrapper, "inset", "0");
    setImportant(brandDom.wrapper, "width", "100%");
    setImportant(brandDom.wrapper, "height", "100%");
    setImportant(brandDom.wrapper, "pointer-events", "none");
    setImportant(brandDom.wrapper, "z-index", "999");

    setImportant(brandDom.layer, "position", "absolute");
    setImportant(brandDom.layer, "top", "0");
    setImportant(brandDom.layer, "left", "0");
    setImportant(brandDom.layer, "right", "0");
    setImportant(brandDom.layer, "display", "flex");
    setImportant(brandDom.layer, "align-items", "center");
    setImportant(brandDom.layer, "justify-content", "center");
    setImportant(brandDom.layer, "overflow", "hidden");
    setImportant(brandDom.layer, "background", theme.background);
    setImportant(brandDom.layer, "background-color", theme.background);

    setImportant(brandDom.stage, "display", "flex");
    setImportant(brandDom.stage, "align-items", "center");
    setImportant(brandDom.stage, "justify-content", "center");
    setImportant(brandDom.stage, "position", "relative");
    setImportant(brandDom.stage, "overflow", "visible");
    setImportant(brandDom.stage, "margin", "0 auto");
    setImportant(brandDom.stage, "width", stageWidth);
    setImportant(brandDom.stage, "height", stageHeight);
    setImportant(brandDom.stage, "max-width", "100%");
    setImportant(brandDom.stage, "max-height", "100%");

    if (brandDom.image.src !== logoUrl) {
      brandDom.image.src = logoUrl;
    }

    brandDom.image.alt = theme.name;
    brandDom.image.setAttribute("aria-label", theme.name);
    brandDom.image.setAttribute("data-asset-brand-code", theme.code);

    setImportant(brandDom.image, "display", "block");
    setImportant(brandDom.image, "width", logoWidth);
    setImportant(brandDom.image, "height", logoHeight);
    setImportant(brandDom.image, "max-width", logoMaxWidth);
    setImportant(brandDom.image, "max-height", logoMaxHeight);
    setImportant(brandDom.image, "object-fit", "contain");
    setImportant(brandDom.image, "position", "static");
    setImportant(brandDom.image, "margin", "0");
    setImportant(brandDom.image, "padding", "0");
    setImportant(brandDom.image, "border", "0");
    setImportant(brandDom.image, "transform", "translateY(" + logoOffsetY + ") scale(" + logoScale + ")");
    setImportant(brandDom.image, "transform-origin", "center center");

    if (isRegistrationHero) {
      setImportant(brandDom.layer, "bottom", "0");
      setImportant(brandDom.layer, "height", "100%");
      setImportant(brandDom.layer, "max-height", "none");

      applyRegistrationDesktopScrollState();

      return {
        mode: desktopMode ? "registration-desktop" : "registration-mobile",
        logoUrl: logoUrl
      };
    }

    if (desktopMode) {
      removeInlineProperty(shell, "display");
      removeInlineProperty(shell, "grid-template-rows");
      removeInlineProperty(shell, "grid-template-columns");
      removeInlineProperty(shell, "row-gap");
      removeInlineProperty(shell, "gap");
      removeInlineProperty(shell, "align-content");
      removeInlineProperty(shell, "justify-content");

      removeInlineProperty(hero, "height");
      removeInlineProperty(hero, "min-height");
      removeInlineProperty(hero, "max-height");

      setImportant(brandDom.layer, "bottom", "0");
      setImportant(brandDom.layer, "height", "100%");
      setImportant(brandDom.layer, "max-height", "none");
    } else {
      setImportant(shell, "display", "grid");
      setImportant(shell, "grid-template-rows", MOBILE_HEADER_HEIGHT + " auto");
      setImportant(shell, "grid-template-columns", "1fr");
      setImportant(shell, "row-gap", "0px");
      setImportant(shell, "gap", "0px");
      setImportant(shell, "align-content", "start");
      setImportant(shell, "justify-content", "start");

      setImportant(hero, "height", MOBILE_HEADER_HEIGHT);
      setImportant(hero, "min-height", MOBILE_HEADER_HEIGHT);
      setImportant(hero, "max-height", MOBILE_HEADER_HEIGHT);

      removeInlineProperty(brandDom.layer, "bottom");
      setImportant(brandDom.layer, "height", MOBILE_HEADER_HEIGHT);
      setImportant(brandDom.layer, "max-height", MOBILE_HEADER_HEIGHT);
    }

    return {
      mode: desktopMode ? "desktop" : "mobile",
      logoUrl: logoUrl
    };
  }

  function applyRegistrationHeroFallback(theme) {
    const hero = document.querySelector(".mr-hero");

    if (!hero || !theme) return;

    const logoUrl = getLogoUrl(theme);
    const brandDom = ensureBrandDom(hero);

    hideNativeHeroAssets(hero);

    if (brandDom.image.src !== logoUrl) {
      brandDom.image.src = logoUrl;
    }

    brandDom.image.alt = theme.name;
    brandDom.image.setAttribute("aria-label", theme.name);
    brandDom.image.setAttribute("data-asset-brand-code", theme.code);

    setImportant(hero, "position", "relative");
    setImportant(hero, "overflow", "hidden");
    setImportant(hero, "background", "transparent");
    setImportant(hero, "background-color", "transparent");

    setImportant(brandDom.wrapper, "position", "absolute");
    setImportant(brandDom.wrapper, "inset", "0");
    setImportant(brandDom.wrapper, "width", "100%");
    setImportant(brandDom.wrapper, "height", "100%");
    setImportant(brandDom.wrapper, "pointer-events", "none");
    setImportant(brandDom.wrapper, "z-index", "999");

    setImportant(brandDom.layer, "position", "absolute");
    setImportant(brandDom.layer, "inset", "0");
    setImportant(brandDom.layer, "display", "flex");
    setImportant(brandDom.layer, "align-items", "center");
    setImportant(brandDom.layer, "justify-content", "center");
    setImportant(brandDom.layer, "overflow", "hidden");
    setImportant(brandDom.layer, "background", theme.background);
    setImportant(brandDom.layer, "background-color", theme.background);

    setImportant(brandDom.stage, "width", getResponsiveValue(theme, "stageWidth", "mobileStageWidth", "240px"));
    setImportant(brandDom.stage, "height", getResponsiveValue(theme, "stageHeight", "mobileStageHeight", "240px"));
    setImportant(brandDom.stage, "display", "flex");
    setImportant(brandDom.stage, "align-items", "center");
    setImportant(brandDom.stage, "justify-content", "center");
    setImportant(brandDom.stage, "position", "relative");
    setImportant(brandDom.stage, "overflow", "visible");

    setImportant(brandDom.image, "display", "block");
    setImportant(brandDom.image, "width", getResponsiveValue(theme, "logoWidth", "mobileLogoWidth", "auto"));
    setImportant(brandDom.image, "height", getResponsiveValue(theme, "logoHeight", "mobileLogoHeight", "auto"));
    setImportant(brandDom.image, "max-width", getResponsiveValue(theme, "logoMaxWidth", "mobileLogoMaxWidth", "80%"));
    setImportant(brandDom.image, "max-height", getResponsiveValue(theme, "logoMaxHeight", "mobileLogoMaxHeight", "150px"));
    setImportant(brandDom.image, "object-fit", "contain");
    setImportant(
      brandDom.image,
      "transform",
      "translateY(" +
        getResponsiveValue(theme, "logoOffsetY", "mobileLogoOffsetY", "0px") +
        ") scale(" +
        getResponsiveValue(theme, "logoScale", "mobileLogoScale", "1") +
        ")"
    );
    setImportant(brandDom.image, "transform-origin", "center center");

    applyRegistrationBackgrounds();
  }

  function removeBrandDom() {
    document.querySelectorAll(".mv-hero-brand-wrapper").forEach(function (element) {
      element.remove();
    });
  }

  function resetToMerlinDefault() {
    document.documentElement.setAttribute("data-theme", DEFAULT_THEME_CODE);

    removeInjectedStyle();
    removeBrandDom();
    restoreTrackedStyles();
    injectBaseStyle();
    applyBaseBackgroundsForCurrentLayout();

    if (lastAppliedThemeCode !== DEFAULT_THEME_CODE) {
      console.log("[Merlin Asset Brand] Reset to Merlin default");
    }

    lastAppliedThemeCode = DEFAULT_THEME_CODE;
    lastAppliedMode = null;
  }

  function applyAssetTheme(theme) {
    const hero = getHeroElement();

    if (!hero) return;

    document.documentElement.setAttribute("data-theme", theme.code);

    injectBaseStyle();
    hideNativeHeroAssets(hero);

    const result = configureLayout(hero, theme);

    applyRegistrationHeroFallback(theme);

    if (lastAppliedThemeCode !== theme.code || lastAppliedMode !== result.mode) {
      console.log("[Merlin Asset Brand] Theme applied", {
        code: theme.code,
        name: theme.name,
        mode: result.mode,
        background: theme.background,
        logoUrl: result.logoUrl,
        from: getFromParam(),
        viewportWidth: window.innerWidth,
        heroHeight: Math.round(hero.getBoundingClientRect().height)
      });
    }

    lastAppliedThemeCode = theme.code;
    lastAppliedMode = result.mode;
  }

  function applyTheme() {
    if (isApplyingTheme) return;

    isApplyingTheme = true;

    try {
      const themeCode = resolveThemeCode();

      if (themeCode === DEFAULT_THEME_CODE || !THEMES[themeCode]) {
        resetToMerlinDefault();
        return;
      }

      applyAssetTheme(THEMES[themeCode]);
    } finally {
      isApplyingTheme = false;
    }
  }

  function scheduleApplyTheme() {
    if (isApplyScheduled) return;

    isApplyScheduled = true;

    window.requestAnimationFrame(function () {
      isApplyScheduled = false;
      applyTheme();
    });
  }

  function observeDavinciDomChanges() {
    const observer = new MutationObserver(function () {
      scheduleApplyTheme();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"]
    });
  }

  function init() {
    console.log("[Merlin Asset Brand] loaded");
    console.log("[Merlin Asset Brand] URL from:", getFromParam());

    installRegistrationCreamGuard();
    installVerificationRetryLock();
    injectBaseStyle();
    applyTheme();
    observeDavinciDomChanges();

    window.addEventListener("resize", scheduleApplyTheme);

    setTimeout(applyTheme, 100);
    setTimeout(applyTheme, 300);
    setTimeout(applyTheme, 800);
    setTimeout(applyTheme, 1500);
    setTimeout(applyTheme, 3000);

    const interval = setInterval(applyTheme, 500);

    setTimeout(function () {
      clearInterval(interval);
    }, 15000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();