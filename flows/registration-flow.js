(function () {
  const src = document.currentScript && document.currentScript.src;
  const assetBase = src.replace(/\/flows\/[^/?#]+([?#].*)?$/, "/");

  const scripts = [
    "theme-asset-brand.js",
    "merlin-otp-lock.js"
  ];

  scripts.reduce((chain, file) => {
    return chain.then(() => loadScript(assetBase + file));
  }, Promise.resolve());

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.async = false;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
})();