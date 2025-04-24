"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useGlobalStore } from "@/store/global";
import { useSettingStore } from "@/store/setting";

const Header = dynamic(() => import("@/components/Header"));
const Topic = dynamic(() => import("@/components/Research/Topic"));
const Feedback = dynamic(() => import("@/components/Research/Feedback"));
const SearchResult = dynamic(
  () => import("@/components/Research/SearchResult")
);
const FinalReport = dynamic(() => import("@/components/Research/FinalReport"));
const PodcastScript = dynamic(() => import("@/components/Research/PodcastScript"));
const History = dynamic(() => import("@/components/History"));

function Home() {
  const globalStore = useGlobalStore();
  const settingStore = useSettingStore();
  const { setTheme } = useTheme();

  // Use effect instead of layoutEffect for better SSR compatibility
  useEffect(() => {
    const storedTheme = settingStore.theme;
    if (storedTheme && storedTheme !== 'system') {
      setTheme(storedTheme);
      
      // Force document class update for immediate visual feedback
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settingStore.theme, setTheme]);

  return (
    <div className="max-w-screen-md mx-auto px-4 pb-16">
      <Header />
      <main>
        <Topic />
        <Feedback />
        <SearchResult />
        <FinalReport />
        <PodcastScript />
      </main>
      <aside className="print:hidden">
        <History
          open={globalStore.openHistory}
          onClose={() => globalStore.setOpenHistory(false)}
        />
      </aside>
    </div>
  );
}

export default Home;
