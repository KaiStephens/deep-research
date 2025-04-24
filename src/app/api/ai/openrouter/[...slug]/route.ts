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
  
  let body;
  if (req.method.toUpperCase() !== "GET") {
    body = await req.json();
  }
  const searchParams = req.nextUrl.searchParams;
  const path = searchParams.getAll("slug");
  searchParams.delete("slug");
  const params = searchParams.toString();

  try {
    let url = `${API_PROXY_BASE_URL}/api/${decodeURIComponent(path.join("/"))}`;
    if (params) url += `?${params}`;
    console.log("[CRITICAL] OpenRouter forwarding to:", url);
    
    // Check if Authorization header exists
    const authHeader = req.headers.get("Authorization") || "";
    console.log("[CRITICAL] Auth header present:", !!authHeader);
    
    const payload: RequestInit = {
      method: req.method,
      headers: {
        "Content-Type": req.headers.get("Content-Type") || "application/json",
        Authorization: authHeader,
      },
    };
    if (body) payload.body = JSON.stringify(body);
    
    console.log("[CRITICAL] Sending request to OpenRouter API");
    const response = await fetch(url, payload);
    
    // Debug response info
    console.log("[CRITICAL] OpenRouter response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[CRITICAL] OpenRouter API error:", response.status, errorText);
      return NextResponse.json(
        { code: response.status, message: errorText },
        { status: response.status }
      );
    }
    
    return new NextResponse(response.body, response);
  } catch (error) {
    console.error("[CRITICAL] OpenRouter handler critical error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { code: 500, message: error.message },
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
