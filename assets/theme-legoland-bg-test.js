(function () {
  const LEGOLAND_CODE = "001";
  const LEGOLAND_BG = "#FFCF00";
  const STYLE_ID = "merlin-legoland-bg-test-style";

  function getFromParam() {
    const params = new URLSearchParams(window.location.search);
    return params.get("from");
  }

  function shouldApplyLegolandTheme() {
    return getFromParam() === LEGOLAND_CODE;
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      html,
      body {
        background: ${LEGOLAND_BG} !important;
        background-color: ${LEGOLAND_BG} !important;
      }

      html[data-theme="001"],
      html[data-theme="001"] body,
      html[data-theme="001"] body > div,
      html[data-theme="001"] main,
      html[data-theme="001"] section,
      html[data-theme="001"] [id="root"],
      html[data-theme="001"] [class*="root"],
      html[data-theme="001"] [class*="Root"],
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
      html[data-theme="001"] .sk-container,
      html[data-theme="001"] .sk-page,
      html[data-theme="001"] .sk-wrapper,
      html[data-theme="001"] .flow-container {
        background: ${LEGOLAND_BG} !important;
        background-color: ${LEGOLAND_BG} !important;
      }
    `;

    document.head.appendChild(style);
  }

  function applyInlineBackground() {
    document.documentElement.setAttribute("data-theme", "001");
    document.documentElement.style.setProperty("background", LEGOLAND_BG, "important");
    document.documentElement.style.setProperty("background-color", LEGOLAND_BG, "important");

    if (document.body) {
      document.body.style.setProperty("background", LEGOLAND_BG, "important");
      document.body.style.setProperty("background-color", LEGOLAND_BG, "important");

      Array.from(document.body.querySelectorAll("*")).forEach(function (element) {
        const computed = window.getComputedStyle(element);
        const bg = computed.backgroundColor;

        if (
          bg === "rgb(255, 255, 255)" ||
          bg === "rgba(0, 0, 0, 0)" ||
          bg === "transparent"
        ) {
          element.style.setProperty("background-color", LEGOLAND_BG, "important");
        }
      });
    }
  }

  function applyLegolandBackground() {
    const from = getFromParam();

    console.log("[Merlin Theme BG Test] URL:", window.location.href);
    console.log("[Merlin Theme BG Test] from:", from);

    if (!shouldApplyLegolandTheme()) {
      console.log("[Merlin Theme BG Test] LEGOLAND theme not applied");
      return;
    }

    console.log("[Merlin Theme BG Test] Applying persistent LEGOLAND background:", LEGOLAND_BG);

    injectStyle();
    applyInlineBackground();
  }

  function init() {
    applyLegolandBackground();

    setTimeout(applyLegolandBackground, 300);
    setTimeout(applyLegolandBackground, 800);
    setTimeout(applyLegolandBackground, 1500);
    setTimeout(applyLegolandBackground, 3000);
    setTimeout(applyLegolandBackground, 5000);

    const interval = setInterval(applyLegolandBackground, 1000);

    setTimeout(function () {
      clearInterval(interval);
    }, 10000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();