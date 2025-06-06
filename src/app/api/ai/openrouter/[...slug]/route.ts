import { NextResponse, type NextRequest } from "next/server";
import { OPENROUTER_BASE_URL } from "@/constants/urls";

export const runtime = "edge";
export const preferredRegion = [
  "cle1",
  "iad1",
  "pdx1",
  "sfo1",
  "sin1",
  "syd1",
  "hnd1",
  "kix1",
];

const API_PROXY_BASE_URL =
  process.env.OPENROUTER_API_BASE_URL || OPENROUTER_BASE_URL;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Log warning if OpenRouter API key is missing
if (!OPENROUTER_API_KEY) {
  console.error("CRITICAL ERROR: OPENROUTER_API_KEY environment variable is not set. Requests will fail!");
}

async function handler(req: NextRequest) {
  // Explicit debug logging for request
  console.log("[CRITICAL] OpenRouter route handler called, API KEY EXISTS:", !!OPENROUTER_API_KEY);
  console.log("[CRITICAL] Request URL:", req.url);
  console.log("[CRITICAL] Request method:", req.method);
  
  // Get host for HTTP-Referer
  const host = req.headers.get("host") || "deep-research.pages.dev";
  const protocol = host.includes("localhost") ? "http" : "https";
  const refererUrl = `${protocol}://${host}/`;
  console.log("[CRITICAL] Using referer:", refererUrl);
  
  let body;
  let parsedBody: any = {};
  
  if (req.method.toUpperCase() !== "GET") {
    try {
      const bodyText = await req.text();
      console.log("[CRITICAL] Raw request body:", bodyText.substring(0, 200) + (bodyText.length > 200 ? "..." : ""));
      
      try {
        body = JSON.parse(bodyText);
        parsedBody = body;
        console.log("[CRITICAL] Request body parsed successfully");
      } catch (parseError) {
        console.error("[CRITICAL] Error parsing JSON body:", parseError);
        body = bodyText; // Keep the raw text as fallback
      }
    } catch (e) {
      console.error("[CRITICAL] Error reading request body:", e);
    }
  }
  
  const searchParams = req.nextUrl.searchParams;
  const path = searchParams.getAll("slug");
  searchParams.delete("slug");
  const params = searchParams.toString();

  try {
    let url = `${API_PROXY_BASE_URL}/api/${decodeURIComponent(path.join("/"))}`;
    if (params) url += `?${params}`;
    console.log("[CRITICAL] OpenRouter forwarding to:", url);
    
    // CRITICAL CHECK: Ensure the API key is available
    if (!OPENROUTER_API_KEY) {
      console.error("[CRITICAL] OPENROUTER_API_KEY is not set in environment variables!");
      return NextResponse.json(
        { error: "Server configuration error: No API key available" },
        { status: 500 }
      );
    }
    
    // Create proper headers for OpenRouter
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${OPENROUTER_API_KEY}`);
    
    // Copy any other relevant headers from the request
    const headersToCopy = ["Accept", "Accept-Encoding", "User-Agent"];
    for (const header of headersToCopy) {
      const value = req.headers.get(header);
      if (value) headers.set(header, value);
    }
    
    // Set up specific OpenRouter headers for handling
    if (parsedBody?.model) {
      console.log("[CRITICAL] Model requested:", parsedBody.model);
    }
    
    // Add HTTP-Referer header for OpenRouter (required)
    // Use the current host instead of a hardcoded value
    headers.set("HTTP-Referer", refererUrl);
    
    // Add X-Title header for OpenRouter
    headers.set("X-Title", "Deep Research");
    
    const payload: RequestInit = {
      method: req.method,
      headers: headers,
    };
    
    if (body) {
      // Ensure the body is stringified JSON if it's not already
      payload.body = typeof body === "string" ? body : JSON.stringify(body);
    }
    
    console.log("[CRITICAL] Sending request to OpenRouter API with direct server key");
    console.log("[CRITICAL] Request headers:", Object.fromEntries(headers.entries()));
    
    const response = await fetch(url, payload);
    
    // Debug response info
    console.log("[CRITICAL] OpenRouter response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      try {
        // Try to parse error as JSON for better reporting
        const errorJson = JSON.parse(errorText);
        console.error("[CRITICAL] OpenRouter API error (JSON):", response.status, JSON.stringify(errorJson));
        
        // Add explicit error classification to help client-side debugging
        const enhancedErrorJson = {
          ...errorJson,
          source: "openrouter_server_proxy", 
          status: response.status,
          timestamp: new Date().toISOString()
        };
        
        return NextResponse.json(enhancedErrorJson, { status: response.status });
      } catch (_) {
        // Fallback to raw error text
        console.error("[CRITICAL] OpenRouter API error (text):", response.status, errorText);
        return NextResponse.json(
          { 
            code: response.status, 
            message: errorText,
            source: "openrouter_server_proxy",
            timestamp: new Date().toISOString()
          },
          { status: response.status }
        );
      }
    }
    
    // Clone headers from the response
    const responseHeaders = new Headers(response.headers);
    
    // Return full response with all headers
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    console.error("[CRITICAL] OpenRouter handler critical error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          code: 500, 
          message: error.message, 
          stack: error.stack,
          source: "openrouter_server_proxy",
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { 
        code: 500, 
        message: "Unknown error in OpenRouter API route",
        source: "openrouter_server_proxy",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
