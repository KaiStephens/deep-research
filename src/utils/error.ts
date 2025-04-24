// Helper functions for typeguarding
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

export function parseError(error: any): string {
  console.error("[CRITICAL] Error caught by parseError:", error);
  
  // Handle OpenRouter specific errors
  if (error?.name === "AI_APICallError") {
    console.error("[CRITICAL] AI_APICallError details:", JSON.stringify(error, null, 2));
    
    // Check for source from our enhanced error objects
    if (error.source === "openrouter_server_proxy") {
      return `Server API error (${error.status || 500}): ${error.message || "Unknown error"}`;
    }
    
    // Try to extract the actual error message
    if (error.message) {
      if (error.message.includes("No auth credentials found")) {
        return "Authentication error: OpenRouter API key is missing or invalid";
      }
      
      if (error.message.includes("401")) {
        return "Authentication error: OpenRouter API key is invalid or expired";
      }
      
      if (error.message.includes("429")) {
        return "Rate limit exceeded: Too many requests to OpenRouter API";
      }
      
      if (error.message.includes("500") || error.message.includes("502") || 
          error.message.includes("503") || error.message.includes("504")) {
        return "OpenRouter server error. Please try again later.";
      }
      
      // Try to parse JSON error messages - OpenRouter often returns JSON errors within message strings
      try {
        // Try as a direct JSON object first
        if (typeof error.message === 'object') {
          const jsonError = error.message;
          if (jsonError.error?.message) {
            return `API Error: ${jsonError.error.message}`;
          }
        }
        
        // Try to extract JSON from string
        const jsonMatch = error.message.match(/\{.*\}/);
        if (jsonMatch) {
          const jsonError = JSON.parse(jsonMatch[0]);
          if (jsonError.error?.message) {
            return `API Error: ${jsonError.error.message}`;
          }
          if (jsonError.message) {
            return `API Error: ${jsonError.message}`;
          }
        }
      } catch (_) {
        // Ignore JSON parsing errors
      }
      
      return `API Error: ${error.message}`;
    }
    
    // Fallback for AI_APICallError
    if (error.cause) {
      return `API Error (${error.cause.status || "unknown"}): ${error.cause.message || "Unknown error"}`;
    }
    
    return "OpenRouter API call failed. Please try again.";
  }
  
  if (error instanceof Error) {
    if (error.message === "NetworkError when attempting to fetch resource.") {
      return "Network error. Please check your connection.";
    }
    if (error.message.includes("CORS")) {
      return "CORS error: API access restricted by browser security policy";
    }
    return error.message;
  }
  
  // Handle string errors
  if (isString(error)) {
    return error;
  }
  
  // Handle object errors
  if (isObject(error)) {
    if ("message" in error && isString(error.message)) {
      return error.message;
    }
    if ("error" in error) {
      const errorProp = error.error;
      if (isString(errorProp)) {
        return errorProp;
      }
      if (isObject(errorProp) && "message" in errorProp && isString(errorProp.message)) {
        return errorProp.message;
      }
    }
    if ("status" in error && "statusText" in error && isString(error.statusText)) {
      return `HTTP Error ${error.status}: ${error.statusText}`;
    }
  }
  
  return "An unknown error occurred. Please check console for details.";
}
