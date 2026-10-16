/** Single configuration point for the app's public URL (used in share messages). */
export const APP_URL: string =
  (import.meta.env.VITE_APP_URL as string | undefined) ??
  "https://id-preview--00980169-a2d4-4948-8a7c-6c2988ef8a96.lovable.app";

export const APP_TITLE = "CataPanda — Disaster Prep, Personalized";
