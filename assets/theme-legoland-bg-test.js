(function () {
  const LEGOLAND_CODE = "001";
  const LEGOLAND_BG = "#FFCF00";

  function getFromParam() {
    const params = new URLSearchParams(window.location.search);
    return params.get("from");
  }

  function applyLegolandBackground() {
    const from = getFromParam();

    console.log("[Merlin Theme BG Test] URL:", window.location.href);
    console.log("[Merlin Theme BG Test] from:", from);

    if (from !== LEGOLAND_CODE) {
      console.log("[Merlin Theme BG Test] LEGOLAND theme not applied");
      return;
    }

    console.log("[Merlin Theme BG Test] Applying LEGOLAND background:", LEGOLAND_BG);

    document.documentElement.setAttribute("data-theme", "001");
    document.documentElement.style.setProperty("background-color", LEGOLAND_BG, "important");

    if (document.body) {
      document.body.style.setProperty("background-color", LEGOLAND_BG, "important");
    }

    const style = document.createElement("style");
    style.id = "merlin-legoland-bg-test-style";
    style.textContent = `
      html,
      body {
        background: ${LEGOLAND_BG} !important;
        background-color: ${LEGOLAND_BG} !important;
      }

      .merlin-brand,
      .card,
      .page,
      .container,
      .content,
      .flow-container,
      .sk-container,
      .sk-page,
      .sk-wrapper,
      main,
      section {
        background-color: ${LEGOLAND_BG} !important;
      }
    `;

    if (!document.getElementById("merlin-legoland-bg-test-style")) {
      document.head.appendChild(style);
    }
  }

  function init() {
    applyLegolandBackground();

    // Re-apply because DaVinci may render some elements after the script loads.
    setTimeout(applyLegolandBackground, 300);
    setTimeout(applyLegolandBackground, 800);
    setTimeout(applyLegolandBackground, 1500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();