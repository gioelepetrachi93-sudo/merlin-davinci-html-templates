(function () {
  const DEFAULT_THEME_CODE = "000";
  const STORAGE_KEY = "merlin_theme_code";

  const LEGOLAND_LOGO_SVG = `
    <svg
      class="brand-attraction-logo"
      width="105"
      height="32"
      viewBox="0 0 105 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="LEGOLAND"
      role="img"
    >
      <path d="M70.2224 14.8474H84.9625V0.144043H70.2224V14.8474Z" fill="white"/>
      <path d="M83.9811 6.25591C83.9568 6.7144 83.8114 7.28436 83.6817 7.66609C83.163 9.20247 82.5632 10.1542 81.1716 10.1542C80.7615 10.1542 80.0351 10.0458 79.7674 9.31814L79.7031 9.14568L79.5892 9.28975C79.1538 9.84079 78.5076 10.1573 77.815 10.1605C77.2836 10.1637 76.8577 9.98591 76.5826 9.64729L76.5056 9.55475L76.4245 9.64309C76.1303 9.96803 75.6169 10.1542 75.0171 10.1542C74.5458 10.1542 74.1379 9.99432 73.8701 9.70513L73.7973 9.62521L73.7214 9.70198C73.4242 10.0017 72.955 10.1531 72.3657 10.1394C71.6489 10.1226 71.2135 9.72301 71.1998 9.07312C71.1776 8.06991 72.1507 5.9583 72.5544 5.31683C72.8159 4.88778 73.1754 4.67956 73.654 4.67956C73.9797 4.67956 74.2022 4.74897 74.335 4.88778C74.4562 5.01502 74.4794 5.12229 74.491 5.38098L74.5037 5.71434L74.6808 5.4304C75.1088 4.74371 75.8162 4.64907 76.5183 4.64907C77.0053 4.64907 77.4312 4.82784 77.602 5.10546L77.6663 5.20747L77.758 5.12965C78.1175 4.82258 78.6288 4.65433 79.1939 4.65433C79.8106 4.65433 80.2576 4.80681 80.5254 5.10861C80.5854 5.17802 80.6266 5.22534 80.6814 5.34207L80.751 5.48509L80.8532 5.36415C81.2433 4.9025 81.7788 4.668 82.4419 4.668C82.9659 4.668 83.3644 4.80681 83.6258 5.08128C83.9526 5.4262 83.999 5.90993 83.9811 6.25591ZM70.2214 14.8474H84.9615V0.144043H70.2214V14.8474Z" fill="#FFE800"/>
      <path d="M84.3964 6.81956C84.329 7.35377 83.9674 8.34542 83.7744 8.74187C83.2579 9.80398 82.5674 10.6211 81.238 10.6211C80.5254 10.6211 79.9413 10.3939 79.5998 9.95962C79.1 10.3971 78.4802 10.6263 77.8139 10.6263C77.2984 10.6263 76.844 10.4781 76.4972 10.2046C76.1156 10.4728 75.6011 10.6221 75.0287 10.6221C74.5511 10.6221 74.122 10.4917 73.7857 10.2499C73.4126 10.497 72.9255 10.619 72.3531 10.6053C71.4011 10.5832 70.7433 9.98065 70.7254 9.10572C70.699 7.94476 71.6815 5.81844 72.1433 5.08128C72.4891 4.51447 73.0172 4.2095 73.6656 4.2095C74.3666 4.2095 74.6217 4.4093 74.7461 4.66484C75.288 4.2053 76.0059 4.17901 76.5183 4.17901C77.0823 4.17901 77.4375 4.32833 77.7369 4.5681C78.1544 4.31887 78.632 4.18952 79.2002 4.18952C79.9266 4.18952 80.4674 4.35883 80.8448 4.72899C81.2833 4.36514 81.8326 4.19899 82.4493 4.19899C83.2642 4.19899 83.8008 4.49238 84.1139 4.92774C84.5577 5.54398 84.4776 6.16442 84.3964 6.81956ZM70.2214 14.8474H84.9615V0.144043H70.2214V14.8474Z" fill="#ED1D24"/>
      <path d="M84.854 14.7412H70.3259V0.249176H84.854V14.7412ZM70.1213 14.9462H85.0606V0.045166H70.1213V14.9462Z" fill="black"/>
      <path d="M84.3901 4.18213C84.1919 4.18213 84.0327 4.34197 84.0327 4.53967C84.0327 4.73737 84.1919 4.89721 84.3901 4.89721C84.5883 4.89721 84.7485 4.73737 84.7485 4.53967C84.7485 4.34197 84.5883 4.18213 84.3901 4.18213ZM84.3901 4.25364C84.5493 4.25364 84.6779 4.38088 84.6779 4.53967C84.6779 4.69846 84.5493 4.82675 84.3901 4.82675C84.2309 4.82675 84.1033 4.69846 84.1033 4.53967C84.1033 4.38088 84.2309 4.25364 84.3901 4.25364ZM84.5725 4.7258L84.5303 4.65114L84.4502 4.56491V4.56263L84.5503 4.45958L84.4322 4.35652H84.2478V4.72563H84.3247V4.5742H84.3395L84.3996 4.59314L84.4502 4.66571L84.4807 4.72565L84.5725 4.7258ZM84.3247 4.51548V4.41453H84.3943L84.4702 4.46395L84.4027 4.51548H84.3247Z" fill="black"/>
      <path d="M82.5409 6.22658C82.5261 6.6062 81.9653 8.12996 81.7671 8.46542C81.6817 8.61159 81.5837 8.73148 81.4097 8.73148C81.2569 8.73148 81.1883 8.62421 81.1841 8.50012C81.1736 8.15626 81.805 6.43374 82.0222 6.15507C82.1182 6.00679 82.2246 5.98261 82.3469 5.98366C82.5272 5.98594 82.5451 6.11616 82.5409 6.22658ZM83.5603 6.84807C83.4328 7.47903 83.1471 8.22566 82.8371 8.78195C82.3311 9.68948 81.7165 9.81672 81.1799 9.81041C80.6433 9.80413 80.0382 9.6064 80.0329 8.7809C80.0306 8.1878 80.287 7.35179 80.5041 6.8018C80.8837 5.80699 81.2716 4.99727 82.4966 5.01094C83.9261 5.02883 83.671 6.29598 83.5603 6.84807ZM79.0209 5.96368C78.8153 5.96368 78.6804 6.09408 78.5791 6.23499C78.3578 6.54521 77.8781 7.78925 77.8032 8.30032C77.7516 8.6505 77.9034 8.72096 78.0679 8.72096C78.3346 8.72096 78.6329 8.44124 78.7331 7.97853C78.7331 7.97853 78.2281 7.96592 78.3673 7.51899C78.5032 7.08573 78.7605 6.99109 79.1853 6.97426C80.0245 6.93956 79.9412 7.55685 79.8748 7.88705C79.6566 8.95757 78.8933 9.81672 77.8127 9.81672C77.0737 9.81672 76.6141 9.4087 76.6141 8.65681C76.6141 8.1205 76.8808 7.27922 77.0916 6.78708C77.5418 5.73864 78.013 5.00463 79.2148 5.00463C79.9359 5.00463 80.5052 5.26332 80.4209 5.93739C80.3608 6.43164 80.112 6.72293 79.6618 6.75763C79.5353 6.76711 79.0188 6.75445 79.1906 6.26759C79.2507 6.09723 79.2749 5.96368 79.0209 5.96368ZM75.2615 7.81764C75.213 7.9512 75.1192 8.23092 75.0422 8.52641C75.2879 8.46648 75.4734 8.42336 75.7876 8.43072C76.1471 8.44019 76.3769 8.58846 76.3769 8.88501C76.3769 9.6022 75.582 9.81357 75.0285 9.81357C74.4224 9.81357 73.89 9.4697 73.89 8.80824C73.89 8.03322 74.3117 6.85754 74.707 6.07515C75.1919 5.11294 75.6885 4.98465 76.5424 4.98465C76.9177 4.98465 77.351 5.14449 77.351 5.49783C77.351 5.98892 76.9346 6.1761 76.5213 6.19924C76.3453 6.20976 76.0743 6.21923 75.912 6.20766C75.912 6.20766 75.7739 6.41693 75.6284 6.78814C76.3927 6.68087 76.7163 6.85439 76.5877 7.29501C76.4138 7.89126 75.8951 7.93122 75.2615 7.81764ZM72.8284 8.50644C73.5748 8.3771 73.7635 8.64631 73.7392 8.89554C73.6697 9.64322 72.9813 9.81042 72.3846 9.79675C71.9513 9.78623 71.5623 9.58853 71.5517 9.08798C71.5327 8.2099 72.4299 6.18137 72.8516 5.50835C73.0466 5.18972 73.2838 5.03198 73.6633 5.03198C74.0228 5.03198 74.1114 5.21495 74.1061 5.43579C74.0914 6.02258 73.1394 7.80819 72.8284 8.50644ZM82.4418 4.56612C81.6701 4.56612 81.1367 4.87108 80.7751 5.29803C80.7129 5.17079 80.6676 5.114 80.6022 5.04039C80.307 4.70704 79.8305 4.5514 79.1948 4.5514C78.5707 4.5514 78.051 4.74594 77.6904 5.05196C77.5028 4.747 77.0569 4.54614 76.5181 4.54614C75.815 4.54614 75.0486 4.64604 74.5942 5.3769C74.5826 5.114 74.5594 4.97519 74.4108 4.81745C74.2305 4.62711 73.9395 4.57769 73.6538 4.57769C73.1362 4.57769 72.7483 4.80378 72.4678 5.26333C72.0609 5.91111 71.0742 8.04269 71.0963 9.07536C71.1111 9.74312 71.5602 10.2237 72.3624 10.2426C72.9897 10.2573 73.482 10.0901 73.7951 9.77362C74.0755 10.0786 74.5035 10.2573 75.017 10.2573C75.5873 10.2573 76.1618 10.0859 76.5023 9.71262C76.788 10.0628 77.2392 10.2668 77.8159 10.2637C78.5728 10.2605 79.2359 9.90296 79.6703 9.35403C79.9085 10.0008 80.5126 10.2573 81.1715 10.2573C82.6168 10.2573 83.2514 9.26675 83.7807 7.69882C83.8987 7.34653 84.0579 6.75659 84.0843 6.26129C84.1286 5.43789 83.7785 4.56612 82.4418 4.56612Z" fill="black"/>
      <path d="M0 17.3745H3.7604V28.3269H8.15331V31.4417H0V17.3745Z" fill="black"/>
      <path d="M9.3562 17.4575H17.5749V20.6743H13.1999V22.9037H17.3292V26.0385H13.1999V28.3478H17.6392V31.4416H9.3562V17.4575Z" fill="black"/>
      <path d="M51.9023 17.3745H55.6627V28.2722H59.9755V31.4417H51.9023V17.3745Z" fill="black"/>
      <path d="M69.2661 26.2542L67.7818 21.9079L66.3449 26.2058L69.2661 26.2542ZM65.8178 17.3745H69.7911L75.155 31.4417H71.2291L70.3172 29.1513H65.1684L64.4463 31.4417H60.3633L65.8178 17.3745Z" fill="black"/>
      <path d="M75.8308 17.3734H79.4594L86.2865 26.109V0H89.971V31.4405H86.353L79.5142 22.91L79.5575 31.4405H75.8308L75.8308 17.3734Z" fill="black"/>
      <path d="M97.7291 28.0995C99.1818 28.0995 100.858 26.9239 100.858 24.4074C100.858 22.5513 99.8534 20.7153 97.747 20.7153H96.1921V28.0995H97.7291ZM92.3484 17.3733H97.6047C101.849 17.3733 104.654 20.6658 104.654 24.5925C104.654 28.2089 101.526 31.4415 97.7945 31.4415H92.3484V17.3733Z" fill="black"/>
      <path d="M33.1847 20.9656L29.7026 22.3979C29.7026 22.3979 28.9489 20.8205 27.7281 20.4282C27.1303 20.2358 25.1062 19.9266 23.8496 21.7175C23.371 22.401 22.2346 24.9764 23.7779 27.3057C24.2829 28.066 25.4299 28.9146 26.8657 28.8431C28.3026 28.7726 29.5234 27.986 29.5234 26.5885H26.6148V23.6514H33.9374C33.9374 23.6514 34.0407 26.558 33.1014 28.2595C32.3361 29.6423 30.7073 32 26.7582 32C25.3572 32 22.127 31.6361 20.3317 28.9146C19.8447 28.1774 18.1421 25.1541 19.6148 21.3936C19.988 20.4398 21.2299 18.0296 24.4242 17.2756C26.0097 16.9033 27.6912 16.775 29.846 17.5984C30.7178 17.9328 32.3234 18.9613 33.1847 20.9656Z" fill="black"/>
      <path d="M42.6883 28.3593C44.6829 28.3593 46.5636 26.6673 46.5636 24.5736C46.5636 22.1717 44.8273 20.6616 42.6883 20.6616C40.5504 20.6616 38.7298 22.2191 38.7298 24.5736C38.7298 26.6673 40.5504 28.3593 42.6883 28.3593ZM37.6239 30.31C35.8844 28.945 34.845 26.8408 34.845 24.5284C34.845 22.5019 35.5935 20.5964 36.9766 19.2325C38.4008 17.8318 40.4935 17 42.6251 17C44.6144 17 46.5615 17.7014 47.9563 18.9412C49.5123 20.3241 50.4084 21.9562 50.4084 24.5284C50.4084 26.6084 49.5808 28.556 48.1302 29.9062C46.7155 31.2239 44.703 31.9726 42.6251 31.9726C40.7855 31.9726 38.9754 31.3742 37.6239 30.31Z" fill="black"/>
      <path d="M102.875 30.6361C102.875 30.0409 103.344 29.5667 103.937 29.5667C104.531 29.5667 105 30.0409 105 30.6361C105 31.2303 104.531 31.7035 103.937 31.7035C103.344 31.7035 102.875 31.2303 102.875 30.6361ZM103.106 30.6361C103.106 31.1125 103.479 31.4711 103.937 31.4711C104.394 31.4711 104.768 31.1125 104.768 30.6361C104.768 30.1566 104.394 29.8001 103.937 29.8001C103.479 29.8001 103.106 30.1566 103.106 30.6361ZM104.429 31.1851H104.177L103.919 30.7423H103.723V31.1851H103.494V30.0767H104.032C104.287 30.0767 104.463 30.1219 104.463 30.4142C104.463 30.6203 104.358 30.7297 104.161 30.7423L104.429 31.1851ZM104.037 30.5436C104.161 30.5436 104.236 30.5184 104.236 30.3964C104.236 30.2733 104.088 30.2733 103.981 30.2733H103.723V30.5436H104.037Z" fill="black"/>
    </svg>
  `;

  const THEMES = {
    "000": {
      code: "000",
      name: "Merlin",
      colors: {
        primary: "#6020FC",
        action: "#571CFF",
        mark: "#091464",
        logo: "#FAF1D9",
        label: "#FAF1D9"
      },
      hideBackgroundMark: false,
      logoSvg: null
    },

    "001": {
      code: "001",
      name: "LEGOLAND",
      colors: {
        primary: "#FFCF00",
        action: "#571CFF",
        mark: "#FFCF00",
        logo: "#000000",
        label: "#000000"
      },
      hideBackgroundMark: true,
      logoSvg: LEGOLAND_LOGO_SVG
    },

    "002": {
      code: "002",
      name: "Gardaland",
      colors: {
        primary: "#004B8D",
        action: "#E30613",
        mark: "#00A3E0",
        logo: "#FFFFFF",
        label: "#FFFFFF"
      },
      hideBackgroundMark: false,
      logoSvg: null
    },

    "003": {
      code: "003",
      name: "Alton Towers",
      colors: {
        primary: "#2B005C",
        action: "#FF6B00",
        mark: "#571CFF",
        logo: "#FFFFFF",
        label: "#FFFFFF"
      },
      hideBackgroundMark: false,
      logoSvg: null
    }
  };

  const THEME_CSS = `
    :root {
      --brand-primary: #6020FC;
      --brand-action: #571CFF;
      --brand-mark: #091464;
      --brand-logo: #FAF1D9;
      --brand-label: #FAF1D9;
    }

    .merlin-brand {
      background: var(--brand-primary) !important;
    }

    .brand-bg-mark {
      fill: var(--brand-mark) !important;
    }

    .brand-logo-path {
      fill: var(--brand-logo) !important;
    }

    .brand-attraction-logo {
      position: relative;
      z-index: 12;
      width: clamp(150px, 16vw, 240px);
      height: auto;
      display: block;
    }

    html[data-theme="001"] .merlin-bg-logo-wrap {
      display: none !important;
    }

    html[data-theme="001"] .brand-name {
      display: none !important;
    }

    .brand-name {
      position: absolute;
      z-index: 11;
      left: 50%;
      top: calc(50% + 44px);
      transform: translateX(-50%);
      color: var(--brand-label);
      font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-weight: 800;
      font-size: clamp(18px, 2vw, 28px);
      line-height: 1;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      white-space: nowrap;
      pointer-events: none;
    }

    .btn,
    .btn-continue,
    .merlin-btn {
      background: var(--brand-action) !important;
    }

    .btn.is-active:hover,
    .btn-continue.is-active:hover,
    .merlin-btn:hover:not(:disabled) {
      filter: brightness(0.95);
    }

    .terms a,
    .footer a,
    .sms-fallback a,
    .merlin-legal a {
      color: var(--brand-action) !important;
    }

    @media (max-width: 900px) {
      .brand-attraction-logo {
        width: 105px;
        height: auto;
      }

      .brand-name {
        top: calc(50% + 36px);
        font-size: 16px;
      }
    }
  `;

  function injectThemeCss() {
    if (document.getElementById("merlin-theme-engine-css")) return;

    const style = document.createElement("style");
    style.id = "merlin-theme-engine-css";
    style.textContent = THEME_CSS;
    document.head.appendChild(style);
  }

  function isLocalPreview() {
    return (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    );
  }

  function getThemeCodeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("from");
  }

  function getValidTheme(code) {
    if (!code) return null;
    return THEMES[code] || null;
  }

  function askThemeCodeForLocalTest() {
    if (!isLocalPreview()) return null;

    return window.prompt(
      "Insert attraction code:\\n000 = Merlin\\n001 = LEGOLAND\\n002 = Gardaland\\n003 = Alton Towers",
      DEFAULT_THEME_CODE
    );
  }

  function resolveThemeCode() {
    const fromUrl = getThemeCodeFromUrl();

    if (getValidTheme(fromUrl)) {
      sessionStorage.setItem(STORAGE_KEY, fromUrl);
      return fromUrl;
    }

    const fromSession = sessionStorage.getItem(STORAGE_KEY);

    if (getValidTheme(fromSession)) {
      return fromSession;
    }

    const fromPrompt = askThemeCodeForLocalTest();

    if (getValidTheme(fromPrompt)) {
      sessionStorage.setItem(STORAGE_KEY, fromPrompt);
      return fromPrompt;
    }

    sessionStorage.setItem(STORAGE_KEY, DEFAULT_THEME_CODE);
    return DEFAULT_THEME_CODE;
  }

  function applyTheme(theme) {
    const root = document.documentElement;

    root.setAttribute("data-theme", theme.code);

    root.style.setProperty("--brand-primary", theme.colors.primary);
    root.style.setProperty("--brand-action", theme.colors.action);
    root.style.setProperty("--brand-mark", theme.colors.mark);
    root.style.setProperty("--brand-logo", theme.colors.logo);
    root.style.setProperty("--brand-label", theme.colors.label);

    applyBackgroundMark(theme);
    applyBrandLogo(theme);
    applyBrandName(theme);
  }

  function applyBackgroundMark(theme) {
    const mark = document.querySelector(".merlin-bg-logo-wrap");

    if (!mark) return;

    mark.style.display = theme.hideBackgroundMark ? "none" : "";
  }

  function applyBrandLogo(theme) {
    if (!theme.logoSvg) return;

    const currentLogo =
      document.querySelector(".brand-attraction-logo") ||
      document.querySelector(".merlin-logo");

    if (!currentLogo) return;

    currentLogo.outerHTML = theme.logoSvg;
  }

  function applyBrandName(theme) {
    if (theme.logoSvg) return;

    let brandName = document.getElementById("brandName");

    if (!brandName) {
      const brandContainer = document.querySelector(".merlin-brand");

      if (!brandContainer) return;

      brandName = document.createElement("div");
      brandName.id = "brandName";
      brandName.className = "brand-name";

      brandContainer.appendChild(brandName);
    }

    brandName.textContent = theme.name;
  }

  function initTheme() {
    injectThemeCss();

    const themeCode = resolveThemeCode();
    const theme = THEMES[themeCode] || THEMES[DEFAULT_THEME_CODE];

    if (!theme) return;

    applyTheme(theme);
  }

  window.MERLIN_THEME_ENGINE = {
    initTheme,
    applyTheme,
    resolveThemeCode,
    getCurrentThemeCode: function () {
      return sessionStorage.getItem(STORAGE_KEY) || DEFAULT_THEME_CODE;
    },
    getThemes: function () {
      return THEMES;
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
  } else {
    initTheme();
  }
})();