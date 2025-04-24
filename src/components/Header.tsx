"use client";
import { useTranslation } from "react-i18next";
import { History } from "lucide-react";
import { Button } from "@/components/Internal/Button";
import { useGlobalStore } from "@/store/global";
import ThemeToggle from "@/components/ThemeToggle";

function Header() {
  const { t } = useTranslation();
  const { setOpenHistory } = useGlobalStore();

  return (
    <>
      <header className="flex justify-between items-center my-6 max-sm:my-4 print:hidden">
        <h1 className="text-left text-xl font-semibold">
          {t("title")}
          <small className="ml-2 font-normal text-base">made by: Kai Stephens</small>
        </h1>
        <div className="flex gap-1">
          <Button
            className="h-8 w-8"
            variant="ghost"
            size="icon"
            onClick={() => setOpenHistory(true)}
            title={t("research.history.title")}
          >
            <History className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </header>
    </>
  );
}

export default Header;
