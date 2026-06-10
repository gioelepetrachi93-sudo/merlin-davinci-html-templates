(function () {
  const src = document.currentScript && document.currentScript.src;
  const assetBase = src.replace(/\/flows\/[^/?#]+([?#].*)?$/, "/");

  loadScript(assetBase + "theme-asset-brand.js");

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