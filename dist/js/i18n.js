// i18n.js - Internationalization module for Panorama Beaka

let currentLang = 'en';
let translations = {};

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
      element.textContent = translation;
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

// Initialize translations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check for saved language preference or use default
  const savedLang = localStorage.getItem('preferredLanguage') || 'en';
  loadTranslations(savedLang);
});

// Function to change language
function changeLanguage(lang) {
  localStorage.setItem('preferredLanguage', lang);
  loadTranslations(lang);
}

// Export functions for use in other scripts
window.i18n = {
  loadTranslations,
  changeLanguage,
  getTranslation,
  getCurrentLang: () => currentLang
};
