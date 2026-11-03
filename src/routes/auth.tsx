import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { createLovableAuth } from '@lovable.dev/cloud-auth-js';
import { LOVABLE_SITE_ORIGIN } from '@/lib/asset-url';
import { accountHead, useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';

const OAUTH_FLAG = 'belvish-google-return';

export const Route = createFileRoute('/auth')({
  validateSearch: (search: Record<string, unknown>) => ({ signup: search['signup'] === true || search['signup'] === 'true' }),
  head: () => accountHead('Your account', 'Sign in or create your BELVISH customer account.'),
  component: AuthPage,
});

function AuthPage() {
  const { signup } = Route.useSearch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [forgot, setForgot] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('');
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');
    try {
      if (forgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        setMessage('If an account exists, a password reset link will arrive by email.');
      } else if (signup) {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { name: String(form.get('name') ?? '').trim() }, emailRedirectTo: window.location.origin } });
        if (error) throw error;
        setMessage('Check your email to confirm your account before signing in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await navigate({ to: '/account' });
      }
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Please try again.'); }
    finally { setBusy(false); }
  }
  async function google() {
    setBusy(true); setMessage('');
    sessionStorage.setItem(OAUTH_FLAG, '1');
    const redirect_uri = `${window.location.origin}/auth`;
    // Off Lovable hosting (e.g. Vercel) there is no /~oauth route, so start sign-in via the Lovable site.
    const result = LOVABLE_SITE_ORIGIN
      ? await createLovableAuth({ oauthBrokerUrl: `${LOVABLE_SITE_ORIGIN}/~oauth/initiate` }).signInWithOAuth('google', { redirect_uri })
      : await lovable.auth.signInWithOAuth('google', { redirect_uri });
    if (result.error) { sessionStorage.removeItem(OAUTH_FLAG); setMessage('Google sign-in didn’t complete. Please try again.'); setBusy(false); return; }
    if (result.redirected) return;
    if ('tokens' in result && result.tokens && LOVABLE_SITE_ORIGIN) await supabase.auth.setSession(result.tokens);
    sessionStorage.removeItem(OAUTH_FLAG);
    await navigate({ to: '/account' });
  }
  useEffect(() => {
    if (user && sessionStorage.getItem(OAUTH_FLAG)) { sessionStorage.removeItem(OAUTH_FLAG); void navigate({ to: '/account' }); }
  }, [user, navigate]);
  if (user && !forgot) return <main className="mx-auto max-w-md px-6 py-20"><h1 className="font-display text-4xl">Your account</h1><Button asChild className="mt-6"><Link to="/account">Open account</Link></Button></main>;
  return <main className="mx-auto max-w-md px-6 py-20">
    <h1 className="font-display text-4xl">{forgot ? 'Reset password' : signup ? 'Create your account' : 'Welcome back'}</h1>
    {!forgot && <>
      <Button type="button" variant="outline" disabled={busy} onClick={google} className="mt-8 w-full gap-3">
        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M21.35 11.1H12v2.9h5.35c-.23 1.5-1.7 4.4-5.35 4.4-3.22 0-5.85-2.67-5.85-5.95S8.78 6.5 12 6.5c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.68 3.95 14.55 3 12 3 6.98 3 3 7.03 3 12s3.98 9 9 9c5.2 0 8.64-3.65 8.64-8.8 0-.6-.07-1.05-.29-1.1Z" /></svg>
        Continue with Google
      </Button>
      <div className="mt-6 flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
    </>}
    <form onSubmit={submit} className="mt-6 space-y-5">
      {signup && !forgot && <label className="block text-sm">Name<input name="name" required maxLength={120} autoComplete="name" className="mt-2 w-full rounded-md border border-input bg-background p-3" /></label>}
      <label className="block text-sm">Email<input name="email" type="email" required autoComplete="email" className="mt-2 w-full rounded-md border border-input bg-background p-3" /></label>
      {!forgot && <label className="block text-sm">Password<input name="password" type="password" required minLength={8} autoComplete={signup ? 'new-password' : 'current-password'} className="mt-2 w-full rounded-md border border-input bg-background p-3" /></label>}
      <Button type="submit" disabled={busy} className="w-full">{busy ? 'Please wait…' : forgot ? 'Send reset link' : signup ? 'Sign up' : 'Login'}</Button>
      {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
    </form>
    <div className="mt-5 flex flex-wrap gap-3">
      <Button variant="link" asChild><Link to="/auth" search={{ signup: !signup }} onClick={() => { setForgot(false); setMessage(''); }}>{signup ? 'Login' : 'Sign up'}</Link></Button>
      <Button variant="link" onClick={() => { setForgot(!forgot); setMessage(''); }}>{forgot ? 'Back to login' : 'Forgot password?'}</Button>
    </div>
  </main>;
}