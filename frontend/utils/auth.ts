export function isLoggedIn(): boolean {
  if (typeof window === "undefined") {
    return false; // Don't run on server side
  }
  const token = localStorage.getItem("token");
  // In a real app, you would also validate the token (e.g., check expiry)
  return !!token;
}
