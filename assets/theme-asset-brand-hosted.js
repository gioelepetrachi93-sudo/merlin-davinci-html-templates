(function () {
  const DEFAULT_THEME_CODE = "000";
  const SESSION_KEY = "merlin_asset_theme_code";
  const STYLE_ID = "merlin-asset-brand-style";

  const CDN_BASE =
    "https://cdn.jsdelivr.net/gh/gioelepetrachi93-sudo/merlin-davinci-html-templates@main/assets/brand-logos/";

  const ASSET_VERSION = "v=1";

  const THEMES = {
    "001": {
      code: "001",
      name: "Alton Towers",
      background: "#283269",
      logoFile: "001-alton-towers.svg",
      logoWidth: "clamp(140px, 22vw, 242px)",
      logoMaxHeight: "170px",
      mobileLogoWidth: "min(70%, 180px)",
      mobileLogoMaxHeight: "130px",
      logoOffsetY: "22px",
      mobileLogoOffsetY: "24px"
    },

    "002": {
      code: "002",
      name: "LEGOLAND",
      background: "#FFCF00",
      logoFile: "002-legoland.svg",
      logoWidth: "clamp(105px, 16vw, 210px)",
      logoMaxHeight: "120px",
      mobileLogoWidth: "min(70%, 160px)",
      mobileLogoMaxHeight: "110px",
      logoOffsetY: "0px",
      mobileLogoOffsetY: "0px"
    },

    "003": {
      code: "003",
      name: "Warwick Castle",
      background: "#00415F",
      logoFile: "003-warwick-castle.svg",
      logoWidth: "clamp(140px, 22vw, 242px)",
      logoMaxHeight: "170px",
      mobileLogoWidth: "min(70%, 180px)",
      mobileLogoMaxHeight: "130px",
      logoOffsetY: "0px",
      mobileLogoOffsetY: "0px"
    },

    "004": {
      code: "004",
      name: "Gruffalo Blackpool",
      background: "#4A82BC",
      logoFile: "004-gruffalo-blackpool.svg",
      logoWidth: "clamp(140px, 22vw, 242px)",
      logoMaxHeight: "180px",
      mobileLogoWidth: "min(70%, 180px)",
      mobileLogoMaxHeight: "140px",
      logoOffsetY: "0px",
      mobileLogoOffsetY: "0px"
    },

    "005": {
      code: "005",
      name: "Cadbury World",
      background: "#462F92",
      logoFile: "005-cadbury-world.svg",
      logoWidth: "clamp(140px, 22vw, 242px)",
      logoMaxHeight: "180px",
      mobileLogoWidth: "min(70%, 180px)",
      mobileLogoMaxHeight: "140px",
      logoOffsetY: "0px",
      mobileLogoOffsetY: "0px"
    },

    "006": {
      code: "006",
      name: "Sea Life",
      background: "#282B91",
      logoFile: "006-sea-life.svg",
      logoWidth: "clamp(140px, 22vw, 242px)",
      logoMaxHeight: "140px",
      mobileLogoWidth: "min(70%, 180px)",
      mobileLogoMaxHeight: "120px",
      logoOffsetY: "0px",
      mobileLogoOffsetY: "0px"
    },

    "007": {
      code: "007",
      name: "The Dungeons",
      background: "#000000",
      logoFile: "007-the-dungeons.svg",
      logoWidth: "clamp(140px, 22vw, 242px)",
      logoMaxHeight: "170px",
      mobileLogoWidth: "min(70%, 180px)",
      mobileLogoMaxHeight: "130px",
      logoOffsetY: "0px",
      mobileLogoOffsetY: "0px"
    },

    "008": {
      code: "008",
      name: "Chessington",
      background: "#00A13A",
      logoFile: "008-chessington.svg",
      logoWidth: "clamp(150px, 22vw, 242px)",
      logoMaxHeight: "190px",
      mobileLogoWidth: "min(70%, 180px)",
      mobileLogoMaxHeight: "150px",
      logoOffsetY: "0px",
      mobileLogoOffsetY: "0px"
    },

    "009": {
      code: "009",
      name: "Thorpe Park",
      background: "#FFFFFF",
      logoFile: "009-thorpe-park.svg",
      logoWidth: "clamp(180px, 24vw, 247px)",
      logoMaxHeight: "120px",
      mobileLogoWidth: "min(75%, 200px)",
      mobileLogoMaxHeight: "100px",
      logoOffsetY: "0px",
      mobileLogoOffsetY: "0px"
    }
  };

  const VALID_THEME_CODES = [DEFAULT_THEME_CODE].concat(Object.keys(THEMES));

  let isApplyingTheme = false;
  let lastAppliedThemeCode = null;

  const ORIGINALS = {
    logoHtml: null,
    heroBgDisplay: null,
    heroBgVisibility: null,
    heroBgOpacity: null
  };

  function getLogoUrl(theme) {
    return CDN_BASE + theme.logoFile + "?" + ASSET_VERSION;
  }

  function getFromParam() {
    return new URLSearchParams(window.location.search).get("from");
  }

  function getLogoOffsetY(theme) {
    return theme.logoOffsetY || "0px";
  }

  function getMobileLogoOffsetY(theme) {
    return theme.mobileLogoOffsetY || theme.logoOffsetY || "0px";
  }

  function resolveThemeCode() {
    const from = getFromParam();

    if (VALID_THEME_CODES.includes(from)) {
      sessionStorage.setItem(SESSION_KEY, from);
      return from;
    }

    return sessionStorage.getItem(SESSION_KEY) || DEFAULT_THEME_CODE;
  }

  function captureOriginalMerlinDom() {
    const currentLogo = document.querySelector(".mv-hero-logo");
    const heroBg = document.querySelector(".mv-hero-bg");

    if (
      currentLogo &&
      !currentLogo.classList.contains("mv-hero-logo-asset-brand") &&
      !ORIGINALS.logoHtml
    ) {
      ORIGINALS.logoHtml = currentLogo.outerHTML;
    }

    if (heroBg && ORIGINALS.heroBgDisplay === null) {
      ORIGINALS.heroBgDisplay = heroBg.style.display || "";
      ORIGINALS.heroBgVisibility = heroBg.style.visibility || "";
      ORIGINALS.heroBgOpacity = heroBg.style.opacity || "";
    }
  }

  function injectStyle(theme) {
    let style = document.getElementById(STYLE_ID);

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = `
      html[data-theme="${theme.code}"],
      html[data-theme="${theme.code}"] body {
        background: ${theme.background} !important;
        background-color: ${theme.background} !important;
      }

      html[data-theme="${theme.code}"] .merlin-verify,
      html[data-theme="${theme.code}"] .mv-hero {
        background: ${theme.background} !important;
        background-color: ${theme.background} !important;
      }

      html[data-theme="${theme.code}"] .mv-hero {
        position: relative !important;
        overflow: hidden !important;
        padding: 0 !important;
      }

      html[data-theme="${theme.code}"] .mv-hero-bg {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }

      html[data-theme="${theme.code}"] .mv-hero-logo-asset-brand {
        display: block !important;
        width: ${theme.logoWidth || "clamp(120px, 18vw, 242px)"} !important;
        height: auto !important;
        max-width: 75% !important;
        max-height: ${theme.logoMaxHeight || "170px"} !important;
        object-fit: contain !important;

        position: absolute !important;
        left: 50% !important;
        top: 50% !important;
        right: auto !important;
        bottom: auto !important;
        transform: translate(-50%, calc(-50% + ${getLogoOffsetY(theme)})) !important;

        margin: 0 !important;
        z-index: 10 !important;
      }

      @media (max-width: 900px) {
        html[data-theme="${theme.code}"] .mv-hero {
          position: relative !important;
          overflow: hidden !important;
          padding: 0 !important;
        }

        html[data-theme="${theme.code}"] .mv-hero-logo-asset-brand {
          width: ${theme.mobileLogoWidth || "min(70%, 180px)"} !important;
          max-height: ${theme.mobileLogoMaxHeight || "130px"} !important;

          position: absolute !important;
          left: 50% !important;
          top: 50% !important;
          right: auto !important;
          bottom: auto !important;
          transform: translate(-50%, calc(-50% + ${getMobileLogoOffsetY(theme)})) !important;

          margin: 0 !important;
        }
      }
    `;
  }

  function removeInjectedStyle() {
    const style = document.getElementById(STYLE_ID);

    if (style) {
      style.remove();
    }
  }

  function forceBackground(element, color) {
    if (!element || !element.style) return;

    element.style.setProperty("background", color, "important");
    element.style.setProperty("background-color", color, "important");
  }

  function clearForcedBackground(element) {
    if (!element || !element.style) return;

    element.style.removeProperty("background");
    element.style.removeProperty("background-color");
  }

  function hideMerlinBackgroundSvg() {
    document.querySelectorAll(".mv-hero-bg").forEach(function (element) {
      element.style.setProperty("display", "none", "important");
      element.style.setProperty("visibility", "hidden", "important");
      element.style.setProperty("opacity", "0", "important");
    });
  }

  function restoreMerlinBackgroundSvg() {
    document.querySelectorAll(".mv-hero-bg").forEach(function (element) {
      element.style.display = ORIGINALS.heroBgDisplay || "";
      element.style.visibility = ORIGINALS.heroBgVisibility || "";
      element.style.opacity = ORIGINALS.heroBgOpacity || "";
    });
  }

  function replaceMerlinLogo(theme) {
    const currentLogo = document.querySelector(".mv-hero-logo");

    if (!currentLogo) return;

    const currentBrandCode = currentLogo.getAttribute("data-asset-brand-code");

    if (currentBrandCode === theme.code) return;

    const img = document.createElement("img");
    img.src = getLogoUrl(theme);
    img.alt = theme.name;
    img.className = "mv-hero-logo mv-hero-logo-asset-brand";
    img.setAttribute("role", "img");
    img.setAttribute("aria-label", theme.name);
    img.setAttribute("data-asset-brand-code", theme.code);

    currentLogo.replaceWith(img);
  }

  function restoreMerlinLogo() {
    const currentLogo = document.querySelector(".mv-hero-logo");

    if (!currentLogo) return;

    if (
      currentLogo.classList.contains("mv-hero-logo-asset-brand") &&
      ORIGINALS.logoHtml
    ) {
      currentLogo.outerHTML = ORIGINALS.logoHtml;
    }
  }

  function resetToMerlinDefault() {
    document.documentElement.setAttribute("data-theme", DEFAULT_THEME_CODE);

    removeInjectedStyle();

    clearForcedBackground(document.documentElement);
    clearForcedBackground(document.body);
    clearForcedBackground(document.querySelector(".merlin-verify"));
    clearForcedBackground(document.querySelector(".mv-hero"));

    restoreMerlinBackgroundSvg();
    restoreMerlinLogo();

    if (lastAppliedThemeCode !== DEFAULT_THEME_CODE) {
      console.log("[Merlin Asset Brand] Reset to Merlin default");
    }

    lastAppliedThemeCode = DEFAULT_THEME_CODE;
  }

  function applyAssetTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme.code);

    injectStyle(theme);

    forceBackground(document.documentElement, theme.background);
    forceBackground(document.body, theme.background);
    forceBackground(document.querySelector(".merlin-verify"), theme.background);
    forceBackground(document.querySelector(".mv-hero"), theme.background);

    hideMerlinBackgroundSvg();
    replaceMerlinLogo(theme);

    if (lastAppliedThemeCode !== theme.code) {
      console.log("[Merlin Asset Brand] Theme applied", {
        code: theme.code,
        name: theme.name,
        background: theme.background,
        logoUrl: getLogoUrl(theme),
        logoOffsetY: getLogoOffsetY(theme),
        mobileLogoOffsetY: getMobileLogoOffsetY(theme),
        from: getFromParam()
      });
    }

    lastAppliedThemeCode = theme.code;
  }

  function applyTheme() {
    if (isApplyingTheme) return;

    isApplyingTheme = true;

    try {
      captureOriginalMerlinDom();

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

  function observeDavinciDomChanges() {
    const observer = new MutationObserver(function () {
      window.requestAnimationFrame(applyTheme);
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

    applyTheme();
    observeDavinciDomChanges();

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