import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";
import locales from "@/constants/locales";
import { keys } from "radash";

i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend(async () => {
      return await import(`../locales/en-US.json`);
    })
  )
  .init({
    supportedLngs: keys(locales),
    fallbackLng: "en-US",
  });

export default i18next;
