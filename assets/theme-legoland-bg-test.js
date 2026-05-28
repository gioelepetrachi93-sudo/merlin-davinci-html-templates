(function () {
  const LEGOLAND_CODE = "001";
  const LEGOLAND_BG = "#FFCF00";
  const STYLE_ID = "merlin-legoland-bg-persistent-style";

  let isApplying = false;

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
        background: ${LEGOLAND_BG} !important;
        background-color: ${LEGOLAND_BG} !important;
      }

      html[data-theme="001"] body > div,
      html[data-theme="001"] main,
      html[data-theme="001"] section,
      html[data-theme="001"] [id="root"],
      html[data-theme="001"] [id="app"],
      html[data-theme="001"] [class*="root"],
      html[data-theme="001"] [class*="Root"],
      html[data-theme="001"] [class*="app"],
      html[data-theme="001"] [class*="App"],
      html[data-theme="001"] [class*="page"],
      html[data-theme="001"] [class*="Page"],
      html[data-theme="001"] [class*="screen"],
      html[data-theme="001"] [class*="Screen"],
      html[data-theme="001"] [class*="layout"],
      html[data-theme="001"] [class*="Layout"],
      html[data-theme="001"] [class*="container"],
      html[data-theme="001"] [class*="Container"],
      html[data-theme="001"] [class*="wrapper"],
      html[data-theme="001"] [class*="Wrapper"],
      html[data-theme="001"] [class*="content"],
      html[data-theme="001"] [class*="Content"],
      html[data-theme="001"] .sk-container,
      html[data-theme="001"] .sk-page,
      html[data-theme="001"] .sk-wrapper,
      html[data-theme="001"] .flow-container {
        background: ${LEGOLAND_BG} !important;
        background-color: ${LEGOLAND_BG} !important;
      }
    `;
  }

  function forceBackgroundOnElement(element) {
    if (!element || !element.style) return;

    element.style.setProperty("background", LEGOLAND_BG, "important");
    element.style.setProperty("background-color", LEGOLAND_BG, "important");
  }

  function getLargeVisibleElements() {
    return Array.from(document.querySelectorAll("body, body *")).filter(function (element) {
      const rect = element.getBoundingClientRect();

      return (
        rect.width >= window.innerWidth * 0.7 &&
        rect.height >= window.innerHeight * 0.4
      );
    });
  }

  function applyLegolandBackground() {
    if (!shouldApplyLegolandTheme()) return;
    if (isApplying) return;

    isApplying = true;

    try {
      document.documentElement.setAttribute("data-theme", LEGOLAND_CODE);

      injectStyle();

      forceBackgroundOnElement(document.documentElement);
      forceBackgroundOnElement(document.body);

      const directContainers = [
        ...document.querySelectorAll(
          'body > div, main, section, [id="root"], [id="app"], [class*="root"], [class*="Root"], [class*="page"], [class*="Page"], [class*="screen"], [class*="Screen"], [class*="layout"], [class*="Layout"], [class*="container"], [class*="Container"], [class*="wrapper"], [class*="Wrapper"]'
        )
      ];

      directContainers.forEach(forceBackgroundOnElement);
      getLargeVisibleElements().forEach(forceBackgroundOnElement);
    } finally {
      isApplying = false;
    }
  }

  function observeDavinciDomChanges() {
    const target = document.documentElement;

    const observer = new MutationObserver(function () {
      window.requestAnimationFrame(applyLegolandBackground);
    });

    observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"]
    });
  }

  function init() {
    console.log("[Merlin Theme] persistent LEGOLAND script loaded");
    console.log("[Merlin Theme] from:", getFromParam());

    applyLegolandBackground();
    observeDavinciDomChanges();

    setTimeout(applyLegolandBackground, 100);
    setTimeout(applyLegolandBackground, 300);
    setTimeout(applyLegolandBackground, 800);
    setTimeout(applyLegolandBackground, 1500);
    setTimeout(applyLegolandBackground, 3000);

    // Temporary aggressive re-apply for DaVinci async rendering.
    setInterval(applyLegolandBackground, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();