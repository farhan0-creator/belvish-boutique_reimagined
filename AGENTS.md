<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Catalog data is static in `src/lib/catalog.ts`; the bag is browser-local. Checkout is Cash on Delivery: `placeCodOrder` (src/lib/orders.functions.ts) re-prices lines server-side via `order-pricing.ts` and inserts into `public.orders` (anon INSERT-only RLS, no public reads) — never trust client totals.
- Images and videos use `.asset.json` pointers owned by this project; pointers copied from another project do not resolve, so re-upload media instead of copying pointers. Always read pointer URLs through `assetUrl()` (src/lib/asset-url.ts): builds on non-Lovable hosts (Vercel/Netlify, or `ASSET_ORIGIN`) get the Lovable origin injected by vite.config.ts, because only Lovable hosting serves `/__l5e/` paths.
- Contact details live only in `src/lib/contact.ts`; import from there instead of hardcoding.
- Order tracking uses the SECURITY DEFINER RPC `track_order(order_number, phone)` so orders stay unreadable to the public; newsletter signups are anon INSERT-only.
- Accounts use Cloud Auth with one root session subscriber; protected pages live under the managed `_authenticated` layout. Profile ownership and separate immutable-to-customers role records are enforced by RLS, so browser state cannot grant privileges.
- `orders.user_id` is a plain UUID (no FK to auth.users) so guest orders and future imported records stay valid.
- Admin server functions (`src/lib/admin.functions.ts`) use `requireSupabaseAuth`, then check the designated email claim plus `has_role` before loading the service-role client inside the handler; the browser never decides admin access.
- Announcement bar and promo banner come from the single-row `store_settings` table (public read, backend-only write), loaded by the root route loader so they render server-side; read them via `useStoreSettings()`.
- The scroll fade-in only marks elements React has already hydrated, using a `data-reveal` attribute, so it never causes hydration mismatches.
- Off-Lovable builds (Vercel/Netlify): server.ts falls back to the VITE_ publishable Supabase values, Google sign-in starts via the Lovable site's /~oauth broker, and the admin dashboard links to the Lovable site — those hosts lack Lovable's proxy and the service-role key.
