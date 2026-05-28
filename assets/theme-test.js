console.log("[Merlin] Custom JavaScript loaded from GitHub");

document.documentElement.setAttribute("data-theme-test", "loaded");

window.MERLIN_TEST = {
  loaded: true,
  loadedAt: new Date().toISOString()
};