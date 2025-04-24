"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/Internal/Button";
import { useTranslation } from "react-i18next";
import { useSettingStore } from "@/store/setting";

export function ThemeToggle() {
  const { t } = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const settingStore = useSettingStore();
  
  // Ensure component is mounted before rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Save theme changes to store after component is mounted
  useEffect(() => {
    if (mounted && resolvedTheme) {
      try {
        settingStore.update({ theme: resolvedTheme });
      } catch (error) {
        console.error("Error updating theme in store:", error);
      }
    }
  }, [mounted, resolvedTheme, settingStore]);

  const toggleTheme = () => {
    try {
      const currentTheme = resolvedTheme || 'light';
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
      
      // Try to update store
      try {
        settingStore.update({ theme: newTheme });
      } catch (e) {
        console.error("Failed to update theme in store", e);
      }
    } catch (error) {
      console.error("Error toggling theme:", error);
    }
  };

  // Use a placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button
        className="h-8 w-8"
        title={t("switchTheme")}
        variant="ghost"
        size="icon"
      >
        <div className="h-5 w-5" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      className="h-8 w-8"
      title={t("switchTheme")}
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}

export default ThemeToggle; 