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

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

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

      .merlin-contact-close:hover {
        color: #091464;
        background: #E9EBF5;
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
        width: 16px;
        height: 16px;
        display: block;
      }

      .merlin-contact-title {
        margin: 0 0 8px;
        color: #091464;
        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
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

      .merlin-contact-section-title {
        margin: 0 0 8px;
        color: #091464;
        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
      }

      .merlin-contact-phone,
      .merlin-contact-email {
        display: inline-block;
        margin: 8px 0;
        color: #091464;
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        text-decoration: none;
      }

      .merlin-contact-email {
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
      }

      .merlin-contact-phone:hover,
      .merlin-contact-email:hover {
        color: #571CFF;
        text-decoration: underline;
        text-decoration-thickness: 1px;
        text-decoration-color: #CDCDCE;
        text-underline-offset: 3px;
      }

      @media (max-width: 767px) {
        .merlin-contact-overlay {
          align-items: center;
          padding: 24px;
        }

        .merlin-contact-modal {
          width: min(228px, calc(100vw - 48px));
          max-height: calc(100vh - 48px);
          padding: 20px 18px;
          border-radius: 16px;
        }

        .merlin-contact-close {
          top: 12px;
          right: 12px;
        }

        .merlin-contact-icon {
          width: 40px;
          height: 40px;
          margin: 0 0 16px;
        }

        .merlin-contact-intro,
        .merlin-contact-label,
        .merlin-contact-hours {
          font-size: 11px;
          line-height: 16px;
        }

        .merlin-contact-phone {
          font-size: 14px;
          line-height: 20px;
        }

        .merlin-contact-email {
          font-size: 12px;
          line-height: 18px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function buildOverlay() {
    let overlay = document.getElementById(OVERLAY_ID);

    if (overlay) return overlay;

    overlay = document.createElement("div");
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
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#merlinContactHeadphonesClip)">
              <path d="M14 8H12C11.7348 8 11.4804 8.10536 11.2929 8.2929C11.1054 8.48043 11 8.73479 11 9V11.5C11 11.7652 11.1054 12.0196 11.2929 12.2071C11.4804 12.3946 11.7348 12.5 12 12.5H13C13.2652 12.5 13.5196 12.3946 13.7071 12.2071C13.8946 12.0196 14 11.7652 14 11.5V8ZM14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2418 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8M2 8V11.5C2 11.7652 2.10536 12.0196 2.29289 12.2071C2.48043 12.3946 2.73478 12.5 3 12.5H4C4.26522 12.5 4.51957 12.3946 4.70711 12.2071C4.89464 12.0196 5 11.7652 5 11.5V9C5 8.73479 4.89464 8.48043 4.70711 8.2929C4.51957 8.10536 4.26522 8 4 8H2Z" stroke="#091464" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
              <clipPath id="merlinContactHeadphonesClip">
                <rect width="16" height="16" fill="white"/>
              </clipPath>
            </defs>
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

  function getOverlay() {
    return document.getElementById(OVERLAY_ID) || buildOverlay();
  }

  function openContact(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const overlay = getOverlay();

    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");

    const close = document.getElementById(CLOSE_ID);
    if (close) close.focus({ preventScroll: true });
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
    injectStyles();
    buildOverlay();

    document.addEventListener("click", onDocumentClick, true);
    document.addEventListener("keydown", onKeydown, true);

    console.log("[Merlin Contact] loaded");
  }

  window.__merlinContactStop = function () {
    document.removeEventListener("click", onDocumentClick, true);
    document.removeEventListener("keydown", onKeydown, true);

    const overlay = document.getElementById(OVERLAY_ID);
    if (overlay) overlay.remove();

    const style = document.getElementById(STYLE_ID);
    if (style) style.remove();

    delete window.__merlinContactStop;

    console.log("[Merlin Contact] stopped");
  };

  start();
})();