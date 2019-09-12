import es from "./default.json";
import en from "./default.en.json";
import documentsEs from "../../components/Documents/locales/default.json";
import documentsEn from "../../components/Documents/locales/default.en.json";

es["es"].documents = documentsEs["es"];
en["en"].documents = documentsEn["en"];

export { es, en };
