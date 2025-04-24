"use client";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/Internal/Button";
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
  
  // Update store only when theme changes and component is mounted
  useEffect(() => {
    if (mounted && resolvedTheme) {
      try {
        // Only update if the theme in the store doesn't match the resolved theme
        if (settingStore.theme !== resolvedTheme) {
          settingStore.update({ theme: resolvedTheme });
        }
      } catch (error) {
        console.error("Error updating theme in store:", error);
      }
    }
  }, [resolvedTheme, settingStore, mounted]);

  // Memoize the toggle function to prevent recreation on each render
  const toggleTheme = useCallback(() => {
    try {
      const currentTheme = resolvedTheme || 'light';
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    } catch (error) {
      console.error("Error toggling theme:", error);
    }
  }, [resolvedTheme, setTheme]);

  // Don't access theme for rendering until after client-side hydration is complete
  if (!mounted) {
    // Render static placeholder button identical on server and client
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