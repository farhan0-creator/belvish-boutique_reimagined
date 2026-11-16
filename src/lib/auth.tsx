import { createContext, useContext } from 'react';
import type { User } from '@supabase/supabase-js';

export const AuthContext = createContext<{ user: User | null; recovery: boolean }>({ user: null, recovery: false });
export const useAuth = () => useContext(AuthContext);

export function accountHead(title: string, description: string) {
  return { meta: [{ title: `${title} · BELVISH` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} · BELVISH` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }, { name: 'robots', content: 'noindex, follow' }] };
}