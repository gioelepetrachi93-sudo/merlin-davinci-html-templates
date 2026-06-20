(function () {
  loadFlowModules(["merlin-theme.js", "merlin-otp-lock.js"]);

  function loadFlowModules(files) {
    const fallbackBase =
      "https://cdn.jsdelivr.net/gh/gioelepetrachi93-sudo/merlin-davinci-html-templates@main/assets/";

    const currentSrc =
      document.currentScript && document.currentScript.src
        ? document.currentScript.src
        : fallbackBase + "flows/login-hint-flow.js";

    const assetBase = currentSrc.includes("/assets/flows/")
      ? currentSrc.split("/assets/flows/")[0] + "/assets/"
      : fallbackBase;

    files
      .reduce((chain, file) => chain.then(() => loadScript(assetBase + file)), Promise.resolve())
      .then(() => console.log("[Merlin LoginHint Flow] modules loaded", files))
      .catch((error) => console.error("[Merlin LoginHint Flow] failed to load modules", error));
  }

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.async = false;
      script.onload = resolve;
      script.onerror = () => reject(new Error("Unable to load " + url));
      document.head.appendChild(script);
    });
  }
})();