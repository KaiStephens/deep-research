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
  console.error("WARNING: OPENROUTER_API_KEY environment variable is not set. Requests will fail!");
}

async function handler(req: NextRequest) {
  // Explicit debug logging for request
  console.log("[CRITICAL] OpenRouter route handler called, API KEY EXISTS:", !!OPENROUTER_API_KEY);
  console.log("[CRITICAL] Request URL:", req.url);
  console.log("[CRITICAL] Request method:", req.method);
  
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
    
    // DIRECT FIX: Always use the server API key directly rather than relying on the request header
    // This bypasses any client-side authentication issues
    if (!OPENROUTER_API_KEY) {
      console.error("[CRITICAL] OPENROUTER_API_KEY is not set in environment variables!");
      return NextResponse.json(
        { error: "No API key configured on server" },
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
    headers.set("HTTP-Referer", "https://deep-research.pages.dev/");
    
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
      let errorText = await response.text();
      try {
        // Try to parse error as JSON for better error reporting
        const errorJson = JSON.parse(errorText);
        console.error("[CRITICAL] OpenRouter API error (JSON):", response.status, JSON.stringify(errorJson));
        return NextResponse.json(errorJson, { status: response.status });
      } catch (e) {
        // Fallback to raw error text
        console.error("[CRITICAL] OpenRouter API error (text):", response.status, errorText);
        return NextResponse.json(
          { code: response.status, message: errorText },
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
        { code: 500, message: error.message, stack: error.stack },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { code: 500, message: "Unknown error in OpenRouter API route" },
      { status: 500 }
    );
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
