(function () {
  const REPO = "gioelepetrachi93-sudo/merlin-davinci-html-templates";
  const BRANCH = "main";
  const FLOW_LABEL = "[Merlin SMS Flow]";
  const FALLBACK_BASE =
    "https://cdn.jsdelivr.net/gh/" + REPO + "@" + BRANCH + "/assets/";

  const MODULES = [
    "merlin-theme.js",
    "merlin-contact.js",
    "merlin-otp-lock.js",
    "merlin-error-ui.js"
  ];

  const currentSrc =
    document.currentScript && document.currentScript.src
      ? document.currentScript.src
      : FALLBACK_BASE + "flows/sms-flow.js";

  resolveLatestAssetBase()
    .then(function (assetBase) {
      console.log(FLOW_LABEL + " asset base", assetBase);
      return loadFlowModules(assetBase, MODULES);
    })
    .then(function () {
      console.log(FLOW_LABEL + " modules loaded", MODULES);
    })
    .catch(function (error) {
      console.error(FLOW_LABEL + " failed to load modules", error);
    });

  function resolveLatestAssetBase() {
    const currentShaMatch = currentSrc.match(/@([a-f0-9]{40})\/assets\/flows\//i);

    if (currentShaMatch) {
      return Promise.resolve(currentSrc.split("/assets/flows/")[0] + "/assets/");
    }

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
      })
      .catch(function (error) {
        console.warn(FLOW_LABEL + " latest SHA fallback", error);

        if (currentSrc.includes("/assets/flows/")) {
          return currentSrc.split("/assets/flows/")[0] + "/assets/";
        }

        return FALLBACK_BASE;
      });
  }

  function loadFlowModules(assetBase, files) {
    return files.reduce(function (chain, file) {
      return chain.then(function () {
        return loadScript(assetBase + file);
      });
    }, Promise.resolve());
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
        console.error(FLOW_LABEL + " failed", url);
        reject(new Error("Unable to load " + url));
      };

      document.head.appendChild(script);
    });
  }
})();