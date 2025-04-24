"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/Internal/Button";
import { useTranslation } from "react-i18next";
import { useSettingStore } from "@/store/setting";

export function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const settingStore = useSettingStore();
  
  // Ensure component is mounted before rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Make sure theme changes are saved to the store
  useEffect(() => {
    if (mounted && theme) {
      settingStore.update({ theme: theme });
    }
  }, [mounted, theme, settingStore]);

  const toggleTheme = () => {
    // Use resolvedTheme to get the actual current theme (accounting for system preference)
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    settingStore.update({ theme: newTheme });
    
    // Force document class update for immediate visual feedback
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Don't render anything until mounted to prevent hydration mismatch
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

  // Use resolvedTheme rather than theme to account for system preference
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