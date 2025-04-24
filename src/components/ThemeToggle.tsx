"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/Internal/Button";
import { useTranslation } from "react-i18next";

export function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Ensure component is mounted before rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
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

  return (
    <Button
      className="h-8 w-8"
      title={t("switchTheme")}
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}

export default ThemeToggle; 