(function () {
  const LEGOLAND_CODE = "001";
  const LEGOLAND_BG = "#FFCF00";
  const STYLE_ID = "merlin-legoland-bg-v5";

  function getFromParam() {
    return new URLSearchParams(window.location.search).get("from");
  }

  function shouldApply() {
    const from = getFromParam();

    if (from === LEGOLAND_CODE) {
      sessionStorage.setItem("merlin_theme_code", LEGOLAND_CODE);
      return true;
    }

    return sessionStorage.getItem("merlin_theme_code") === LEGOLAND_CODE;
  }

  function injectStyle() {
    let style = document.getElementById(STYLE_ID);

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = `
      html[data-theme="001"],
      html[data-theme="001"] body,
      html[data-theme="001"] .merlin-verify,
      html[data-theme="001"] .mv-hero {
        background: ${LEGOLAND_BG} !important;
        background-color: ${LEGOLAND_BG} !important;
      }

      html[data-theme="001"] .mv-hero::before,
      html[data-theme="001"] .mv-hero::after {
        background: ${LEGOLAND_BG} !important;
        background-color: ${LEGOLAND_BG} !important;
      }
    `;
  }

  function forceElement(el) {
    if (!el || !el.style) return;

    el.style.setProperty("background", LEGOLAND_BG, "important");
    el.style.setProperty("background-color", LEGOLAND_BG, "important");
  }

  function applyTheme() {
    if (!shouldApply()) return;

    document.documentElement.setAttribute("data-theme", LEGOLAND_CODE);

    injectStyle();

    forceElement(document.documentElement);
    forceElement(document.body);

    document.querySelectorAll(".merlin-verify, .mv-hero").forEach(forceElement);

    console.log("[Merlin Theme V5] LEGOLAND applied", {
      from: getFromParam(),
      hero: getComputedStyle(document.querySelector(".mv-hero")).backgroundColor
    });
  }

  function init() {
    console.log("[Merlin Theme V5] loaded");

    applyTheme();

    const observer = new MutationObserver(function () {
      requestAnimationFrame(applyTheme);
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"]
    });

    const interval = setInterval(applyTheme, 250);

    setTimeout(function () {
      clearInterval(interval);
    }, 20000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();