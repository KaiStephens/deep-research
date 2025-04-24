import { create } from "zustand";
import { persist } from "zustand/middleware";

// Check if we're running in Cloudflare Pages with multiple detection methods
const isCloudflare = typeof window !== 'undefined' && (
  window.location.hostname.includes('pages.dev') || 
  window.location.hostname === 'deep.kaios.ca' ||
  // Additional tests that might help detect Cloudflare environment
  document.cookie.includes('__cf') || 
  navigator.userAgent.includes('Cloudflare')
);

// Force always log this on initialization
if (typeof window !== 'undefined') {
  console.log("[CRITICAL] store/setting - isCloudflare detection:", isCloudflare);
  console.log("[CRITICAL] store/setting - hostname:", window.location.hostname);
}

export interface SettingStore {
  provider: string;
  mode: string;
  apiKey: string;
  apiProxy: string;
  openRouterApiKey: string;
  openRouterApiProxy: string;
  openRouterThinkingModel: string;
  openRouterNetworkingModel: string;
  openAIApiKey: string;
  openAIApiProxy: string;
  openAIThinkingModel: string;
  openAINetworkingModel: string;
  anthropicApiKey: string;
  anthropicApiProxy: string;
  anthropicThinkingModel: string;
  anthropicNetworkingModel: string;
  deepseekApiKey: string;
  deepseekApiProxy: string;
  deepseekThinkingModel: string;
  deepseekNetworkingModel: string;
  xAIApiKey: string;
  xAIApiProxy: string;
  xAIThinkingModel: string;
  xAINetworkingModel: string;
  openAICompatibleApiKey: string;
  openAICompatibleApiProxy: string;
  openAICompatibleThinkingModel: string;
  openAICompatibleNetworkingModel: string;
  pollinationsApiProxy: string;
  pollinationsThinkingModel: string;
  pollinationsNetworkingModel: string;
  ollamaApiProxy: string;
  ollamaThinkingModel: string;
  ollamaNetworkingModel: string;
  accessPassword: string;
  thinkingModel: string;
  networkingModel: string;
  enableSearch: string;
  searchProvider: string;
  tavilyApiKey: string;
  tavilyApiProxy: string;
  firecrawlApiKey: string;
  firecrawlApiProxy: string;
  exaApiKey: string;
  exaApiProxy: string;
  bochaApiKey: string;
  bochaApiProxy: string;
  searxngApiProxy: string;
  parallelSearch: number;
  searchMaxResult: number;
  language: string;
  theme: string;
  debug: string;
}

interface SettingFunction {
  update: (values: Partial<SettingStore>) => void;
  reset: () => void;
}

export const defaultValues: SettingStore = {
  provider: isCloudflare ? "openrouter" : "openrouter",
  mode: isCloudflare ? "proxy" : "local",
  apiKey: process.env.OPENROUTER_API_KEY || "",
  apiProxy: "",
  thinkingModel: "microsoft/Mai-Ds-R1:free",
  networkingModel: "microsoft/Mai-Ds-R1:free",
  openRouterApiKey: process.env.OPENROUTER_API_KEY || "",
  openRouterApiProxy: "",
  openRouterThinkingModel: "microsoft/Mai-Ds-R1:free",
  openRouterNetworkingModel: "microsoft/Mai-Ds-R1:free",
  openAIApiKey: "",
  openAIApiProxy: "",
  openAIThinkingModel: "gpt-4o",
  openAINetworkingModel: "gpt-4o-mini",
  anthropicApiKey: "",
  anthropicApiProxy: "",
  anthropicThinkingModel: "",
  anthropicNetworkingModel: "",
  deepseekApiKey: "",
  deepseekApiProxy: "",
  deepseekThinkingModel: "deepseek-reasoner",
  deepseekNetworkingModel: "deepseek-chat",
  xAIApiKey: "",
  xAIApiProxy: "",
  xAIThinkingModel: "",
  xAINetworkingModel: "",
  openAICompatibleApiKey: "",
  openAICompatibleApiProxy: "",
  openAICompatibleThinkingModel: "",
  openAICompatibleNetworkingModel: "",
  pollinationsApiProxy: "",
  pollinationsThinkingModel: "",
  pollinationsNetworkingModel: "",
  ollamaApiProxy: "",
  ollamaThinkingModel: "",
  ollamaNetworkingModel: "",
  accessPassword: "",
  enableSearch: "1",
  searchProvider: "model",
  tavilyApiKey: "",
  tavilyApiProxy: "",
  firecrawlApiKey: "",
  firecrawlApiProxy: "",
  exaApiKey: "",
  exaApiProxy: "",
  bochaApiKey: "",
  bochaApiProxy: "",
  searxngApiProxy: "",
  parallelSearch: 1,
  searchMaxResult: 10,
  language: "en-US",
  theme: "system",
  debug: "disable",
};

// Ensure Cloudflare settings are enforced
if (isCloudflare || (typeof window !== 'undefined' && (window.location.hostname.includes('pages.dev') || window.location.hostname === 'deep.kaios.ca'))) {
  console.log("[CRITICAL] Setting default values for Cloudflare");
  defaultValues.mode = "proxy";
  defaultValues.provider = "openrouter";
}

export const useSettingStore = create(
  persist<SettingStore & SettingFunction>(
    (set) => ({
      ...defaultValues,
      update: (values) => {
        // Force proxy mode and openrouter provider if on Cloudflare
        const valuesToSet = { ...values };
        if (isCloudflare || (typeof window !== 'undefined' && (window.location.hostname.includes('pages.dev') || window.location.hostname === 'deep.kaios.ca'))) {
          if (valuesToSet.mode && valuesToSet.mode !== 'proxy') {
            console.log("[CRITICAL] Forcing proxy mode for Cloudflare");
            valuesToSet.mode = 'proxy';
          }
          if (valuesToSet.provider && valuesToSet.provider !== 'openrouter') {
            console.log("[CRITICAL] Forcing openrouter provider for Cloudflare");
            valuesToSet.provider = 'openrouter';
          }
        }
        set(valuesToSet);
      },
      reset: () => {
        // When resetting, ensure Cloudflare-specific settings are preserved
        if (isCloudflare || (typeof window !== 'undefined' && (window.location.hostname.includes('pages.dev') || window.location.hostname === 'deep.kaios.ca'))) {
          console.log("[CRITICAL] Reset called - enforcing Cloudflare settings");
          set({
            ...defaultValues,
            mode: 'proxy',
            provider: 'openrouter'
          });
        } else {
          set(defaultValues);
        }
      },
    }),
    { name: "setting" }
  )
);
