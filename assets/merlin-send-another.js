(function () {
  "use strict";

  if (window.__merlinOtpWaitStop) {
    try {
      window.__merlinOtpWaitStop();
    } catch (error) {}
  }

  const STYLE_ID = "merlin-otp-wait-style";
  const OVERLAY_ID = "merlinOtpWaitOverlay";
  const MODAL_ID = "merlinOtpWaitModal";
  const CLOSE_ID = "merlinOtpWaitClose";
  const OK_ID = "merlinOtpWaitOk";
  const TIMER_ID = "merlinOtpWaitTimer";

  const STORAGE_KEY = "merlin_otp_wait_until";
  const CLICK_KEY = "merlin_otp_resend_click_count";

  const MAX_ALLOWED_CLICKS = 5;
  const COOLDOWN_MS = 2 * 60 * 1000;

  const RESEND_SELECTORS = [
    "[data-merlin-resend]",
    "#btnSendAnother",
    "#btnResend",
    "[data-id='btnSendAnother']",
    "[data-id='btnResend']",
    "[data-skbuttonvalue='sendAnother']",
    "[data-skbuttonvalue='resend']",
    ".mv-resend-link",
    ".mv-send-another",
    ".mv-send-another-link"
  ];

  let cooldownInterval = null;
  let cooldownContainer = null;
  let cooldownOriginalHtml = null;

  function getStoredUntil() {
    const value = Number(sessionStorage.getItem(STORAGE_KEY) || 0);
    return Number.isFinite(value) ? value : 0;
  }

  function setStoredUntil(value) {
    sessionStorage.setItem(STORAGE_KEY, String(value));
  }

  function clearStoredUntil() {
    sessionStorage.removeItem(STORAGE_KEY);
  }

  function getClickCount() {
    const value = Number(sessionStorage.getItem(CLICK_KEY) || 0);
    return Number.isFinite(value) ? value : 0;
  }

  function setClickCount(value) {
    sessionStorage.setItem(CLICK_KEY, String(value));
  }

  function resetClickCount() {
    sessionStorage.removeItem(CLICK_KEY);
  }

  function isCooldownActive() {
    return getStoredUntil() > Date.now();
  }

  function getRemainingMs() {
    return Math.max(0, getStoredUntil() - Date.now());
  }

  function formatRemaining(ms) {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return minutes + ":" + seconds;
  }

  function normalizeText(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function isResendText(element) {
    const text = normalizeText(
      element.textContent ||
        element.value ||
        element.getAttribute("aria-label") ||
        element.getAttribute("title")
    );

    return (
      text.includes("send another") ||
      text.includes("send a new code") ||
      text.includes("resend") ||
      text.includes("new code")
    );
  }

  function findResendTrigger(target) {
    if (!target || !target.closest) return null;

    const selectorMatch = target.closest(RESEND_SELECTORS.join(","));

    if (selectorMatch) return selectorMatch;

    const clickable = target.closest("a, button, [role='button'], input[type='submit']");

    if (clickable && isResendText(clickable)) {
      return clickable;
    }

    return null;
  }

  function getCooldownContainer(trigger) {
    if (!trigger) return null;

    return (
      trigger.closest(".mv-resend-row") ||
      trigger.closest(".mv-send-another-row") ||
      trigger.closest(".mv-resend") ||
      trigger.closest(".mv-send-another") ||
      trigger.closest("p") ||
      trigger.parentElement
    );
  }

  function removeExistingOtpWaitUi() {
    const overlay = document.getElementById(OVERLAY_ID);
    const style = document.getElementById(STYLE_ID);

    if (overlay) overlay.remove();
    if (style) style.remove();
  }

  function injectStyles() {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .merlin-otp-wait-overlay {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 2147483001;
        align-items: center;
        justify-content: center;
        padding: 24px;
        background: rgba(23, 15, 48, 0.58);
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
      }

      .merlin-otp-wait-overlay.is-open {
        display: flex;
      }

      .merlin-otp-wait-modal {
        position: relative;
        width: min(636px, calc(100vw - 32px));
        max-height: calc(100vh - 48px);
        overflow-y: auto;
        overflow-x: hidden;
        box-sizing: border-box;
        padding: 24px 32px 28px;
        border-radius: 18px;
        background: #FFFFFF;
        color: #091464;
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        box-shadow: 0 20px 60px rgba(23, 15, 48, 0.22);
      }

      .merlin-otp-wait-close {
        position: absolute;
        top: 14px;
        right: 14px;
        width: 24px;
        height: 24px;
        border: 0;
        border-radius: 999px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #F1F2F8;
        color: #667085;
        cursor: pointer;
      }

      .merlin-otp-wait-close svg {
        display: block;
        width: 10px;
        height: 10px;
      }

      .merlin-otp-wait-close:hover {
        color: #091464;
        background: #E9EBF5;
      }

      .merlin-otp-wait-icon {
        width: 40px;
        height: 40px;
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 0 16px;
        background: #EDEEF8;
        color: #091464;
      }

      .merlin-otp-wait-icon svg {
        display: block;
        width: 14px;
        height: 14px;
      }

      .merlin-otp-wait-title {
        margin: 0 0 8px;
        color: #091464 !important;
        font-size: 16px !important;
        font-weight: 700 !important;
        line-height: 24px !important;
      }

      .merlin-otp-wait-copy {
        margin: 0;
        max-width: 420px;
        color: #091464;
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
      }

      .merlin-otp-wait-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 22px;
      }

      .merlin-otp-wait-ok {
        min-width: 80px;
        min-height: 40px;
        border: 0;
        border-radius: 999px;
        padding: 8px 18px;
        background: #571CFF;
        color: #FFFFFF;
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
        cursor: pointer;
      }

      .merlin-otp-wait-ok:hover {
        background: #4815E0;
      }

      .merlin-otp-cooldown-message {
        display: block;
        width: 100%;
        margin: 0;
        color: #091464;
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        text-align: center;
      }

      .merlin-otp-cooldown-message strong {
        font-weight: 500;
      }

      @media (max-width: 767px) {
        .merlin-otp-wait-overlay {
          padding: 0 16px !important;
        }

        .merlin-otp-wait-modal {
          width: calc(100vw - 32px) !important;
          max-width: 360px !important;
          min-width: 0 !important;
          box-sizing: border-box !important;
          max-height: calc(100vh - 48px);
          overflow-x: hidden !important;
          padding: 20px 18px !important;
          border-radius: 16px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function buildOverlay() {
    const overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    overlay.className = "merlin-otp-wait-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "merlinOtpWaitTitle");

    overlay.innerHTML = `
      <div class="merlin-otp-wait-modal" id="${MODAL_ID}" role="document">
        <button class="merlin-otp-wait-close" id="${CLOSE_ID}" type="button" aria-label="Close">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.21967 0.21967C0.512563 -0.0732233 0.987437 -0.0732233 1.28033 0.21967L4.75 3.68934L8.21967 0.21967C8.51256 -0.0732233 8.98744 -0.0732233 9.28033 0.21967C9.57322 0.512563 9.57322 0.987437 9.28033 1.28033L5.81066 4.75L9.28033 8.21967C9.57322 8.51256 9.57322 8.98744 9.28033 9.28033C8.98744 9.57322 8.51256 9.57322 8.21967 9.28033L4.75 5.81066L1.28033 9.28033C0.987437 9.57322 0.512563 9.57322 0.21967 9.28033C-0.0732233 8.98744 -0.0732233 8.51256 0.21967 8.21967L3.68934 4.75L0.21967 1.28033C-0.0732233 0.987437 -0.0732233 0.512563 0.21967 0.21967Z" fill="#475569"/>
          </svg>
        </button>

        <div class="merlin-otp-wait-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7 12.5C10.0376 12.5 12.5 10.0376 12.5 7C12.5 3.96243 10.0376 1.5 7 1.5C3.96243 1.5 1.5 3.96243 1.5 7C1.5 10.0376 3.96243 12.5 7 12.5ZM7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM8 9.5C8 10.0523 7.55228 10.5 7 10.5C6.44772 10.5 6 10.0523 6 9.5C6 8.94771 6.44772 8.5 7 8.5C7.55228 8.5 8 8.94771 8 9.5ZM7.75 4C7.75 3.58579 7.41421 3.25 7 3.25C6.58579 3.25 6.25 3.58579 6.25 4V6.5C6.25 6.91421 6.58579 7.25 7 7.25C7.41421 7.25 7.75 6.91421 7.75 6.5V4Z" fill="#091464"/>
          </svg>
        </div>

        <h2 class="merlin-otp-wait-title" id="merlinOtpWaitTitle">Please wait a few minutes</h2>
        <p class="merlin-otp-wait-copy">
          Before requesting a new code, please wait 15 minutes. If you're having trouble finding your code, check your Spam folder.
        </p>

        <div class="merlin-otp-wait-actions">
          <button class="merlin-otp-wait-ok" id="${OK_ID}" type="button">Got it!</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    return overlay;
  }

  function applyResponsiveOtpWaitLayout() {
    const overlay = document.getElementById(OVERLAY_ID);
    const modal = document.getElementById(MODAL_ID);

    if (!overlay || !modal) return;

    if (window.matchMedia("(max-width: 767px)").matches) {
      overlay.style.setProperty("padding", "0 16px", "important");

      modal.style.setProperty("width", "calc(100vw - 32px)", "important");
      modal.style.setProperty("max-width", "360px", "important");
      modal.style.setProperty("min-width", "0", "important");
      modal.style.setProperty("box-sizing", "border-box", "important");
      modal.style.setProperty("padding", "20px 18px", "important");
      modal.style.setProperty("border-radius", "16px", "important");
    } else {
      overlay.style.removeProperty("padding");

      modal.style.removeProperty("width");
      modal.style.removeProperty("max-width");
      modal.style.removeProperty("min-width");
      modal.style.removeProperty("box-sizing");
      modal.style.removeProperty("padding");
      modal.style.removeProperty("border-radius");
    }
  }

  function openWaitModal() {
    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return;

    applyResponsiveOtpWaitLayout();

    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
  }

  function closeWaitModal() {
    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return;

    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");

    if (isCooldownActive()) {
      renderCooldownMessage();
    }
  }

  function renderCooldownMessage() {
    if (!cooldownContainer) return;

    if (cooldownOriginalHtml === null) {
      cooldownOriginalHtml = cooldownContainer.innerHTML;
    }

    cooldownContainer.innerHTML = `
      <span class="merlin-otp-cooldown-message">
        You can ask for a new code in <strong id="${TIMER_ID}">${formatRemaining(getRemainingMs())}</strong>
      </span>
    `;

    updateCooldownTimer();
  }

  function restoreCooldownMessage() {
    if (cooldownContainer && cooldownOriginalHtml !== null) {
      cooldownContainer.innerHTML = cooldownOriginalHtml;
    }

    cooldownContainer = null;
    cooldownOriginalHtml = null;
  }

  function updateCooldownTimer() {
    const timer = document.getElementById(TIMER_ID);

    if (timer) {
      timer.textContent = formatRemaining(getRemainingMs());
    }
  }

  function startCooldown(container) {
    const until = Date.now() + COOLDOWN_MS;

    cooldownContainer = container || cooldownContainer;
    setStoredUntil(until);

    if (cooldownInterval) {
      clearInterval(cooldownInterval);
    }

    cooldownInterval = setInterval(function () {
      if (!isCooldownActive()) {
        clearInterval(cooldownInterval);
        cooldownInterval = null;
        clearStoredUntil();
        resetClickCount();
        restoreCooldownMessage();
        return;
      }

      updateCooldownTimer();
    }, 250);
  }

  function onDocumentClick(event) {
    const overlay = document.getElementById(OVERLAY_ID);

    if (overlay && overlay.classList.contains("is-open")) {
      if (
        event.target === overlay ||
        event.target.closest("#" + CLOSE_ID) ||
        event.target.closest("#" + OK_ID)
      ) {
        event.preventDefault();
        closeWaitModal();
        return;
      }
    }

    const trigger = findResendTrigger(event.target);

    if (!trigger) return;

    if (isCooldownActive()) {
      event.preventDefault();
      event.stopPropagation();
      if (event.stopImmediatePropagation) event.stopImmediatePropagation();
      renderCooldownMessage();
      return;
    }

    const nextCount = getClickCount() + 1;
    setClickCount(nextCount);

    if (nextCount <= MAX_ALLOWED_CLICKS) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();

    cooldownContainer = getCooldownContainer(trigger);
    cooldownOriginalHtml = cooldownContainer ? cooldownContainer.innerHTML : null;

    startCooldown(cooldownContainer);
    openWaitModal();
  }

  function onKeydown(event) {
    if (event.key === "Escape") {
      closeWaitModal();
    }
  }

  function start() {
    removeExistingOtpWaitUi();
    injectStyles();
    buildOverlay();
    applyResponsiveOtpWaitLayout();

    if (isCooldownActive()) {
      startCooldown(null);
    } else {
      clearStoredUntil();
      resetClickCount();
    }

    document.addEventListener("click", onDocumentClick, true);
    document.addEventListener("keydown", onKeydown, true);
    window.addEventListener("resize", applyResponsiveOtpWaitLayout);

    console.log("[Merlin OTP Wait] loaded");
  }

  window.__merlinOtpWaitStop = function () {
    document.removeEventListener("click", onDocumentClick, true);
    document.removeEventListener("keydown", onKeydown, true);
    window.removeEventListener("resize", applyResponsiveOtpWaitLayout);

    if (cooldownInterval) {
      clearInterval(cooldownInterval);
      cooldownInterval = null;
    }

    removeExistingOtpWaitUi();

    delete window.__merlinOtpWaitStop;

    console.log("[Merlin OTP Wait] stopped");
  };

  start();
})();