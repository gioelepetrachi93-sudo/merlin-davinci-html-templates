(function () {
  "use strict";

  if (window.__merlinContactStop) {
    try {
      window.__merlinContactStop();
    } catch (error) {}
  }

  const STYLE_ID = "merlin-contact-style";
  const OVERLAY_ID = "merlinContactOverlay";
  const MODAL_ID = "merlinContactModal";
  const CLOSE_ID = "merlinContactClose";

  const CONTACT_SELECTORS = [
    "[data-merlin-contact]",
    "#btnContactUs",
    ".ml-contact-link",
    ".mv-contact-link",
    ".mr-contact-link"
  ];

  function removeExistingContactUi() {
    const oldOverlay = document.getElementById(OVERLAY_ID);
    const oldStyle = document.getElementById(STYLE_ID);

    if (oldOverlay) oldOverlay.remove();
    if (oldStyle) oldStyle.remove();
  }

  function injectStyles() {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .merlin-contact-overlay {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 2147483000;
        align-items: center;
        justify-content: center;
        padding: 24px;
        background: rgba(23, 15, 48, 0.58);
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
      }

      .merlin-contact-overlay.is-open {
        display: flex;
      }

      .merlin-contact-modal {
        position: relative;
        width: min(524px, calc(100vw - 48px));
        max-height: calc(100vh - 48px);
        overflow-y: auto;
        padding: 20px;
        border-radius: 18px;
        background: #FFFFFF;
        color: #091464;
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        box-shadow: 0 20px 60px rgba(23, 15, 48, 0.22);
      }

      .merlin-contact-close {
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
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 18px;
        font-weight: 400;
        line-height: 1;
        cursor: pointer;
      }

      .merlin-contact-icon {
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

      .merlin-contact-icon svg {
        width: 14px;
        height: 12px;
        display: block;
      }

      .merlin-contact-title,
      .merlin-contact-section-title {
        margin: 0 0 8px;
        color: #091464 !important;
        font-size: 16px !important;
        font-weight: 700 !important;
        line-height: 24px !important;
      }

      .merlin-contact-intro,
      .merlin-contact-label,
      .merlin-contact-hours {
        margin: 0;
        color: #091464;
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
      }

      .merlin-contact-divider {
        height: 1px;
        margin: 12px 0 14px;
        border: 0;
        border-top: 1px dashed #CDCDCE;
      }

      .merlin-contact-phone,
      .merlin-contact-email {
        display: inline-block;
        margin: 8px 0;
        color: #091464;
        text-decoration: none;
      }

      .merlin-contact-phone {
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
      }

      .merlin-contact-email {
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
      }

      @media (max-width: 767px) {
        .merlin-contact-modal {
          width: min(228px, calc(100vw - 48px));
          padding: 20px 18px;
          border-radius: 16px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function buildOverlay() {
    const overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    overlay.className = "merlin-contact-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "merlinContactTitle");

    overlay.innerHTML = `
      <div class="merlin-contact-modal" id="${MODAL_ID}" role="document">
        <button class="merlin-contact-close" id="${CLOSE_ID}" type="button" aria-label="Close">×</button>

        <div class="merlin-contact-icon" aria-hidden="true">
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.75 6.75H10.75C10.4848 6.75 10.2304 6.85536 10.0429 7.0429C9.85536 7.23043 9.75 7.48479 9.75 7.75V10.25C9.75 10.5152 9.85536 10.7696 10.0429 10.9571C10.2304 11.1446 10.4848 11.25 10.75 11.25H11.75C12.0152 11.25 12.2696 11.1446 12.4571 10.9571C12.6446 10.7696 12.75 10.5152 12.75 10.25V6.75ZM12.75 6.75C12.75 5.96207 12.5948 5.18185 12.2933 4.4539C11.9918 3.72595 11.5498 3.06451 10.9926 2.50736C10.4355 1.95021 9.77406 1.50825 9.0461 1.20672C8.31815 0.905195 7.53793 0.75 6.75 0.75C5.96207 0.75 5.18185 0.905195 4.4539 1.20672C3.72595 1.50825 3.06451 1.95021 2.50736 2.50736C1.95021 3.06451 1.50825 3.72595 1.20672 4.4539C0.905195 5.18185 0.75 5.96207 0.75 6.75M0.75 6.75V10.25C0.75 10.5152 0.855357 10.7696 1.04289 10.9571C1.23043 11.1446 1.48478 11.25 1.75 11.25H2.75C3.01522 11.25 3.26957 11.1446 3.45711 10.9571C3.64464 10.7696 3.75 10.5152 3.75 10.25V7.75C3.75 7.48479 3.64464 7.23043 3.45711 7.0429C3.26957 6.85536 3.01522 6.75 2.75 6.75H0.75Z" stroke="#091464" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <h2 class="merlin-contact-title" id="merlinContactTitle">Contact us</h2>
        <p class="merlin-contact-intro">If you need help with your account or your tickets/Annual Pass, please get in touch.</p>

        <hr class="merlin-contact-divider">

        <h3 class="merlin-contact-section-title">Telephone</h3>
        <p class="merlin-contact-label">Call us on:</p>
        <a class="merlin-contact-phone" href="tel:+443333212001">(+44) 333 321 2001</a>
        <p class="merlin-contact-hours">Our team are available from 09.00 - 17.00, Monday to Friday</p>

        <hr class="merlin-contact-divider">

        <h3 class="merlin-contact-section-title">Email</h3>
        <p class="merlin-contact-label">Email at:</p>
        <a class="merlin-contact-email" href="mailto:support@mymerlinplay.com">support@mymerlinplay.com</a>
      </div>
    `;

    document.body.appendChild(overlay);
    return overlay;
  }

  function openContact(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return;

    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
  }

  function closeContact() {
    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return;

    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
  }

  function onDocumentClick(event) {
    const trigger = event.target && event.target.closest(CONTACT_SELECTORS.join(","));

    if (trigger) {
      openContact(event);
      return;
    }

    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay || !overlay.classList.contains("is-open")) return;

    if (event.target === overlay || event.target.closest("#" + CLOSE_ID)) {
      event.preventDefault();
      closeContact();
    }
  }

  function onKeydown(event) {
    if (event.key === "Escape") {
      closeContact();
    }
  }

  function start() {
    removeExistingContactUi();
    injectStyles();
    buildOverlay();

    document.addEventListener("click", onDocumentClick, true);
    document.addEventListener("keydown", onKeydown, true);

    console.log("[Merlin Contact] loaded");
  }

  window.__merlinContactStop = function () {
    document.removeEventListener("click", onDocumentClick, true);
    document.removeEventListener("keydown", onKeydown, true);
    removeExistingContactUi();
    delete window.__merlinContactStop;
    console.log("[Merlin Contact] stopped");
  };

  start();
})();