(function () {
  const DEFAULT_THEME_CODE = "000";
  const SESSION_KEY = "merlin_asset_theme_code";
  const STYLE_ID = "merlin-asset-brand-style";

  const CDN_BASE =
    "https://cdn.jsdelivr.net/gh/gioelepetrachi93-sudo/merlin-davinci-html-templates@main/assets/brand-logos/";

  const ASSET_VERSION = "v=1";
  const PAGE_BACKGROUND = "#FFF8E2";
  const DESKTOP_SIDE_PANEL_MIN_HEIGHT = 260;

  const THEMES = {
    "001": {
      code: "001",
      name: "Alton Towers",
      background: "#283269",
      logoFile: "001-alton-towers.svg",
      logoSizingMode: "height",
      logoWidth: "auto",
      logoHeight: "145px",
      logoMaxWidth: "210px",
      logoMaxHeight: "160px",
      mobileLogoWidth: "auto",
      mobileLogoHeight: "115px",
      mobileLogoMaxWidth: "150px",
      mobileLogoMaxHeight: "125px",
      logoOffsetY: "0px",
      mobileLogoOffsetY: "0px",
      stageWidth: "240px",
      stageHeight: "240px",
      mobileStageWidth: "180px",
      mobileStageHeight: "180px"
    },

    "002": {
      code: "002",
      name: "LEGOLAND",
      background: "#FFCF00",
      logoFile: "002-legoland.svg",
      logoSizingMode: "width",
      logoWidth: "230px",
      logoHeight: "auto",
      logoMaxWidth: "78%",
      logoMaxHeight: "130px",
      mobileLogoWidth: "170px",
      mobileLogoHeight: "auto",
      mobileLogoMaxWidth: "76%",
      mobileLogoMaxHeight: "110px",
      logoOffsetY: "0px",
      mobileLogoOffsetY: "0px"
    },

    "003": {
      code: "003",
      name: "Warwick Castle",
      background: "#00415F",
      logoFile: "003-warwick-castle.svg",
      logoSizingMode: "width",
      logoWidth: "230px",
      logoHeight: "auto",
      logoMaxWidth: "80%",
      logoMaxHeight: "145px",
      mobileLogoWidth: "180px",
      mobileLogoHeight: "auto",
      mobileLogoMaxWidth: "78%",
      mobileLogoMaxHeight: "125px",
      logoOffsetY: "0px",
      mobileLogoOffsetY: "0px"
    },

    "004": {
      code: "004",
      name: "Gruffalo Blackpool",
      background: "#4A82BC",
      logoFile: "004-gruffalo-blackpool.svg",
      logoSizingMode: "width",
      logoWidth: "230px",
      logoHeight: "auto",
      logoMaxWidth: "80%",
      logoMaxHeight: "150px",
      mobileLogoWidth: "180px",
      mobileLogoHeight: "auto",
      mobileLogoMaxWidth: "78%",
      mobileLogoMaxHeight: "130px",
      logoOffsetY: "0px",
      mobileLogoOffsetY: "0px"
    },

    "005": {
      code: "005",
      name: "Cadbury World",
      background: "#462F92",
      logoFile: "005-cadbury-world.svg",
      logoSizingMode: "width",
      logoWidth: "230px",
      logoHeight: "auto",
      logoMaxWidth: "80%",
      logoMaxHeight: "150px",
      mobileLogoWidth: "180px",
      mobileLogoHeight: "auto",
      mobileLogoMaxWidth: "78%",
      mobileLogoMaxHeight: "130px",
      logoOffsetY: "0px",
      mobileLogoOffsetY: "0px"
    },

    "006": {
      code: "006",
      name: "Sea Life",
      background: "#282B91",
      logoFile: "006-sea-life.svg",
      logoSizingMode: "width",
      logoWidth: "230px",
      logoHeight: "auto",
      logoMaxWidth: "80%",
      logoMaxHeight: "130px",
      mobileLogoWidth: "180px",
      mobileLogoHeight: "auto",
      mobileLogoMaxWidth: "78%",
      mobileLogoMaxHeight: "110px",
      logoOffsetY: "0px",
      mobileLogoOffsetY: "0px"
    },

    "007": {
      code: "007",
      name: "The Dungeons",
      background: "#000000",
      logoFile: "007-the-dungeons.svg",
      logoSizingMode: "width",
      logoWidth: "230px",
      logoHeight: "auto",
      logoMaxWidth: "80%",
      logoMaxHeight: "145px",
      mobileLogoWidth: "180px",
      mobileLogoHeight: "auto",
      mobileLogoMaxWidth: "78%",
      mobileLogoMaxHeight: "125px",
      logoOffsetY: "0px",
      mobileLogoOffsetY: "0px"
    },

    "008": {
      code: "008",
      name: "Chessington",
      background: "#00A13A",
      logoFile: "008-chessington.svg",
      logoSizingMode: "width",
      logoWidth: "240px",
      logoHeight: "auto",
      logoMaxWidth: "80%",
      logoMaxHeight: "155px",
      mobileLogoWidth: "185px",
      mobileLogoHeight: "auto",
      mobileLogoMaxWidth: "78%",
      mobileLogoMaxHeight: "135px",
      logoOffsetY: "0px",
      mobileLogoOffsetY: "0px"
    },

    "009": {
      code: "009",
      name: "Thorpe Park",
      background: "#FFFFFF",
      logoFile: "009-thorpe-park.svg",
      logoSizingMode: "width",
      logoWidth: "250px",
      logoHeight: "auto",
      logoMaxWidth: "84%",
      logoMaxHeight: "120px",
      mobileLogoWidth: "200px",
      mobileLogoHeight: "auto",
      mobileLogoMaxWidth: "80%",
      mobileLogoMaxHeight: "100px",
      logoOffsetY: "0px",
      mobileLogoOffsetY: "0px"
    }
  };

  const VALID_THEME_CODES = [DEFAULT_THEME_CODE].concat(Object.keys(THEMES));

  let isApplyingTheme = false;
  let isApplyScheduled = false;
  let lastAppliedThemeCode = null;
  let lastAppliedMode = null;

  const ORIGINAL_STYLES = new WeakMap();
  const TRACKED_ELEMENTS = new Set();

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
    } catch (error) {
      // sessionStorage can be unavailable in some embedded contexts.
    }
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

  function getPageBackground() {
    const body = document.querySelector(".mv-body");
    const bodyBackground = body ? getComputedStyle(body).backgroundColor : "";

    if (
      bodyBackground &&
      bodyBackground !== "rgba(0, 0, 0, 0)" &&
      bodyBackground !== "transparent"
    ) {
      return bodyBackground;
    }

    return PAGE_BACKGROUND;
  }

  function isDesktopSidePanel(hero) {
    if (!hero) return false;

    const rect = hero.getBoundingClientRect();
    return rect.height > DESKTOP_SIDE_PANEL_MIN_HEIGHT;
  }

  function getResponsiveValue(theme, desktopKey, mobileKey, fallback) {
    return theme[mobileKey] || theme[desktopKey] || fallback;
  }

  function injectBaseStyle() {
    let style = document.getElementById(STYLE_ID);

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = `
      html[data-theme]:not([data-theme="000"]) .mv-hero {
        position: relative !important;
        overflow: hidden !important;
        padding: 0 !important;
      }

      html[data-theme]:not([data-theme="000"]) .mv-hero-bg,
      html[data-theme]:not([data-theme="000"]) .mv-hero-logo {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }

      html[data-theme]:not([data-theme="000"]) .mv-hero-brand-wrapper {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        display: block !important;
        pointer-events: none !important;
        z-index: 20 !important;
      }

      html[data-theme]:not([data-theme="000"]) .mv-hero-brand-layer,
      html[data-theme]:not([data-theme="000"]) .mv-hero-brand-stage {
        box-sizing: border-box !important;
      }

      html[data-theme]:not([data-theme="000"]) .mv-hero-brand-img {
        display: block !important;
        object-fit: contain !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
      }
    `;
  }

  function removeInjectedStyle() {
    const style = document.getElementById(STYLE_ID);

    if (style) {
      style.remove();
    }
  }

  function applyPageBackgrounds(pageBackground) {
    setImportant(document.documentElement, "background-color", pageBackground);
    setImportant(document.body, "background-color", pageBackground);

    setImportant(document.querySelector(".merlin-verify"), "background-color", pageBackground);
    setImportant(document.querySelector(".mv-shell"), "background-color", pageBackground);
    setImportant(document.querySelector(".mv-body"), "background-color", pageBackground);
  }

  function hideNativeHeroAssets() {
    document.querySelectorAll(".mv-hero-bg, .mv-hero-logo").forEach(function (element) {
      setImportant(element, "display", "none");
      setImportant(element, "visibility", "hidden");
      setImportant(element, "opacity", "0");
    });
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

  function configureBrandDom(hero, theme) {
    const brandDom = ensureBrandDom(hero);
    const desktopMode = isDesktopSidePanel(hero);
    const logoUrl = getLogoUrl(theme);

    const logoWidth = desktopMode
      ? theme.logoWidth || "auto"
      : getResponsiveValue(theme, "logoWidth", "mobileLogoWidth", "auto");

    const logoHeight = desktopMode
      ? theme.logoHeight || "auto"
      : getResponsiveValue(theme, "logoHeight", "mobileLogoHeight", "auto");

    const logoMaxWidth = desktopMode
      ? theme.logoMaxWidth || "80%"
      : getResponsiveValue(theme, "logoMaxWidth", "mobileLogoMaxWidth", "80%");

    const logoMaxHeight = desktopMode
      ? theme.logoMaxHeight || "150px"
      : getResponsiveValue(theme, "logoMaxHeight", "mobileLogoMaxHeight", "125px");

    const logoOffsetY = desktopMode
      ? theme.logoOffsetY || "0px"
      : getResponsiveValue(theme, "logoOffsetY", "mobileLogoOffsetY", "0px");

    const stageWidth = desktopMode
      ? theme.stageWidth || "240px"
      : theme.mobileStageWidth || "180px";

    const stageHeight = desktopMode
      ? theme.stageHeight || "240px"
      : theme.mobileStageHeight || "180px";

    setImportant(hero, "position", "relative");
    setImportant(hero, "overflow", "hidden");
    setImportant(hero, "padding", "0");
    setImportant(hero, "background-color", "transparent");

    setImportant(brandDom.wrapper, "position", "absolute");
    setImportant(brandDom.wrapper, "inset", "0");
    setImportant(brandDom.wrapper, "width", "100%");
    setImportant(brandDom.wrapper, "height", "100%");
    setImportant(brandDom.wrapper, "display", "block");
    setImportant(brandDom.wrapper, "pointer-events", "none");
    setImportant(brandDom.wrapper, "z-index", "20");

    setImportant(brandDom.layer, "position", "absolute");
    setImportant(brandDom.layer, "top", "0");
    setImportant(brandDom.layer, "left", "0");
    setImportant(brandDom.layer, "right", "0");
    setImportant(brandDom.layer, "background-color", theme.background);
    setImportant(brandDom.layer, "display", "flex");
    setImportant(brandDom.layer, "align-items", "center");
    setImportant(brandDom.layer, "justify-content", "center");
    setImportant(brandDom.layer, "pointer-events", "none");
    setImportant(brandDom.layer, "z-index", "20");
    setImportant(brandDom.layer, "overflow", "hidden");

    if (desktopMode) {
      setImportant(brandDom.layer, "bottom", "0");
      setImportant(brandDom.layer, "height", "100%");
      setImportant(brandDom.layer, "max-height", "none");
    } else {
      removeInlineProperty(brandDom.layer, "bottom");
      setImportant(brandDom.layer, "height", theme.mobileLayerHeight || "180px");
      setImportant(brandDom.layer, "max-height", "100%");
    }

    setImportant(brandDom.stage, "width", stageWidth);
    setImportant(brandDom.stage, "height", stageHeight);
    setImportant(brandDom.stage, "max-width", "100%");
    setImportant(brandDom.stage, "max-height", "100%");
    setImportant(brandDom.stage, "display", "flex");
    setImportant(brandDom.stage, "align-items", "center");
    setImportant(brandDom.stage, "justify-content", "center");
    setImportant(brandDom.stage, "position", "relative");
    setImportant(brandDom.stage, "overflow", "visible");
    setImportant(brandDom.stage, "margin", "0 auto");

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
    setImportant(brandDom.image, "transform", "translateY(" + logoOffsetY + ")");

    return {
      mode: desktopMode ? "desktop-side-panel" : "mobile-header",
      logoUrl: logoUrl
    };
  }

  function applyShellAlignment(hero) {
    const shell = document.querySelector(".mv-shell");

    if (!shell) return;

    if (isDesktopSidePanel(hero)) {
      removeInlineProperty(shell, "row-gap");
      removeInlineProperty(shell, "gap");
      removeInlineProperty(shell, "align-content");
      removeInlineProperty(shell, "justify-content");
      return;
    }

    setImportant(shell, "row-gap", "0px");
    setImportant(shell, "gap", "0px");
    setImportant(shell, "align-content", "start");
    setImportant(shell, "justify-content", "start");
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

    if (lastAppliedThemeCode !== DEFAULT_THEME_CODE) {
      console.log("[Merlin Asset Brand] Reset to Merlin default");
    }

    lastAppliedThemeCode = DEFAULT_THEME_CODE;
    lastAppliedMode = null;
  }

  function applyAssetTheme(theme) {
    const hero = document.querySelector(".mv-hero");

    if (!hero) return;

    const pageBackground = getPageBackground();

    document.documentElement.setAttribute("data-theme", theme.code);

    injectBaseStyle();
    applyPageBackgrounds(pageBackground);
    hideNativeHeroAssets();

    const result = configureBrandDom(hero, theme);
    applyShellAlignment(hero);

    if (lastAppliedThemeCode !== theme.code || lastAppliedMode !== result.mode) {
      console.log("[Merlin Asset Brand] Theme applied", {
        code: theme.code,
        name: theme.name,
        mode: result.mode,
        background: theme.background,
        logoUrl: result.logoUrl,
        from: getFromParam(),
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