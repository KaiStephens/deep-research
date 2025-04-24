// Debug route to check environment variables and configuration
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: Request) {
  // Get the host header
  const host = new Headers(req.headers).get("host") || "unknown";
  const isCloudflare = Boolean(
    process.env.CF_PAGES || 
    process.env.NEXT_RUNTIME === "edge" || 
    host === "deep.kaios.ca" || 
    host.includes("pages.dev")
  );
  
  // Safely get environment variables (mask API keys for security)
  const environmentInfo = {
    NODE_ENV: process.env.NODE_ENV || "not set",
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ? "***present***" : "***missing***",
    OPENROUTER_API_BASE_URL: process.env.OPENROUTER_API_BASE_URL || "default",
    RUNTIME: process.env.NEXT_RUNTIME || "not detected",
    IS_CLOUDFLARE: isCloudflare,
    CF_PAGES: Boolean(process.env.CF_PAGES),
    HOST: host,
    BUILD_ID: process.env.NEXT_PUBLIC_BUILD_ID || "not set",
    VERSION: process.env.NEXT_PUBLIC_VERSION || "not set",
  };

  // Include more details about the request
  const requestInfo = {
    url: req.url,
    method: req.method,
    headers: Object.fromEntries(
      Array.from(new Headers(req.headers).entries())
        .filter(([key]) => !key.includes("auth") && !key.includes("cookie") && !key.includes("authorization"))
    ),
  };

  return NextResponse.json({
    message: "Debug information",
    timestamp: new Date().toISOString(),
    environment: environmentInfo,
    request: requestInfo,
    cloudflareDetection: {
      byEnv: Boolean(process.env.CF_PAGES || process.env.NEXT_RUNTIME === "edge"),
      byHost: host === "deep.kaios.ca" || host.includes("pages.dev"),
      combined: isCloudflare
    }
  });
} 