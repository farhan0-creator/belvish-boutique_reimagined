// Media pointers (`*.asset.json`) carry a relative `/__l5e/...` URL that only Lovable hosting serves.
// When the site is built on another host (e.g. Vercel), vite.config.ts injects the Lovable origin
// so photos and videos still load from Lovable's CDN.
declare const __ASSET_ORIGIN__: string;

const ORIGIN = typeof __ASSET_ORIGIN__ === "string" ? __ASSET_ORIGIN__.replace(/\/$/, "") : "";

export const assetUrl = (pointer: { url: string }) => `${ORIGIN}${pointer.url}`;

/** Lovable site origin when this build runs on another host (Vercel/Netlify); "" on Lovable hosting. */
export const LOVABLE_SITE_ORIGIN = ORIGIN;
