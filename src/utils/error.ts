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
    console.error("[CRITICAL] AI_APICallError details:", JSON.stringify(error));
    
    // Try to extract the actual error message
    if (error.message) {
      if (error.message.includes("No auth credentials found")) {
        return "Authentication error: Please check your OpenRouter API key";
      }
      
      // Try to parse JSON error messages
      try {
        const jsonMatch = error.message.match(/\{.*\}/);
        if (jsonMatch) {
          const jsonError = JSON.parse(jsonMatch[0]);
          if (jsonError.error?.message) {
            return `API Error: ${jsonError.error.message}`;
          }
        }
      } catch (_) {
        // Ignore JSON parsing errors
      }
      
      return `API Error: ${error.message}`;
    }
    
    return "AI API call failed. Please try again.";
  }
  
  if (error instanceof Error) {
    if (error.message === "NetworkError when attempting to fetch resource.") {
      return "Network error. Please check your connection.";
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
  }
  
  return "An unknown error occurred";
}
