"use client";
import React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

// Simple wrapper around NextThemesProvider with sensible defaults
export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="deepPod-theme"
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
