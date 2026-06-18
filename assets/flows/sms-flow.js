(function () {
  "use strict";

  const VERSION = "20260618-error-ui";
  const MODULES = [
    "merlin-theme.js",
    "merlin-contact.js",
    "merlin-otp-lock.js",
    "merlin-error-ui.js"
  ];

  loadFlowModules(MODULES);

  function loadFlowModules(files) {
    const fallbackBase =
      "https://cdn.jsdelivr.net/gh/gioelepetrachi93-sudo/merlin-davinci-html-templates@main/assets/";

    const currentSrc =
      document.currentScript && document.currentScript.src
        ? document.currentScript.src
        : fallbackBase + "flows/sms-flow.js";

    const assetBase = currentSrc.includes("/assets/flows/")
      ? currentSrc.split("/assets/flows/")[0] + "/assets/"
      : fallbackBase;

    files
      .reduce(function (chain, file) {
        return chain.then(function () {
          return loadScript(assetBase + file + "?v=" + VERSION);
        });
      }, Promise.resolve())
      .then(function () {
        console.log("[Merlin SMS Flow] modules loaded", files);
      })
      .catch(function (error) {
        console.error("[Merlin SMS Flow] failed to load modules", error);
      });
  }

  function loadScript(url) {
    return new Promise(function (resolve, reject) {
      const cleanUrl = url.split("?")[0];

      const alreadyLoaded = Array.from(document.scripts).some(function (script) {
        return script.src && script.src.split("?")[0] === cleanUrl;
      });

      if (alreadyLoaded) {
        console.log("[Merlin SMS Flow] already loaded", cleanUrl);
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = url;
      script.async = false;

      script.onload = function () {
        console.log("[Merlin SMS Flow] loaded", cleanUrl);
        resolve();
      };

      script.onerror = function () {
        reject(new Error("Unable to load " + url));
      };

      document.head.appendChild(script);
    });
  }
})();