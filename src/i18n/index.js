import i18n from "i18next";
import { es, en } from "./locales/index.js";

i18n.init({
  interpolation: {
    escapeValue: false
  },

  debug: true,

  lng: "es",

  resources: {
    es: {
      common: es.es
    },
    en: {
      common: en.en
    }
  },

  fallbackLng: "en",

  ns: ["common"],

  defaultNS: "common",
  react: {
    wait: false,
    bindI18n: "languageChanged loaded",
    bindStore: "added removed",
    nsMode: "default",
    useSuspense: false
  }
});

export default i18n;
