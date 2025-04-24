"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSettingStore } from "@/store/setting";

export function ThemeToggle() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const settingStore = useSettingStore();
  
  // Ensure component is mounted before rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Update store when theme changes and component is mounted
  useEffect(() => {
    if (mounted && resolvedTheme && settingStore.theme !== resolvedTheme) {
      try {
        settingStore.update({ theme: resolvedTheme });
      } catch (error) {
        console.error("Error updating theme in store:", error);
      }
    }
  }, [mounted, resolvedTheme, settingStore]);

  const toggleTheme = () => {
    if (!mounted) return;
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  // Don't try to render theme-dependent UI until hydrated
  if (!mounted) {
    return (
      <button 
        className="h-8 w-8 rounded-md inline-flex items-center justify-center"
        title={t("switchTheme")}
      >
        <div className="h-5 w-5" />
      </button>
    );
  }
  
  // Only show themed button after mounting to prevent hydration issues
  return (
    <button
      className="h-8 w-8 rounded-md inline-flex items-center justify-center hover:bg-accent"
      title={t("switchTheme")}
      onClick={toggleTheme}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}

export default ThemeToggle; 