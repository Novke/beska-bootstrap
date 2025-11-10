// i18n.js - Internationalization module for Panorama Beska

let currentLang = 'en';
let translations = {};

// Get language from URL hash (#en, #sr, #ru) or localStorage
function getLanguageFromURL() {
  const hash = window.location.hash.substring(1); // Remove the #
  if (hash === 'en' || hash === 'sr' || hash === 'ru') {
    return hash;
  }
  return localStorage.getItem('preferredLanguage') || 'en';
}

// Update URL hash when language changes
function updateURLHash(lang) {
  window.location.hash = lang;
}

// Load translations from JSON file
async function loadTranslations(lang) {
  try {
    const response = await fetch(`lang/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${lang}`);
    }
    translations = await response.json();
    currentLang = lang;
    applyTranslations();
    updatePageTitle();
    updateLanguageSwitcher();
  } catch (error) {
    console.error('Error loading translations:', error);
  }
}

// Get nested translation value using dot notation (e.g., "hero.title")
function getTranslation(key) {
  const keys = key.split('.');
  let value = translations;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key; // Return key if translation not found
    }
  }

  return value;
}

// Apply translations to all elements with data-i18n attribute
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getTranslation(key);

    if (translation) {
      // Preserve HTML content like icons for verified badge and view all button
      if (element.querySelector('i.fab.fa-google')) {
        const icon = element.querySelector('i.fab.fa-google').cloneNode(true);
        element.textContent = ' ' + translation;
        element.prepend(icon);
      } else {
        element.textContent = translation;
      }
    }
  });

  // Update page title
  updatePageTitle();
}

// Update the page title
function updatePageTitle() {
  if (translations.meta && translations.meta.title) {
    document.title = translations.meta.title;
  }
}

// Update language switcher button to show current language
function updateLanguageSwitcher() {
  const currentLangBtn = document.getElementById('current-lang');
  if (currentLangBtn) {
    if (currentLang === 'en') {
      currentLangBtn.innerHTML = '<img src="https://flagcdn.com/w20/gb.png" alt="EN" class="flag-img"> EN';
    } else if (currentLang === 'sr') {
      currentLangBtn.innerHTML = '<img src="https://flagcdn.com/w20/rs.png" alt="SR" class="flag-img"> SR';
    } else if (currentLang === 'ru') {
      currentLangBtn.innerHTML = '<img src="https://flagcdn.com/w20/ru.png" alt="RU" class="flag-img"> RU';
    }
  }
}

// Initialize translations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const lang = getLanguageFromURL();
  loadTranslations(lang);

  // Listen for hash changes (when user clicks back/forward)
  window.addEventListener('hashchange', () => {
    const newLang = getLanguageFromURL();
    if (newLang !== currentLang) {
      loadTranslations(newLang);
    }
  });
});

// Function to change language
function changeLanguage(lang) {
  localStorage.setItem('preferredLanguage', lang);
  updateURLHash(lang);
  loadTranslations(lang);

  // Close dropdown after selection
  const dropdown = document.querySelector('.lang-dropdown');
  if (dropdown) {
    dropdown.classList.remove('show');
  }
}

// Export functions for use in other scripts
window.i18n = {
  loadTranslations,
  changeLanguage,
  getTranslation,
  getCurrentLang: () => currentLang
};
