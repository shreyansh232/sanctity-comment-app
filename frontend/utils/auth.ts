interface JwtPayload {
    id: number;
    username: string;
  }
  
export function isLoggedIn(): boolean {
  if (typeof window === "undefined") {
    return false; // Don't run on server side
  }
  const token = localStorage.getItem("token");
  // In a real app, you would also validate the token (e.g., check expiry)
  return !!token;
}

  export function decodeJwtToken(token: string): JwtPayload | null {
    try {
    const parts = token.split(".");
      if (parts.length !== 3) {
        console.error("Invalid JWT token format");
        return null;
      }
  
      const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/")); // Base64Url decode
      return JSON.parse(decodedPayload) as JwtPayload;
    } catch (error) {
      console.error("Error decoding JWT token:", error);
      return null;
    }
  }
