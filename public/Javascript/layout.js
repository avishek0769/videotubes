// layout.js — Shared layout components for VideoTubes
// Modern, glassmorphism-inspired dark theme with smooth transitions

// ─── SVG Constants ───────────────────────────────────────────────

const PLAY_LOGO = `<svg style="width:100%" viewBox="0 0 63 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M47.25 47.458C55.9485 38.7595 55.9485 24.6565 47.25 15.958C38.5515 7.25952 24.4485 7.25952 15.75 15.958C7.05151 24.6565 7.05151 38.7595 15.75 47.458C24.4485 56.1565 38.5515 56.1565 47.25 47.458Z" stroke="#E9FCFF" stroke-width="1.38962" stroke-miterlimit="10"></path>
  <path d="M10.5366 47.7971V17.5057C10.5366 16.9599 11.1511 16.6391 11.599 16.9495L33.4166 32.0952C33.8041 32.3639 33.8041 32.9368 33.4166 33.2076L11.599 48.3533C11.1511 48.6657 10.5366 48.3429 10.5366 47.7971Z" stroke="url(#paint0_linear_53_10115)" stroke-width="6.99574" stroke-miterlimit="10" stroke-linecap="round"></path>
  <path d="M18.1915 27.6963C20.1641 27.6963 21.7285 28.7066 21.7285 30.9021C21.7285 33.0976 20.1621 34.2433 18.1915 34.2433H16.8854V37.8677H14.1733V27.6984H18.1915V27.6963Z" fill="#E9FCFF"></path>
  <path d="M25.2053 27.6963V35.4868H28.484V37.8657H22.4932V27.6963H25.2053Z" fill="#E9FCFF"></path>
  <path d="M35.3142 27.6963L39.4553 37.8657H36.5328L35.9162 36.1763H32.1939L31.5773 37.8657H28.6548L32.7959 27.6963H35.3101H35.3142ZM34.9143 33.5663L34.2144 31.7832C34.1582 31.6395 33.954 31.6395 33.8978 31.7832L33.1979 33.5663C33.1541 33.6767 33.2354 33.7975 33.3562 33.7975H34.756C34.8747 33.7975 34.958 33.6767 34.9143 33.5663Z" fill="#E9FCFF"></path>
  <path d="M40.9491 27.6963L42.8592 30.5188L44.7694 27.6963H48.0355L44.2132 33.2559V37.8657H41.5011V33.2559L37.6787 27.6963H40.9449H40.9491Z" fill="#E9FCFF"></path>
  <path d="M16.894 32.1396V29.9129C16.894 29.8212 16.9982 29.7671 17.0732 29.8191L18.6771 30.9315C18.7417 30.9773 18.7417 31.0731 18.6771 31.1189L17.0732 32.2313C16.9982 32.2834 16.894 32.2313 16.894 32.1375V32.1396Z" fill="#232323"></path>
  <defs>
    <linearGradient id="paint0_linear_53_10115" x1="2.23416" y1="20.3361" x2="26.863" y2="44.9649" gradientUnits="userSpaceOnUse">
      <stop stop-color="#007EF8"></stop>
      <stop offset="1" stop-color="#FF4A9A"></stop>
    </linearGradient>
  </defs>
</svg>`;

const ICON = {
  home: `<svg style="width:100%" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 15.9997H14M9.0177 1.76375L2.23539 7.03888C1.78202 7.3915 1.55534 7.56781 1.39203 7.78861C1.24737 7.9842 1.1396 8.20454 1.07403 8.43881C1 8.70327 1 8.99045 1 9.56481V16.7997C1 17.9198 1 18.4799 1.21799 18.9077C1.40973 19.284 1.71569 19.59 2.09202 19.7818C2.51984 19.9997 3.07989 19.9997 4.2 19.9997H15.8C16.9201 19.9997 17.4802 19.9997 17.908 19.7818C18.2843 19.59 18.5903 19.284 18.782 18.9077C19 18.4799 19 17.9198 19 16.7997V9.56481C19 8.99045 19 8.70327 18.926 8.43881C18.8604 8.20454 18.7526 7.9842 18.608 7.78861C18.4447 7.56781 18.218 7.3915 17.7646 7.03888L10.9823 1.76376C10.631 1.4905 10.4553 1.35388 10.2613 1.30136C10.0902 1.25502 9.9098 1.25502 9.73865 1.30136C9.54468 1.35388 9.36902 1.4905 9.0177 1.76375Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
  liked: `<svg style="width:100%" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 21V10M1 12V19C1 20.1046 1.89543 21 3 21H16.4262C17.907 21 19.1662 19.9197 19.3914 18.4562L20.4683 11.4562C20.7479 9.6389 19.3418 8 17.5032 8H14C13.4477 8 13 7.55228 13 7V3.46584C13 2.10399 11.896 1 10.5342 1C10.2093 1 9.91498 1.1913 9.78306 1.48812L6.26394 9.40614C6.10344 9.76727 5.74532 10 5.35013 10H3C1.89543 10 1 10.8954 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
  history: `<svg style="width:100%" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.7 11.5L18.7005 9.5L16.7 11.5M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C13.3019 1 16.1885 2.77814 17.7545 5.42909M10 5V10L13 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
  myContent: `<svg style="width:100%" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 4.93137C21 4.32555 21 4.02265 20.8802 3.88238C20.7763 3.76068 20.6203 3.69609 20.4608 3.70865C20.2769 3.72312 20.0627 3.93731 19.6343 4.36569L16 8L19.6343 11.6343C20.0627 12.0627 20.2769 12.2769 20.4608 12.2914C20.6203 12.3039 20.7763 12.2393 20.8802 12.1176C21 11.9774 21 11.6744 21 11.0686V4.93137Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M1 5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H11.2C12.8802 1 13.7202 1 14.362 1.32698C14.9265 1.6146 15.3854 2.07354 15.673 2.63803C16 3.27976 16 4.11984 16 5.8V10.2C16 11.8802 16 12.7202 15.673 13.362C15.3854 13.9265 14.9265 14.3854 14.362 14.673C13.7202 15 12.8802 15 11.2 15H5.8C4.11984 15 3.27976 15 2.63803 14.673C2.07354 14.3854 1.6146 13.9265 1.32698 13.362C1 12.7202 1 11.8802 1 10.2V5.8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
  collections: `<svg style="width:100%" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5L10.8845 2.76892C10.5634 2.1268 10.4029 1.80573 10.1634 1.57116C9.95158 1.36373 9.69632 1.20597 9.41607 1.10931C9.09916 1 8.74021 1 8.02229 1H4.2C3.0799 1 2.51984 1 2.09202 1.21799C1.71569 1.40973 1.40973 1.71569 1.21799 2.09202C1 2.51984 1 3.0799 1 4.2V5M1 5H16.2C17.8802 5 18.7202 5 19.362 5.32698C19.9265 5.6146 20.3854 6.07354 20.673 6.63803C21 7.27976 21 8.11984 21 9.8V14.2C21 15.8802 21 16.7202 20.673 17.362C20.3854 17.9265 19.9265 18.3854 19.362 18.673C18.7202 19 17.8802 19 16.2 19H5.8C4.11984 19 3.27976 19 2.63803 18.673C2.07354 18.3854 1.6146 17.9265 1.32698 17.362C1 16.7202 1 15.8802 1 14.2V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
  subscribers: `<svg style="width:100%" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 13.5H6.5C5.10444 13.5 4.40665 13.5 3.83886 13.6722C2.56045 14.06 1.56004 15.0605 1.17224 16.3389C1 16.9067 1 17.6044 1 19M15 16L17 18L21 14M13.5 5.5C13.5 7.98528 11.4853 10 9 10C6.51472 10 4.5 7.98528 4.5 5.5C4.5 3.01472 6.51472 1 9 1C11.4853 1 13.5 3.01472 13.5 5.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
  support: `<svg style="width:100%" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.09 8C8.3251 7.33167 8.78915 6.76811 9.39995 6.40913C10.0108 6.05016 10.7289 5.91894 11.4272 6.03871C12.1255 6.15849 12.7588 6.52152 13.2151 7.06353C13.6713 7.60553 13.9211 8.29152 13.92 9C13.92 11 10.92 12 10.92 12M11 16H11.01M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
  settings: `<svg style="width:100%" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 14C12.6569 14 14 12.6569 14 11C14 9.34315 12.6569 8 11 8C9.34315 8 8 9.34315 8 11C8 12.6569 9.34315 14 11 14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17.7273 13.7273C17.6063 14.0015 17.5702 14.3056 17.6236 14.6005C17.6771 14.8954 17.8177 15.1676 18.0273 15.3818L18.0818 15.4364C18.2509 15.6052 18.385 15.8057 18.4765 16.0265C18.568 16.2472 18.6151 16.4838 18.6151 16.7227C18.6151 16.9617 18.568 17.1983 18.4765 17.419C18.385 17.6397 18.2509 17.8402 18.0818 18.0091C17.913 18.1781 17.7124 18.3122 17.4917 18.4037C17.271 18.4952 17.0344 18.5423 16.7955 18.5423C16.5565 18.5423 16.3199 18.4952 16.0992 18.4037C15.8785 18.3122 15.678 18.1781 15.5091 18.0091L15.4545 17.9545C15.2403 17.745 14.9682 17.6044 14.6733 17.5509C14.3784 17.4974 14.0742 17.5335 13.8 17.6545C13.5311 17.7698 13.3018 17.9611 13.1403 18.205C12.9788 18.4489 12.8921 18.7347 12.8909 19.0273V19.1818C12.8909 19.664 12.6994 20.1265 12.3584 20.4675C12.0174 20.8084 11.5549 21 11.0727 21C10.5905 21 10.1281 20.8084 9.78708 20.4675C9.4461 20.1265 9.25455 19.664 9.25455 19.1818V19.1C9.24751 18.7991 9.15011 18.5073 8.97501 18.2625C8.79991 18.0176 8.55521 17.8312 8.27273 17.7273C7.99853 17.6063 7.69437 17.5702 7.39947 17.6236C7.10456 17.6771 6.83244 17.8177 6.61818 18.0273L6.56364 18.0818C6.39478 18.2509 6.19425 18.385 5.97353 18.4765C5.7528 18.568 5.51621 18.6151 5.27727 18.6151C5.03834 18.6151 4.80174 18.568 4.58102 18.4765C4.36029 18.385 4.15977 18.2509 3.99091 18.0818C3.82186 17.913 3.68775 17.7124 3.59626 17.4917C3.50476 17.271 3.45766 17.0344 3.45766 16.7955C3.45766 16.5565 3.50476 16.3199 3.59626 16.0992C3.68775 15.8785 3.82186 15.678 3.99091 15.5091L4.04545 15.4545C4.25503 15.2403 4.39562 14.9682 4.4491 14.6733C4.50257 14.3784 4.46647 14.0742 4.34545 13.8C4.23022 13.5311 4.03887 13.3018 3.79497 13.1403C3.55107 12.9788 3.26526 12.8921 2.97273 12.8909H2.81818C2.33597 12.8909 1.87351 12.6994 1.53253 12.3584C1.19156 12.0174 1 11.5549 1 11.0727C1 10.5905 1.19156 10.1281 1.53253 9.78708C1.87351 9.4461 2.33597 9.25455 2.81818 9.25455H2.9C3.2009 9.24751 3.49273 9.15011 3.73754 8.97501C3.98236 8.79991 4.16883 8.55521 4.27273 8.27273C4.39374 7.99853 4.42984 7.69437 4.37637 7.39947C4.3229 7.10456 4.18231 6.83244 3.97273 6.61818L3.91818 6.56364C3.74913 6.39478 3.61503 6.19425 3.52353 5.97353C3.43203 5.7528 3.38493 5.51621 3.38493 5.27727C3.38493 5.03834 3.43203 4.80174 3.52353 4.58102C3.61503 4.36029 3.74913 4.15977 3.91818 3.99091C4.08704 3.82186 4.28757 3.68775 4.50829 3.59626C4.72901 3.50476 4.96561 3.45766 5.20455 3.45766C5.44348 3.45766 5.68008 3.50476 5.9008 3.59626C6.12152 3.68775 6.32205 3.82186 6.49091 3.99091L6.54545 4.04545C6.75971 4.25503 7.03183 4.39562 7.32674 4.4491C7.62164 4.50257 7.9258 4.46647 8.2 4.34545H8.27273C8.54161 4.23022 8.77093 4.03887 8.93245 3.79497C9.09397 3.55107 9.18065 3.26526 9.18182 2.97273V2.81818C9.18182 2.33597 9.37338 1.87351 9.71435 1.53253C10.0553 1.19156 10.5178 1 11 1C11.4822 1 11.9447 1.19156 12.2856 1.53253C12.6266 1.87351 12.8182 2.33597 12.8182 2.81818V2.9C12.8193 3.19253 12.906 3.47834 13.0676 3.72224C13.2291 3.96614 13.4584 4.15749 13.7273 4.27273C14.0015 4.39374 14.3056 4.42984 14.6005 4.37637C14.8954 4.3229 15.1676 4.18231 15.3818 3.97273L15.4364 3.91818C15.6052 3.74913 15.8057 3.61503 16.0265 3.52353C16.2472 3.43203 16.4838 3.38493 16.7227 3.38493C16.9617 3.38493 17.1983 3.43203 17.419 3.52353C17.6397 3.61503 17.8402 3.74913 18.0091 3.91818C18.1781 4.08704 18.3122 4.28757 18.4037 4.50829C18.4952 4.72901 18.5423 4.96561 18.5423 5.20455C18.5423 5.44348 18.4952 5.68008 18.4037 5.9008C18.3122 6.12152 18.1781 6.32205 18.0091 6.49091L17.9545 6.54545C17.745 6.75971 17.6044 7.03183 17.5509 7.32674C17.4974 7.62164 17.5335 7.9258 17.6545 8.2V8.27273C17.7698 8.54161 17.9611 8.77093 18.205 8.93245C18.4489 9.09397 18.7347 9.18065 19.0273 9.18182H19.1818C19.664 9.18182 20.1265 9.37338 20.4675 9.71435C20.8084 10.0553 21 10.5178 21 11C21 11.4822 20.8084 11.9447 20.4675 12.2856C20.1265 12.6266 19.664 12.8182 19.1818 12.8182H19.1C18.8075 12.8193 18.5217 12.906 18.2778 13.0676C18.0339 13.2291 17.8425 13.4584 17.7273 13.7273Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
};

// ─── Sidebar items configuration ─────────────────────────────────

const SIDEBAR_ITEMS = [
  { id: 'homeBtn', icon: 'home', label: 'Home', alwaysVisible: true, key: 'home' },
  { id: 'likedVidBtn', icon: 'liked', label: 'Liked Videos', desktopOnly: true, key: 'liked' },
  { id: 'historyBtn', icon: 'history', label: 'History', alwaysVisible: true, key: 'history' },
  { id: 'myContentBtn', icon: 'myContent', label: 'My Content', desktopOnly: true, key: 'myContent' },
  { id: 'collectionBtn', icon: 'collections', label: 'Collections', alwaysVisible: true, key: 'collections' },
  { id: 'subsBtn', icon: 'subscribers', label: 'Subscribers', alwaysVisible: true, key: 'subscribers' },
  { id: 'supportBtn', icon: 'support', label: 'Support', desktopOnly: true, pushDown: true, key: 'support' },
  { id: 'settingsBtn', icon: 'settings', label: 'Settings', desktopOnly: true, key: 'settings' },
];

const MOBILE_MENU_ITEMS = [
  { id: 'sm_likedVidBtn', icon: 'liked', label: 'Liked Videos', key: 'liked' },
  { id: 'sm_myContentBtn', icon: 'myContent', label: 'My Content', key: 'myContent' },
  { id: null, icon: 'support', label: 'Support', key: 'support' },
  { id: null, icon: 'settings', label: 'Settings', key: 'settings' },
];

// ─── Shared CSS injection ────────────────────────────────────────

function injectSharedStyles() {
  if (document.getElementById('layout-shared-styles')) return;
  const style = document.createElement('style');
  style.id = 'layout-shared-styles';
  style.textContent = `
    /* Ripple / wave effect */
    .wave {
      position: absolute;
      border-radius: 50%;
      background: rgba(174, 122, 255, 0.35);
      pointer-events: none;
      width: 20px;
      height: 20px;
      z-index: 10;
      animation: wave 0.6s ease-out;
    }
    @keyframes wave {
      from { transform: scale(0); opacity: 1; }
      to { transform: scale(3); opacity: 0; }
    }

    /* Custom scrollbar */
    .custom-scrollbar::-webkit-scrollbar { width: 5px; }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #ae7aff 0%, #8b5cf6 100%);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #ae7aff transparent; }

    /* Smooth page transitions */
    [data-layout-wrapper] {
      animation: pageIn 0.35s ease-out;
    }
    @keyframes pageIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Header glass effect */
    .header-glass {
      background: rgba(15, 15, 15, 0.8);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    /* Sidebar glass */
    .sidebar-glass {
      background: rgba(15, 15, 15, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-right: 1px solid rgba(255, 255, 255, 0.06);
    }

    /* Mobile menu glass */
    .mobile-menu-glass {
      background: rgba(15, 15, 15, 0.95);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
    }

    /* Alert toast animation */
    .alert-toast {
      animation: slideDown 0.3s ease-out;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translate(-50%, -12px); }
      to { opacity: 1; transform: translate(-50%, 0); }
    }

    /* Hover glow for clickable items */
    .hover-glow:hover {
      box-shadow: 0 0 0 1px rgba(174, 122, 255, 0.2);
    }
  `;
  document.head.appendChild(style);
}

// ─── Header HTML builder ─────────────────────────────────────────

function createHeaderHTML(showAuthButtons) {
  const authSection = showAuthButtons
    ? `<div class="mb-8 mt-auto flex w-full flex-wrap gap-3 px-4 sm:mb-0 sm:mt-0 sm:items-center sm:px-0">
        <button id="logOut" class="hidden w-full rounded-lg bg-white/[0.06] px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/[0.12] sm:w-auto">Log Out</button>
        <button id="logIn" class="w-full rounded-lg bg-white/[0.06] px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/[0.12] sm:w-auto">Log in</button>
        <button id="signUp" class="w-full rounded-lg bg-gradient-to-r from-[#ae7aff] to-[#8b5cf6] px-5 py-2 text-sm font-bold text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(174,122,255,0.4)] hover:scale-[1.02] active:scale-[0.98] sm:w-auto">Sign up</button>
      </div>`
    : `<button id="signUp" class="hidden"></button>
       <button id="logIn" class="hidden"></button>
       <div id="avatarSection" class="mb-8 mt-auto px-4 sm:mb-0 sm:mt-0 sm:px-0">
        <button class="flex w-full gap-4 text-left sm:items-center group">
          <img id="avatarLogo" src="" alt="avatar" class="h-14 w-14 shrink-0 rounded-full sm:h-10 sm:w-10 object-cover object-center ring-2 ring-white/10 transition-all duration-300 group-hover:ring-[#ae7aff]/50" />
          <div class="w-full pt-2 sm:hidden">
            <h6 id="avatarName" class="font-semibold"></h6>
            <p id="avatarHandle" class="text-sm text-gray-400"></p>
          </div>
        </button>
       </div>`;

  return `<header class="header-glass sticky inset-x-0 top-0 z-50 w-full px-4">
    <nav class="mx-auto flex max-w-7xl items-center py-2.5 gap-4">
      <div id="alertDiv" class="alert-toast fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 bg-[#1a1a2e]/95 backdrop-blur-md rounded-xl border border-white/10 font-medium text-sm sm:text-base shadow-2xl shadow-black/40 transition-all duration-300 hidden">
        <span class="text-[#ae7aff] mr-1">&#9432;</span> Please Log in or create a new Account
      </div>
      <a href="/Home" class="mr-2 w-10 shrink-0 sm:w-12 transition-transform duration-200 hover:scale-105">${PLAY_LOGO}</a>
      <div id="searchBoxDiv" class="absolute hidden top-[4.5rem] left-1/2 -translate-x-1/2 w-[92%] max-w-md sm:relative sm:top-0 sm:left-0 mx-auto sm:w-full sm:max-w-md overflow-hidden sm:block">
        <input id="searchBox" class="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm placeholder-gray-500 outline-none transition-all duration-300 focus:border-[#ae7aff]/40 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(174,122,255,0.08)]" placeholder="Search videos..." />
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><span class="h-4 w-4 inline-block">${ICON.search}</span></span>
      </div>
      <button id="search" class="ml-auto rounded-lg p-2 text-gray-400 transition-all duration-200 hover:bg-white/[0.06] hover:text-white sm:hidden"><span class="h-5 w-5 inline-block">${ICON.search}</span></button>
      <button id="hamBurger" class="group rounded-lg p-2 transition-all duration-200 hover:bg-white/[0.06] sm:hidden">
        <div class="flex w-5 flex-col gap-y-1">
          <span class="block h-[2px] w-full rounded-full bg-gray-300 transition-all duration-200 group-hover:bg-[#ae7aff]"></span>
          <span class="block h-[2px] w-3/4 rounded-full bg-gray-300 transition-all duration-200 group-hover:bg-[#ae7aff] group-hover:w-full"></span>
          <span class="block h-[2px] w-full rounded-full bg-gray-300 transition-all duration-200 group-hover:bg-[#ae7aff]"></span>
        </div>
      </button>
      <div id="menuDiv" class="mobile-menu-glass fixed inset-y-0 right-0 flex w-full max-w-xs shrink-0 translate-x-full flex-col border-l border-white/[0.06] duration-300 ease-out sm:static sm:ml-2 sm:w-auto sm:translate-x-0 sm:border-none sm:bg-transparent sm:backdrop-blur-none">
        <div class="relative flex w-full items-center justify-between border-b border-white/[0.08] px-4 py-3 sm:hidden">
          <span class="inline-block w-10">${PLAY_LOGO}</span>
          <button id="cross" class="inline-block w-7 text-gray-400 transition-colors duration-200 hover:text-white">${ICON.close}</button>
        </div>
        <ul class="my-4 flex w-full flex-wrap gap-1.5 px-3 sm:hidden">
          ${createMobileMenuHTML()}
        </ul>
        ${authSection}
      </div>
    </nav>
  </header>`;
}

// ─── Mobile menu HTML builder ────────────────────────────────────

const MOBILE_BTN_DEFAULT = 'flex w-full items-center gap-x-3 rounded-xl px-4 py-2.5 text-left text-gray-300 transition-all duration-200 hover:bg-white/[0.06] hover:text-white';
const MOBILE_BTN_ACTIVE = 'flex w-full items-center gap-x-3 rounded-xl px-4 py-2.5 text-left bg-[#ae7aff]/10 text-[#ae7aff] font-medium';

function createMobileMenuHTML() {
  return MOBILE_MENU_ITEMS.map(item => {
    const idAttr = item.id ? ` id="${item.id}"` : '';
    return `<li${idAttr} class="w-full">
      <button class="${MOBILE_BTN_DEFAULT}">
        <span class="inline-block w-5 shrink-0">${ICON[item.icon]}</span>
        <span>${item.label}</span>
      </button>
    </li>`;
  }).join('');
}

// ─── Sidebar HTML builder ────────────────────────────────────────

function createSidebarHTML(activePage, expanded) {
  const lgExpanded = expanded ? ' lg:sticky lg:max-w-[220px]' : '';
  const textClass = expanded
    ? 'hidden sm:hidden sm:group-hover:inline lg:inline text-sm'
    : 'hidden sm:hidden sm:group-hover:inline text-sm';

  const items = SIDEBAR_ITEMS.map(item => {
    const isActive = activePage === item.key;
    const visibility = item.desktopOnly ? 'hidden sm:block' : '';
    const pushDown = item.pushDown ? ' mt-auto' : '';
    const liClass = `${visibility}${pushDown}`.trim();

    const btnClass = isActive
      ? 'sidebar-link-active'
      : 'sidebar-link';

    return `<li id="${item.id}" class="${liClass}">
      <button class="${btnClass}">
        <span class="inline-block w-5 shrink-0">${ICON[item.icon]}</span>
        <span class="${textClass}">${item.label}</span>
      </button>
    </li>`;
  }).join('');

  // Mobile bottom bar: show label only for active, icons smaller
  const mobileItems = SIDEBAR_ITEMS.filter(i => i.alwaysVisible).map(item => {
    const isActive = activePage === item.key;
    return `<li class="flex-1">
      <button class="flex flex-col items-center gap-0.5 w-full py-1.5 text-[10px] transition-colors duration-200 ${isActive ? 'text-[#ae7aff]' : 'text-gray-500 hover:text-gray-300'}">
        <span class="inline-block w-5">${ICON[item.icon]}</span>
        <span>${item.label.split(' ')[0]}</span>
      </button>
    </li>`;
  }).join('');

  return `<aside class="group fixed inset-x-0 bottom-0 z-40 w-full shrink-0 border-t border-white/[0.06] bg-[#0f0f0f]/95 backdrop-blur-md px-1 py-1 sm:absolute sm:inset-y-0 sm:bottom-auto sm:max-w-[70px] sm:border-r sm:border-t-0 sm:py-6 sm:hover:max-w-[220px] sm:sidebar-glass${lgExpanded}">
    <!-- Desktop sidebar -->
    <ul class="hidden sm:flex sm:sticky sm:top-[106px] sm:min-h-[calc(100vh-130px)] sm:flex-col gap-1 px-2">
      ${items}
    </ul>
    <!-- Mobile bottom bar -->
    <ul class="flex sm:hidden justify-around">
      ${mobileItems}
    </ul>
  </aside>`;
}

// ─── Main export ─────────────────────────────────────────────────

/**
 * Initialize the shared layout (header, sidebar, mobile menu).
 *
 * @param {string|null} activePage - Which sidebar item is active:
 *   'home' | 'liked' | 'history' | 'myContent' | 'collections' | 'subscribers' | null
 * @param {Object} options
 * @param {boolean} [options.expandedSidebar=true] - Expand sidebar on lg screens
 * @param {boolean} [options.showAuthButtons=true] - Show login/signup vs avatar in mobile menu
 */
export function initLayout(activePage, options = {}) {
  const { expandedSidebar = true, showAuthButtons = true } = options;

  // Inject shared styles
  injectSharedStyles();

  // Create #riju overlay div (for search backdrop)
  const riju = document.createElement('div');
  riju.id = 'riju';
  riju.className = 'absolute z-10 w-full transition-all duration-300';
  document.body.prepend(riju);

  // Find the main wrapper
  const wrapper = document.querySelector('[data-layout-wrapper]');
  if (!wrapper) {
    console.error('layout.js: Missing [data-layout-wrapper] element');
    return;
  }

  // Insert header at the start of the wrapper
  wrapper.insertAdjacentHTML('afterbegin', createHeaderHTML(showAuthButtons));

  // Find the flex content container and insert sidebar
  const content = wrapper.querySelector('[data-layout-content]');
  if (content) {
    content.insertAdjacentHTML('afterbegin', createSidebarHTML(activePage, expandedSidebar));
  }

  // Set active state for mobile menu items
  if (activePage) {
    const mobileKeyMap = { liked: 'sm_likedVidBtn', myContent: 'sm_myContentBtn' };
    const mobileActiveId = mobileKeyMap[activePage];
    if (mobileActiveId) {
      const mobileEl = document.getElementById(mobileActiveId);
      if (mobileEl) {
        const btn = mobileEl.querySelector('button');
        if (btn) {
          btn.className = MOBILE_BTN_ACTIVE;
        }
      }
    }
  }
}
