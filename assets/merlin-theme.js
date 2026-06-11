(function () {
  const DEFAULT_THEME_CODE = "000";
  const SESSION_KEY = "merlin_asset_theme_code";
  const STYLE_ID = "merlin-asset-brand-style";

  const CDN_BASE =
    "https://cdn.jsdelivr.net/gh/gioelepetrachi93-sudo/merlin-davinci-html-templates@main/assets/brand-logos/";

  const ASSET_VERSION = "v=1";
  const PAGE_BACKGROUND = "#FFF8E2";
  const INPUT_BACKGROUND = "#FFFFFF";
  const INPUT_BORDER = "rgba(0, 11, 94, 0.25)";
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

  function getHeroElement() {
    return (
      document.querySelector(".mv-hero") ||
      document.querySelector(".mr-hero") ||
      document.querySelector(".ml-hero")
    );
  }

  function isSplitLayoutHero(hero) {
    return !!hero && (hero.matches(".mr-hero") || hero.matches(".ml-hero"));
  }

  function getSplitShell() {
    return document.querySelector(".mr-shell") || document.querySelector(".ml-shell");
  }

  function getSplitBody() {
    return document.querySelector(".mr-body") || document.querySelector(".ml-body");
  }

  function getSplitRoot() {
    return document.querySelector(".merlin-register") || document.querySelector(".merlin-login");
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
        document.querySelector(".merlin-login"),
        document.querySelector(".mr-shell"),
        document.querySelector(".ml-shell"),
        document.querySelector(".mr-body"),
        document.querySelector(".ml-body"),
        document.querySelector(".mr-body-inner"),
        document.querySelector(".ml-body-inner")
      ].filter(Boolean).some(function (element) {
        return element.style === style;
      });
    }

    CSSStyleDeclaration.prototype.setProperty = function (name, value, priority) {
      const property = String(name || "").toLowerCase();
      const nextValue = String(value || "").toLowerCase();

      if (
        (document.querySelector(".merlin-register .mr-body") ||
          document.querySelector(".merlin-login .ml-body")) &&
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
      .merlin-register .mr-body-inner,
      .merlin-login,
      .merlin-login .ml-shell,
      .merlin-login .ml-body,
      .merlin-login .ml-body-inner {
        color-scheme: light !important;
      }

      html,
      body,
      .merlin-register,
      .merlin-register .mr-shell,
      .merlin-register .mr-body,
      .merlin-register .mr-body-inner,
      .merlin-login,
      .merlin-login .ml-shell,
      .merlin-login .ml-body,
      .merlin-login .ml-body-inner {
        --mr-cream-soft: ${PAGE_BACKGROUND} !important;
        --mr-cream: ${PAGE_BACKGROUND} !important;
        --ml-cream-soft: ${PAGE_BACKGROUND} !important;
        --ml-cream: ${PAGE_BACKGROUND} !important;
      }

      .merlin-register,
      .merlin-register .mr-shell,
      .merlin-register .mr-shell > .mr-body,
      main.merlin-register .mr-body,
      section.mr-body,
      .merlin-register .mr-body-inner,
      .merlin-login,
      .merlin-login .ml-shell,
      .merlin-login .ml-shell > .ml-body,
      main.merlin-login .ml-body,
      section.ml-body,
      .merlin-login .ml-body-inner {
        background: ${PAGE_BACKGROUND} !important;
        background-color: ${PAGE_BACKGROUND} !important;
      }

      .merlin-register .mr-body input,
      .merlin-register .mr-body textarea,
      .merlin-register .mr-body select,
      .merlin-login .ml-body input,
      .merlin-login .ml-body textarea,
      .merlin-login .ml-body select {
        background: ${INPUT_BACKGROUND} !important;
        background-color: ${INPUT_BACKGROUND} !important;
        border-color: ${INPUT_BORDER} !important;
      }

      @media (prefers-color-scheme: dark) {
        html,
        body,
        .merlin-register,
        .merlin-register .mr-shell,
        .merlin-register .mr-body,
        .merlin-register .mr-body-inner,
        .merlin-login,
        .merlin-login .ml-shell,
        .merlin-login .ml-body,
        .merlin-login .ml-body-inner {
          color-scheme: light !important;
          --mr-cream-soft: ${PAGE_BACKGROUND} !important;
          --mr-cream: ${PAGE_BACKGROUND} !important;
          --ml-cream-soft: ${PAGE_BACKGROUND} !important;
          --ml-cream: ${PAGE_BACKGROUND} !important;
        }

        .merlin-register,
        .merlin-register .mr-shell,
        .merlin-register .mr-shell > .mr-body,
        main.merlin-register .mr-body,
        section.mr-body,
        .merlin-register .mr-body-inner,
        .merlin-login,
        .merlin-login .ml-shell,
        .merlin-login .ml-shell > .ml-body,
        main.merlin-login .ml-body,
        section.ml-body,
        .merlin-login .ml-body-inner {
          background: ${PAGE_BACKGROUND} !important;
          background-color: ${PAGE_BACKGROUND} !important;
        }
      }

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
      document.querySelector(".merlin-login"),
      document.querySelector(".mr-shell"),
      document.querySelector(".ml-shell"),
      document.querySelector(".mr-hero"),
      document.querySelector(".ml-hero"),
      document.querySelector(".mr-body"),
      document.querySelector(".ml-body"),
      document.querySelector(".mr-hero .mv-hero-brand-wrapper"),
      document.querySelector(".ml-hero .mv-hero-brand-wrapper"),
      document.querySelector(".mr-hero .mv-hero-brand-layer"),
      document.querySelector(".ml-hero .mv-hero-brand-layer")
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
    if (!getSplitBody()) return;

    if (!isDesktopLayout()) {
      clearRegistrationDesktopScrollState();
      return;
    }

    const register = getSplitRoot();
    const shell = getSplitShell();
    const hero = document.querySelector(".mr-hero") || document.querySelector(".ml-hero");
    const body = getSplitBody();
    const wrapper = hero ? hero.querySelector(".mv-hero-brand-wrapper") : null;
    const layer = hero ? hero.querySelector(".mv-hero-brand-layer") : null;

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
      document.querySelector(".merlin-login"),
      document.querySelector(".mr-shell"),
      document.querySelector(".ml-shell"),
      document.querySelector(".mr-body"),
      document.querySelector(".ml-body"),
      document.querySelector(".mr-body-inner"),
      document.querySelector(".ml-body-inner")
    ].forEach(function (element) {
      if (!element) return;

      setImportant(element, "background", PAGE_BACKGROUND);
      setImportant(element, "background-color", PAGE_BACKGROUND);
      setImportant(element, "color-scheme", "light");
      setImportant(element, "--mr-cream-soft", PAGE_BACKGROUND);
      setImportant(element, "--mr-cream", PAGE_BACKGROUND);
      setImportant(element, "--ml-cream-soft", PAGE_BACKGROUND);
      setImportant(element, "--ml-cream", PAGE_BACKGROUND);
    });

    document.querySelectorAll(
      ".mr-body input, .mr-body textarea, .mr-body select, .ml-body input, .ml-body textarea, .ml-body select"
    ).forEach(function (element) {
      setImportant(element, "background", INPUT_BACKGROUND);
      setImportant(element, "background-color", INPUT_BACKGROUND);
      setImportant(element, "border-color", INPUT_BORDER);
    });

    const hero = document.querySelector(".mr-hero") || document.querySelector(".ml-hero");
    const layer = hero ? hero.querySelector(".mv-hero-brand-layer") : null;
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
    if (getSplitBody()) {
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

    if (isSplitLayoutHero(hero)) {
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
    const isRegistrationHero = isSplitLayoutHero(hero);
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
    const hero = document.querySelector(".mr-hero") || document.querySelector(".ml-hero");

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