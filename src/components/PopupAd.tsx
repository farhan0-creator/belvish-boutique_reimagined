import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useStoreSettings } from "@/components/Shell";
import { safeAnnouncementHref } from "@/lib/store-settings.functions";

export type PopupContent = {
  title: string;
  text: string;
  imageSrc: string;
  buttonText: string;
  buttonLink: string;
};

/** Changes whenever the ad's content changes, so an edited ad is shown again. */
function adKey(c: PopupContent) {
  const s = [c.title, c.text, c.imageSrc.split("?")[0], c.buttonText, c.buttonLink].join("|");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return String(h);
}

export function PopupCard({ content, open, onOpenChange }: { content: PopupContent; open: boolean; onOpenChange: (o: boolean) => void }) {
  const href = safeAnnouncementHref(content.buttonLink);
  const external = !!href && !href.startsWith("/");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden rounded-[2rem] border-primary/40 p-0 sm:rounded-[2rem]">
        {content.imageSrc && <img src={content.imageSrc} alt="" className="max-h-[50vh] w-full object-cover" />}
        <div className="px-8 pb-8 pt-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent">OLFÉRA</p>
          <DialogTitle className="mt-3 font-display text-4xl font-light leading-tight">{content.title || " "}</DialogTitle>
          <DialogDescription className={`mt-3 text-sm leading-relaxed ${content.text ? "" : "sr-only"}`}>{content.text || "Special offer"}</DialogDescription>
          {href && content.buttonText && (
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              onClick={() => onOpenChange(false)}
              className="btn-gold mt-6 w-full"
            >
              {content.buttonText}
            </a>
          )}
          <button type="button" onClick={() => onOpenChange(false)} className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-8 hover:text-accent">
            No thanks
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Admin-managed pop-up ad shown to visitors after a short delay. Never shown during checkout. */
export function PopupAd() {
  const s = useStoreSettings();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [open, setOpen] = useState(false);
  const content: PopupContent = {
    title: s.popup_title,
    text: s.popup_text,
    imageSrc: s.popup_image_src,
    buttonText: s.popup_button_text,
    buttonLink: s.popup_button_link,
  };
  const hasContent = !!(content.title || content.text || content.imageSrc);
  const key = adKey(content);
  const blocked = path.startsWith("/checkout") || path.startsWith("/auth") || path.startsWith("/reset-password");

  useEffect(() => {
    if (!s.popup_enabled || !hasContent || blocked) return;
    const store = s.popup_frequency === "visit" ? sessionStorage : localStorage;
    if (store.getItem("belvish-popup-seen") === key) return;
    // Let the brand intro finish on a visitor's first page.
    const intro = sessionStorage.getItem("belvish-intro") ? 0 : 3200;
    const t = setTimeout(() => setOpen(true), Math.max(intro, s.popup_delay_seconds * 1000));
    return () => clearTimeout(t);
  }, [s.popup_enabled, s.popup_frequency, s.popup_delay_seconds, hasContent, blocked, key]);

  function change(o: boolean) {
    setOpen(o);
    if (!o) (s.popup_frequency === "visit" ? sessionStorage : localStorage).setItem("belvish-popup-seen", key);
  }

  if (!s.popup_enabled || !hasContent) return null;
  return <PopupCard content={content} open={open} onOpenChange={change} />;
}
