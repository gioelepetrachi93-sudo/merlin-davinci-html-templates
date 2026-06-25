(function () {
  "use strict";

  const FLOW_LABEL = "[Merlin SMS Flow Live]";
  const REPO = "gioelepetrachi93-sudo/merlin-davinci-html-templates";
  const BRANCH = "main";
  const MODULE_VERSION = "v=" + Date.now();

  const MODULES = [
    "merlin-theme.js",
    "merlin-contact.js",
    "merlin-otp-lock.js",
    "merlin-error-ui.js"
  ];

  resolveLatestAssetBase()
    .then(function (assetBase) {
      console.log(FLOW_LABEL + " asset base", assetBase);

      return MODULES.reduce(function (chain, file) {
        return chain.then(function () {
          return loadScript(assetBase + file + "?" + MODULE_VERSION);
        });
      }, Promise.resolve());
    })
    .then(function () {
      console.log(FLOW_LABEL + " modules loaded", MODULES);
    })
    .catch(function (error) {
      console.error(FLOW_LABEL + " failed to load modules", error);
    });

  function resolveLatestAssetBase() {
    return fetch("https://api.github.com/repos/" + REPO + "/commits/" + BRANCH + "?t=" + Date.now(), {
      cache: "no-store"
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Unable to resolve latest GitHub SHA");
        }

        return response.json();
      })
      .then(function (data) {
        if (!data || !data.sha) {
          throw new Error("GitHub SHA missing");
        }

        return "https://cdn.jsdelivr.net/gh/" + REPO + "@" + data.sha + "/assets/";
      });
  }

  function loadScript(url) {
    return new Promise(function (resolve, reject) {
      const alreadyLoaded = Array.from(document.scripts).some(function (script) {
        return script.src === url;
      });

      if (alreadyLoaded) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = url;
      script.async = false;

      script.onload = function () {
        console.log(FLOW_LABEL + " loaded", url);
        resolve();
      };

      script.onerror = function () {
        reject(new Error("Unable to load " + url));
      };

      document.head.appendChild(script);
    });
  }
})();