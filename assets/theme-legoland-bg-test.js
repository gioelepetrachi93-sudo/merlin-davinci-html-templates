(function () {
  const LEGOLAND_CODE = "001";
  const LEGOLAND_BG = "#FFCF00";
  const STYLE_ID = "merlin-legoland-bg-targeted-style";

  function getFromParam() {
    return new URLSearchParams(window.location.search).get("from");
  }

  function shouldApplyLegolandTheme() {
    const fromUrl = getFromParam();

    if (fromUrl === LEGOLAND_CODE) {
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
      html[data-theme="001"] body {
        background-color: ${LEGOLAND_BG} !important;
      }

      html[data-theme="001"] .merlin-verify {
        background-color: ${LEGOLAND_BG} !important;
      }

      html[data-theme="001"] .mv-hero {
        background: ${LEGOLAND_BG} !important;
        background-color: ${LEGOLAND_BG} !important;
      }

      html[data-theme="001"] .mv-hero * {
        background-color: transparent !important;
      }
    `;
  }

  function forceBackground(element, color) {
    if (!element || !element.style) return;

    element.style.setProperty("background", color, "important");
    element.style.setProperty("background-color", color, "important");
  }

  function applyLegolandBackground() {
    if (!shouldApplyLegolandTheme()) return;

    document.documentElement.setAttribute("data-theme", LEGOLAND_CODE);

    injectStyle();

    const wrapper = document.querySelector(".merlin-verify");
    const hero = document.querySelector(".mv-hero");

    forceBackground(document.documentElement, LEGOLAND_BG);
    forceBackground(document.body, LEGOLAND_BG);
    forceBackground(wrapper, LEGOLAND_BG);
    forceBackground(hero, LEGOLAND_BG);

    console.log("[Merlin Theme] LEGOLAND background applied to .mv-hero");
  }

  function observeDavinciDomChanges() {
    const observer = new MutationObserver(function () {
      window.requestAnimationFrame(applyLegolandBackground);
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"]
    });
  }

  function init() {
    console.log("[Merlin Theme] targeted LEGOLAND script loaded");
    console.log("[Merlin Theme] from:", getFromParam());

    applyLegolandBackground();
    observeDavinciDomChanges();

    setTimeout(applyLegolandBackground, 100);
    setTimeout(applyLegolandBackground, 300);
    setTimeout(applyLegolandBackground, 800);
    setTimeout(applyLegolandBackground, 1500);
    setTimeout(applyLegolandBackground, 3000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();