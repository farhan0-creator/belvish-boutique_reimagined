import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type PopupFrequency = "once" | "visit";

export type StoreSettings = {
  announcement_enabled: boolean;
  announcement_text: string;
  announcement_link: string;
  promo_enabled: boolean;
  promo_text: string;
  promo_code: string;
  popup_enabled: boolean;
  popup_title: string;
  popup_text: string;
  /** Stored value: an https link or an uploaded file path like "popup-ads/abc.jpg". */
  popup_image_url: string;
  popup_button_text: string;
  popup_button_link: string;
  popup_delay_seconds: number;
  popup_frequency: PopupFrequency;
  /** Display-ready image address (uploaded files get a temporary signed link). */
  popup_image_src: string;
};

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  announcement_enabled: true,
  announcement_text: "Free delivery across India · Cash on Delivery available",
  announcement_link: "",
  promo_enabled: false,
  promo_text: "",
  promo_code: "",
  popup_enabled: false,
  popup_title: "",
  popup_text: "",
  popup_image_url: "",
  popup_button_text: "",
  popup_button_link: "",
  popup_delay_seconds: 3,
  popup_frequency: "once",
  popup_image_src: "",
};

export const POPUP_BUCKET = "popup-ads";
const STORAGE_PATH = /^popup-ads\/[A-Za-z0-9._-]{1,120}$/;

/** True for an uploaded pop-up image path ("popup-ads/<file>"). */
export function isPopupStoragePath(v: string): boolean {
  return STORAGE_PATH.test(v.trim());
}

/** Pop-up image may be empty, an https link, or an uploaded file path. */
export function isValidPopupImage(v: string): boolean {
  const s = v.trim();
  return s === "" || isPopupStoragePath(s) || /^https:\/\/\S+$/i.test(s);
}

/** Public read of the announcement bar, promo banner and pop-up ad. Never throws: falls back to defaults. */
export const getStoreSettings = createServerFn({ method: "GET" }).handler(async (): Promise<StoreSettings> => {
  try {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    const url = process.env["SUPABASE_URL"];
    if (!key || !url) return DEFAULT_STORE_SETTINGS;
    const supabase = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const { data, error } = await supabase
      .from("store_settings")
      .select("announcement_enabled, announcement_text, announcement_link, promo_enabled, promo_text, promo_code, popup_enabled, popup_title, popup_text, popup_image_url, popup_button_text, popup_button_link, popup_delay_seconds, popup_frequency")
      .eq("id", 1)
      .maybeSingle();
    if (error || !data) return DEFAULT_STORE_SETTINGS;

    let popup_image_src = /^https:\/\/\S+$/i.test(data.popup_image_url) ? data.popup_image_url : "";
    if (isPopupStoragePath(data.popup_image_url)) {
      try {
        // Private folder; a storage policy lets the public read only the live pop-up image,
        // so this works without the service key (e.g. on Vercel).
        const { data: signed } = await supabase.storage
          .from(POPUP_BUCKET)
          .createSignedUrl(data.popup_image_url.slice(POPUP_BUCKET.length + 1), 60 * 60 * 24);
        popup_image_src = signed?.signedUrl ?? "";
      } catch {
        popup_image_src = "";
      }
    }
    return {
      ...data,
      popup_frequency: data.popup_frequency === "visit" ? "visit" : "once",
      popup_image_src,
    };
  } catch {
    return DEFAULT_STORE_SETTINGS;
  }
});

/** Only same-site paths or https links are allowed for the announcement link. */
export function safeAnnouncementHref(link: string): string | null {
  const v = link.trim();
  if (!v) return null;
  if (v.startsWith("/") && !v.startsWith("//")) return v;
  if (/^https:\/\/[^\s]+$/i.test(v)) return v;
  return null;
}
