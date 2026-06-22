(function () {
  const FLOW_LABEL = "[Merlin SMS Flow]";
  const ASSET_VERSION = "v=20260622-error-ui-records";

  loadFlowModules([
    "merlin-theme.js",
    "merlin-contact.js",
    "merlin-otp-lock.js",
    "merlin-error-ui.js"
  ]);

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
          return loadScript(assetBase + file + "?" + ASSET_VERSION);
        });
      }, Promise.resolve())
      .then(function () {
        console.log(FLOW_LABEL + " modules loaded", files);
      })
      .catch(function (error) {
        console.error(FLOW_LABEL + " failed to load modules", error);
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