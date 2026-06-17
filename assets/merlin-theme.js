(function () {
  const DEFAULT_THEME_CODE = "000";
  const SESSION_KEY = "merlin_asset_theme_code";
  const STYLE_ID = "merlin-theme-style";
  const FIXED_LEFT_STYLE_ID = "merlin-fixed-left-scroll-style";

  const CDN_BASE =
    "https://cdn.jsdelivr.net/gh/gioelepetrachi93-sudo/merlin-davinci-html-templates@main/assets/brand-logos/";

  const ASSET_VERSION = "v=1";
  const MOBILE_HEADER_HEIGHT = "140px";
  const DESKTOP_BREAKPOINT = 900;

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

  const FIXED_LEFT_LAYOUTS = [
    { root: ".merlin-login", shell: ".ml-shell", hero: ".ml-hero", body: ".ml-body", inner: ".ml-body-inner" },
    { root: ".merlin-register", shell: ".mr-shell", hero: ".mr-hero", body: ".mr-body", inner: ".mr-body-inner" },
    { root: ".merlin-verify", shell: ".mv-shell", hero: ".mv-hero", body: ".mv-body", inner: ".mv-body-inner" }
  ];

  const DAVINCI_WRAPPERS = [
    "#widgetContainer",
    ".reactSingularKey_bodyContainer",
    ".reactSingularKey_CC_main_generic"
  ];

  const FIXED_LEFT_PROPS_TO_CLEAR = [
    "height",
    "min-height",
    "max-height",
    "overflow",
    "overflow-y",
    "overflow-x",
    "position",
    "top",
    "left",
    "right",
    "bottom",
    "width",
    "margin",
    "margin-left",
    "contain",
    "touch-action",
    "overscroll-behavior",
    "z-index"
  ];

  let isApplyingTheme = false;
  let isApplyScheduled = false;
  let isFixedLeftScheduled = false;
  let lastAppliedThemeCode = null;
  let lastAppliedMode = null;
  let largeDesktopScaleTarget = null;
  let largeDesktopScaleResizeHandler = null;

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

  function isDesktopLayout() {
    return window.innerWidth >= DESKTOP_BREAKPOINT;
  }

  function getResponsiveValue(theme, desktopKey, mobileKey, fallback) {
    return isDesktopLayout()
      ? theme[desktopKey] || fallback
      : theme[mobileKey] || theme[desktopKey] || fallback;
  }

  function getHeroElement() {
    return (
      document.querySelector(".mv-hero") ||
      document.querySelector(".mr-hero") ||
      document.querySelector(".ml-hero")
    );
  }

  function isVerifyHero(hero) {
    return !!hero && hero.matches(".mv-hero");
  }

  function isSplitHero(hero) {
    return !!hero && (hero.matches(".mr-hero") || hero.matches(".ml-hero"));
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

  function injectBaseStyle() {
    let style = document.getElementById(STYLE_ID);

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = `
      html[data-theme]:not([data-theme="000"]) .mv-hero,
      html[data-theme]:not([data-theme="000"]) .mr-hero,
      html[data-theme]:not([data-theme="000"]) .ml-hero {
        position: relative !important;
        overflow: hidden !important;
        padding: 0 !important;
      }

      html[data-theme]:not([data-theme="000"]) .mv-hero-bg,
      html[data-theme]:not([data-theme="000"]) .mv-hero-logo,
      html[data-theme]:not([data-theme="000"]) .mr-hero svg,
      html[data-theme]:not([data-theme="000"]) .ml-hero svg {
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

      html[data-theme]:not([data-theme="000"]) .mv-hero-brand-layer {
        position: absolute !important;
        inset: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
      }

      html[data-theme]:not([data-theme="000"]) .mv-hero-brand-stage {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        position: relative !important;
        overflow: visible !important;
        margin: 0 auto !important;
        max-width: 100% !important;
        max-height: 100% !important;
        box-sizing: border-box !important;
      }

      html[data-theme]:not([data-theme="000"]) .mv-hero-brand-img {
        display: block !important;
        object-fit: contain !important;
        position: static !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        transform-origin: center center !important;
      }

      @media (max-width: ${DESKTOP_BREAKPOINT - 1}px) {
        html[data-theme]:not([data-theme="000"]) .mv-shell {
          display: grid !important;
          grid-template-rows: ${MOBILE_HEADER_HEIGHT} auto !important;
          grid-template-columns: 1fr !important;
          row-gap: 0 !important;
          gap: 0 !important;
          align-content: start !important;
          justify-content: start !important;
        }

        html[data-theme]:not([data-theme="000"]) .mv-hero {
          height: ${MOBILE_HEADER_HEIGHT} !important;
          min-height: ${MOBILE_HEADER_HEIGHT} !important;
          max-height: ${MOBILE_HEADER_HEIGHT} !important;
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

  function hideNativeHeroAssets(hero) {
    document.querySelectorAll(".mv-hero-bg, .mv-hero-logo").forEach(function (element) {
      setImportant(element, "display", "none");
      setImportant(element, "visibility", "hidden");
      setImportant(element, "opacity", "0");
    });

    if (isSplitHero(hero)) {
      hero.querySelectorAll("svg").forEach(function (element) {
        if (element.closest(".mv-hero-brand-wrapper")) return;

        setImportant(element, "display", "none");
        setImportant(element, "visibility", "hidden");
        setImportant(element, "opacity", "0");
      });

      setImportant(hero, "background-image", "none");
    }
  }

  function applyBrandHero(theme, hero) {
    const brandDom = ensureBrandDom(hero);
    const logoUrl = getLogoUrl(theme);

    const stageWidth = getResponsiveValue(theme, "stageWidth", "mobileStageWidth", "240px");
    const stageHeight = getResponsiveValue(theme, "stageHeight", "mobileStageHeight", "240px");
    const logoWidth = getResponsiveValue(theme, "logoWidth", "mobileLogoWidth", "auto");
    const logoHeight = getResponsiveValue(theme, "logoHeight", "mobileLogoHeight", "auto");
    const logoMaxWidth = getResponsiveValue(theme, "logoMaxWidth", "mobileLogoMaxWidth", "80%");
    const logoMaxHeight = getResponsiveValue(theme, "logoMaxHeight", "mobileLogoMaxHeight", "150px");
    const logoOffsetY = getResponsiveValue(theme, "logoOffsetY", "mobileLogoOffsetY", "0px");
    const logoScale = getResponsiveValue(theme, "logoScale", "mobileLogoScale", "1");

    setImportant(hero, "position", "relative");
    setImportant(hero, "overflow", "hidden");
    setImportant(hero, "padding", "0");

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

    return {
      mode: isVerifyHero(hero)
        ? isDesktopLayout() ? "verify-desktop" : "verify-mobile"
        : isDesktopLayout() ? "split-desktop" : "split-mobile",
      logoUrl: logoUrl
    };
  }

  function removeBrandDom() {
    document.querySelectorAll(".mv-hero-brand-wrapper").forEach(function (element) {
      element.remove();
    });
  }

  function findContentScaleElements() {
    const candidates = [
      {
        page: "verify",
        root: document.querySelector(".merlin-verify"),
        inner: document.querySelector(".merlin-verify .mv-body-inner"),
        body: document.querySelector(".merlin-verify .mv-body")
      },
      {
        page: "login",
        root: document.querySelector(".merlin-login"),
        inner: document.querySelector(".merlin-login .ml-body-inner"),
        body: document.querySelector(".merlin-login .ml-body")
      },
      {
        page: "register",
        root: document.querySelector(".merlin-register"),
        inner: document.querySelector(".merlin-register .mr-body-inner"),
        body: document.querySelector(".merlin-register .mr-body")
      }
    ];

    function isVisible(element) {
      if (!element) return false;

      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);

      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0"
      );
    }

    const visibleCandidate = candidates.find(function (candidate) {
      return isVisible(candidate.root) && isVisible(candidate.inner);
    });

    if (visibleCandidate) {
      return {
        inner: visibleCandidate.inner,
        body: visibleCandidate.body
      };
    }

    const fallbackCandidate = candidates.find(function (candidate) {
      return candidate.inner;
    });

    if (fallbackCandidate) {
      return {
        inner: fallbackCandidate.inner,
        body: fallbackCandidate.body
      };
    }

    return {
      inner: null,
      body: null
    };
  }

  function clampNumber(min, value, max) {
    return Math.max(min, Math.min(value, max));
  }

  function applyLargeDesktopContentScale(inner, body) {
    if (!inner) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isRegisterPage = !!inner.closest(".merlin-register");

    if (body && body.style.getPropertyValue("overflow") !== "visible") {
      body.style.setProperty("overflow", "visible", "important");
    }

    if (width < 1500 || width < 768) {
      if (inner.__merlinLargeDesktopScaleState !== "none") {
        inner.style.removeProperty("transform");
        inner.style.removeProperty("transform-origin");
        inner.__merlinLargeDesktopScaleState = "none";
      }

      return;
    }

    let scale = isRegisterPage ? width / 1500 : width / 1850;

    if (!isRegisterPage && height < 850) {
      scale = Math.min(scale, height / 860);
    }

    if (isRegisterPage && height < 760) {
      scale = Math.min(scale, height / 720);
    }

    scale = clampNumber(1, scale, isRegisterPage ? 1.42 : 1.42);

    const nextState = "scale(" + scale.toFixed(4) + ")";

    if (inner.__merlinLargeDesktopScaleState === nextState) {
      return;
    }

    inner.style.setProperty("transform", "scale(" + scale + ")", "important");
    inner.style.setProperty("transform-origin", "center center", "important");
    inner.__merlinLargeDesktopScaleState = nextState;
  }

  function installLargeDesktopContentScale() {
    const elements = findContentScaleElements();
    const inner = elements.inner;
    const body = elements.body;

    if (!inner) return;

    if (largeDesktopScaleTarget !== inner) {
      if (largeDesktopScaleResizeHandler) {
        window.removeEventListener("resize", largeDesktopScaleResizeHandler);
      }

      largeDesktopScaleTarget = inner;
      largeDesktopScaleResizeHandler = function () {
        applyLargeDesktopContentScale(inner, body);
      };

      window.addEventListener("resize", largeDesktopScaleResizeHandler);
    }

    applyLargeDesktopContentScale(inner, body);
  }

  function removeInlineFixedLeftLayoutLocks() {
    const selectors = DAVINCI_WRAPPERS.slice();

    FIXED_LEFT_LAYOUTS.forEach(function (layout) {
      selectors.push(layout.root, layout.shell, layout.hero, layout.body);
    });

    [document.documentElement, document.body].concat(
      selectors.map(function (selector) {
        return document.querySelector(selector);
      })
    ).forEach(function (element) {
      if (!element || !element.style) return;

      FIXED_LEFT_PROPS_TO_CLEAR.forEach(function (property) {
        element.style.removeProperty(property);
      });
    });
  }

function buildFixedLeftLayoutCss(layout) {
  const root = "html[data-theme][data-theme] " + layout.root;
  const shell = "html[data-theme][data-theme] " + layout.root + " " + layout.shell;
  const hero = "html[data-theme][data-theme] " + layout.root + " " + layout.hero;
  const body = "html[data-theme][data-theme] " + layout.root + " " + layout.body;
  const inner = "html[data-theme][data-theme] " + layout.root + " " + layout.inner;

  return `
    @media (min-width: 768px) {
      ${root} {
        display: block !important;
        width: 100% !important;
        height: auto !important;
        min-height: 100vh !important;
        max-height: none !important;
        overflow: visible !important;
        contain: none !important;
      }

      ${shell} {
        display: block !important;
        width: 100% !important;
        height: auto !important;
        min-height: 100vh !important;
        max-height: none !important;
        overflow: visible !important;
        contain: none !important;
      }

      ${hero} {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        bottom: 0 !important;
        width: 50vw !important;
        height: 100vh !important;
        min-height: 100vh !important;
        max-height: 100vh !important;
        overflow: hidden !important;
        z-index: 1 !important;
        contain: none !important;
      }

      ${body} {
        width: 50vw !important;
        min-height: 100vh !important;
        height: auto !important;
        max-height: none !important;
        margin-left: 50vw !important;
        margin-top: 0 !important;
        overflow: visible !important;
        contain: none !important;
      }

      ${inner} {
        height: auto !important;
        min-height: auto !important;
        max-height: none !important;
        overflow: visible !important;
      }
    }

    @media (max-width: 767px) {
      ${root} {
        display: flex !important;
        width: 100% !important;
        height: auto !important;
        min-height: 100svh !important;
        overflow: visible !important;
      }

      ${shell} {
        display: grid !important;
        grid-template-columns: 1fr !important;
        width: 100% !important;
        height: auto !important;
        min-height: 100svh !important;
        overflow: visible !important;
      }

      ${hero} {
        position: relative !important;
        top: auto !important;
        left: auto !important;
        right: auto !important;
        bottom: auto !important;
        width: 100% !important;
        height: 140px !important;
        min-height: auto !important;
        max-height: 140px !important;
        overflow: hidden !important;
      }

      ${body} {
        width: 100% !important;
        margin-left: 0 !important;
        min-height: auto !important;
        height: auto !important;
        overflow: visible !important;
      }
    }
  `;
}

  function injectFixedLeftScrollStyle() {
    let style = document.getElementById(FIXED_LEFT_STYLE_ID);

    if (!style) {
      style = document.createElement("style");
      style.id = FIXED_LEFT_STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = `
      @media (min-width: 768px) {
        html,
        body {
          height: auto !important;
          min-height: 100% !important;
          max-height: none !important;
          overflow-x: hidden !important;
          overflow-y: auto !important;
        }

        ${DAVINCI_WRAPPERS.join(",")} {
          height: auto !important;
          min-height: 100vh !important;
          max-height: none !important;
          overflow: visible !important;
          transform: none !important;
          contain: none !important;
        }
      }

      ${FIXED_LEFT_LAYOUTS.map(buildFixedLeftLayoutCss).join("\n")}
    `;
  }

  function applyFixedLeftScrollLayout() {
    removeInlineFixedLeftLayoutLocks();
    injectFixedLeftScrollStyle();
  }

  function scheduleFixedLeftScrollLayout() {
    if (isFixedLeftScheduled) return;

    isFixedLeftScheduled = true;

    window.requestAnimationFrame(function () {
      isFixedLeftScheduled = false;
      applyFixedLeftScrollLayout();
    });
  }

  function resetToMerlinDefault() {
    document.documentElement.setAttribute("data-theme", DEFAULT_THEME_CODE);

    removeInjectedStyle();
    removeBrandDom();
    restoreTrackedStyles();

    if (lastAppliedThemeCode !== DEFAULT_THEME_CODE) {
      console.log("[Merlin Theme] Reset to Merlin default");
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

    const result = applyBrandHero(theme, hero);

    if (lastAppliedThemeCode !== theme.code || lastAppliedMode !== result.mode) {
      console.log("[Merlin Theme] Theme applied", {
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
      installLargeDesktopContentScale();
      scheduleFixedLeftScrollLayout();
      isApplyingTheme = false;
    }
  }

  function scheduleApplyTheme() {
    if (isApplyScheduled) return;

    isApplyScheduled = true;

    window.requestAnimationFrame(function () {
      isApplyScheduled = false;
      applyTheme();
      installLargeDesktopContentScale();
      scheduleFixedLeftScrollLayout();
    });
  }

  function observeDavinciDomChanges() {
    const observer = new MutationObserver(function () {
      scheduleApplyTheme();
      scheduleFixedLeftScrollLayout();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"]
    });
  }

    function installEnterPrimaryAction() {
    if (window.__merlinEnterPrimaryInstalled) return;

    window.__merlinEnterPrimaryInstalled = true;

    function normalizePrimaryText(value) {
      return String(value || "")
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
    }

    function isTypingTarget(element) {
      return (
        element &&
        element.matches &&
        element.matches("input, select, [contenteditable='true']")
      );
    }

    function findPrimaryButton(context) {
      return (
        context.querySelector("#btnContinue") ||
        context.querySelector("[data-id='btnContinue']") ||
        context.querySelector("[data-skbuttonvalue='continue']") ||
        context.querySelector("[data-skbuttonvalue='letsGo']") ||
        Array.prototype.find.call(
          context.querySelectorAll("button, input[type='submit'], [role='button']"),
          function (button) {
            var text = normalizePrimaryText(
              button.textContent || button.value || button.getAttribute("aria-label")
            );
            var value = normalizePrimaryText(button.getAttribute("data-skbuttonvalue"));

            return (
              text === "continue" ||
              text === "let's go" ||
              text === "lets go" ||
              value === "continue" ||
              value === "letsgo" ||
              value === "let's go" ||
              value === "lets go"
            );
          }
        )
      );
    }

    function isDisabled(button) {
      return (
        !button ||
        button.disabled ||
        button.getAttribute("aria-disabled") === "true" ||
        button.style.pointerEvents === "none"
      );
    }

    document.addEventListener(
      "keydown",
      function (event) {
        if (event.key !== "Enter") return;
        if (!isTypingTarget(event.target)) return;

        var target = event.target;

        if (target.matches("textarea, [contenteditable='true']")) return;

        var context =
          target.closest("form") ||
          target.closest(".merlin-login, .merlin-register, .merlin-verify") ||
          document;

        var primaryButton = findPrimaryButton(context);

        if (!primaryButton && context !== document) {
          primaryButton = findPrimaryButton(document);
        }

        if (isDisabled(primaryButton)) {
          event.preventDefault();
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        primaryButton.click();
      },
      true
    );
  }

  function init() {
    console.log("[Merlin Theme] loaded");
    console.log("[Merlin Theme] URL from:", getFromParam());

    injectBaseStyle();
    applyTheme();
    installLargeDesktopContentScale();
    scheduleFixedLeftScrollLayout();
    installEnterPrimaryAction();
    observeDavinciDomChanges();

    window.addEventListener("resize", function () {
      scheduleApplyTheme();
      scheduleFixedLeftScrollLayout();
    });

    setTimeout(applyTheme, 100);
    setTimeout(applyTheme, 300);
    setTimeout(applyTheme, 800);
    setTimeout(applyTheme, 1500);
    setTimeout(applyTheme, 3000);

    setTimeout(installLargeDesktopContentScale, 100);
    setTimeout(installLargeDesktopContentScale, 300);
    setTimeout(installLargeDesktopContentScale, 800);
    setTimeout(installLargeDesktopContentScale, 1500);
    setTimeout(installLargeDesktopContentScale, 3000);

    setTimeout(scheduleFixedLeftScrollLayout, 100);
    setTimeout(scheduleFixedLeftScrollLayout, 300);
    setTimeout(scheduleFixedLeftScrollLayout, 800);
    setTimeout(scheduleFixedLeftScrollLayout, 1500);
    setTimeout(scheduleFixedLeftScrollLayout, 3000);

    const interval = setInterval(function () {
      applyTheme();
      installLargeDesktopContentScale();
      scheduleFixedLeftScrollLayout();
    }, 500);

    setTimeout(function () {
      clearInterval(interval);
    }, 15000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.__merlinApplyFixedLeftScrollLayout = scheduleFixedLeftScrollLayout;
})();