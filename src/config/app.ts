/** Single configuration point for the app's public URL (used in share messages). */
export const APP_URL: string =
  (import.meta.env["VITE_APP_URL"] as string | undefined) ??
  "https://panda-collaboration-hub.lovable.app";

export const APP_TITLE = "CataPanda — Disaster Prep, Personalized";
