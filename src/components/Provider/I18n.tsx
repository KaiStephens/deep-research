"use client";
import { useLayoutEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { useSettingStore } from "@/store/setting";
import i18n from "@/utils/i18n";

function I18Provider({ children }: { children: React.ReactNode }) {
  const { language } = useSettingStore();

  useLayoutEffect(() => {
    const settingStore = useSettingStore.getState();
    // Always use English
    settingStore.update({ language: "en-US" });
    i18n.changeLanguage("en-US");
    document.documentElement.setAttribute("lang", "en-US");
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

export default I18Provider;
