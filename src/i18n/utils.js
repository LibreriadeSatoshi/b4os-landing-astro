// Importar los archivos JSON generados por Lingo.dev
import es from '../../i18n/es.json';
import en from '../../i18n/en.json';
import pt from '../../i18n/pt.json';
import ca from '../../i18n/ca.json';

const translations = { es, en, pt, ca };
const defaultLocale = 'es';

/**
 * Obtiene el objeto completo de traducciones para un idioma
 * @param {string} lang - Código del idioma (es, en, pt, ca)
 * @returns {object} Objeto con todas las traducciones
 */
export function getTranslation(lang = defaultLocale) {
  return translations[lang] || translations[defaultLocale];
}

/**
 * Obtiene una traducción específica usando notación de puntos
 * @param {string} key - Clave de traducción (ej: 'nav.home', 'hero.title')
 * @param {string} lang - Código del idioma
 * @returns {string} Texto traducido
 */
export function t(key, lang = defaultLocale) {
  const translation = getTranslation(lang);
  return key.split('.').reduce((obj, k) => obj?.[k], translation) || key;
}

/**
 * Lista de idiomas disponibles con metadatos
 */
export const locales = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ca', name: 'Català', flag: '🇪🇸' } // Catalán, usando la bandera española por simplicidad
];

/**
 * Obtiene la URL para cambiar de idioma
 * @param {string} targetLocale - Idioma destino
 * @param {string} currentPath - Ruta actual
 * @returns {string} URL para el idioma destino
 */
export function getLocalizedPath(targetLocale, currentPath = '/') {
  // Remover prefijo de idioma actual si existe
  const cleanPath = currentPath.replace(/^\/(en|pt|ca)/, '') || '/';

  // Añadir prefijo del idioma destino (excepto español)
  if (targetLocale === 'es') {
    return cleanPath;
  }
  
  return `/${targetLocale}${cleanPath}`;
}

/**
 * Genera URL para páginas especiales (como términos) basada en el idioma
 * @param {string} page - Nombre de la página (ej: 'terminos')
 * @param {string} lang - Código del idioma
 * @returns {string} URL localizada
 */
export function getLocalizedPageUrl(page, lang = defaultLocale) {
  if (lang === 'es') {
    return `/${page}`;
  }
  return `/${page}/${lang}`;
}
// Rutas legales de ismos.xyz por idioma. ES y CA usan la versión en inglés
// hasta tener sus rutas en español.
const ismosLegalPaths = {
  en: { privacy: 'en/privacy', terms: 'en/terms', 'code-of-conduct': 'en/code-of-conduct' },
  pt: { privacy: 'pt/privacidade', terms: 'pt/termos', 'code-of-conduct': 'pt/codigo-de-conduta' }
};

/**
 * URL de las páginas legales de ISMOS (privacidad, términos, código de conducta)
 * @param {'privacy' | 'terms' | 'code-of-conduct'} page
 * @param {string} lang - Código del idioma
 * @returns {string} URL en ismos.xyz
 */
export function getIsmosLegalUrl(page, lang = defaultLocale) {
  const paths = ismosLegalPaths[lang] || ismosLegalPaths.en;
  return `https://ismos.xyz/${paths[page]}`;
}

/**
 * URL de los cursos de ISMOS según el idioma (ES y CA comparten la versión en español)
 * @param {string} lang - Código del idioma
 * @returns {string} URL en ismos.xyz
 */
export function getIsmosCoursesUrl(lang = defaultLocale) {
  const urls = {
    en: 'https://ismos.xyz/en/courses/',
    pt: 'https://ismos.xyz/pt/cursos/'
  };
  return urls[lang] || 'https://ismos.xyz/cursos/';
}
