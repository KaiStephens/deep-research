// Debug route to check environment variables and configuration
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  // Safely get environment variables (mask API keys for security)
  const environmentInfo = {
    NODE_ENV: process.env.NODE_ENV || "not set",
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ? "***set***" : "not set",
    OPENROUTER_API_BASE_URL: process.env.OPENROUTER_API_BASE_URL || "not set",
    RUNTIME: process.env.NEXT_RUNTIME || "not detected",
    IS_CLOUDFLARE: Boolean(process.env.CF_PAGES || process.env.NEXT_RUNTIME === "edge"),
    BUILD_ID: process.env.NEXT_PUBLIC_BUILD_ID || "not set",
    VERSION: process.env.NEXT_PUBLIC_VERSION || "not set",
  };

  return NextResponse.json({
    message: "Debug information",
    timestamp: new Date().toISOString(),
    environment: environmentInfo,
    headers: Object.fromEntries(
      Object.entries(Object.fromEntries(
        // @ts-ignore - headers is available in edge runtime
        new Headers(globalThis.request?.headers || {}).entries()
      )).filter(([key]) => !key.includes("auth") && !key.includes("cookie"))
    ),
  });
} 