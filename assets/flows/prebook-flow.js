(function () {
  "use strict";

  const FLOW_LABEL = "[Merlin SMS Flow Live]";
  const REPO_BASE =
    "https://cdn.jsdelivr.net/gh/gioelepetrachi93-sudo/merlin-davinci-html-templates@main/assets/";
  const MODULE_VERSION = "v=" + Date.now();

  const MODULES = [
    "merlin-theme.js",
    "merlin-contact.js",
    "merlin-otp-lock.js",
    "merlin-error-ui.js"
  ];

  MODULES
    .reduce(function (chain, file) {
      return chain.then(function () {
        return loadScript(REPO_BASE + file + "?" + MODULE_VERSION);
      });
    }, Promise.resolve())
    .then(function () {
      console.log(FLOW_LABEL + " modules loaded", MODULES);
    })
    .catch(function (error) {
      console.error(FLOW_LABEL + " failed to load modules", error);
    });

  function loadScript(url) {
    return new Promise(function (resolve, reject) {
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