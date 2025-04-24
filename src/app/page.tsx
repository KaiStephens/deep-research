"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useGlobalStore } from "@/store/global";
import { useSettingStore } from "@/store/setting";

const Header = dynamic(() => import("@/components/Header"), { ssr: true });
const Topic = dynamic(() => import("@/components/Research/Topic"), { ssr: false });
const Feedback = dynamic(() => import("@/components/Research/Feedback"), { ssr: false });
const SearchResult = dynamic(
  () => import("@/components/Research/SearchResult"),
  { ssr: false }
);
const FinalReport = dynamic(() => import("@/components/Research/FinalReport"), { ssr: false });
const PodcastScript = dynamic(() => import("@/components/Research/PodcastScript"), { ssr: false });
const History = dynamic(() => import("@/components/History"), { ssr: false });

function Home() {
  const [mounted, setMounted] = useState(false);
  const globalStore = useGlobalStore();
  const settingStore = useSettingStore();
  const { setTheme } = useTheme();

  // Use effect for initialization
  useEffect(() => {
    setMounted(true);
    
    try {
      // Apply stored theme if available
      const storedTheme = settingStore.theme;
      if (storedTheme && storedTheme !== 'system') {
        setTheme(storedTheme);
      }
    } catch (error) {
      console.error("Error initializing theme:", error);
    }
  }, [setTheme, settingStore.theme]);

  // Don't render main content until after first mount to avoid hydration issues
  if (!mounted) {
    return <div className="max-w-screen-md mx-auto px-4 pb-16">
      <Header />
      <div className="min-h-screen"></div>
    </div>;
  }

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
