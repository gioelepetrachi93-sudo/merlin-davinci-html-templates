(function () {
  const fallbackBase =
    "https://cdn.jsdelivr.net/gh/gioelepetrachi93-sudo/merlin-davinci-html-templates@main/assets/";

  const currentSrc =
    document.currentScript && document.currentScript.src
      ? document.currentScript.src
      : fallbackBase + "flows/registration-flow.js";

  const assetBase = currentSrc.includes("/assets/flows/")
    ? currentSrc.split("/assets/flows/")[0] + "/assets/"
    : fallbackBase;

  const scripts = [
    "merlin-theme.js",
    "merlin-otp-lock.js"
  ];

  scripts
    .reduce(function (chain, file) {
      return chain.then(function () {
        return loadScript(assetBase + file);
      });
    }, Promise.resolve())
    .then(function () {
      console.log("[Merlin Registration Flow] modules loaded", scripts);
    })
    .catch(function (error) {
      console.error("[Merlin Registration Flow] failed to load modules", error);
    });

  function loadScript(url) {
    return new Promise(function (resolve, reject) {
      const script = document.createElement("script");
      script.src = url;
      script.async = false;

      script.onload = function () {
        console.log("[Merlin Registration Flow] loaded", url);
        resolve();
      };

      script.onerror = function () {
        console.error("[Merlin Registration Flow] failed", url);
        reject(new Error("Unable to load " + url));
      };

      document.head.appendChild(script);
    });
  }
})();