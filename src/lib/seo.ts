// Preferred public domain for canonical URLs, sitemap and structured data.
export const SITE_URL = "https://belvish.vercel.app";
export const abs = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;
export const ogUrl = (path: string) => ({ property: "og:url", content: abs(path) });
export const canonicalLinks = (path: string) => [{ rel: "canonical", href: abs(path) }];
export const noindex = { name: "robots", content: "noindex, follow" };
