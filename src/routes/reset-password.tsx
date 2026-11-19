import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { accountHead, useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/reset-password')({ head: () => accountHead('Reset password', 'Set a new password for your OLFÉRA account.'), component: ResetPassword });
function ResetPassword() {
  const { recovery } = useAuth();
  const [hashRecovery, setHashRecovery] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { setHashRecovery(new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery'); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('');
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password') ?? '');
    try {
      if (!recovery && !hashRecovery) throw new Error('Open the reset link from your email.');
      if (password !== form.get('confirm')) throw new Error('Passwords do not match.');
      const { data, error: userError } = await supabase.auth.getUser();
      if (userError || !data.user) throw new Error('This reset link has expired. Request a new one.');
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage('Your password has been updated.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Please try again.'); }
    finally { setBusy(false); }
  }
  return <main className="mx-auto max-w-md px-6 py-20"><h1 className="font-display text-4xl">Set a new password</h1>
    {recovery || hashRecovery ? <form className="mt-8 space-y-5" onSubmit={submit}>
      <label className="block text-sm">New password<input name="password" required type="password" minLength={8} autoComplete="new-password" className="mt-2 w-full rounded-md border border-input bg-background p-3" /></label>
      <label className="block text-sm">Confirm password<input name="confirm" required type="password" minLength={8} autoComplete="new-password" className="mt-2 w-full rounded-md border border-input bg-background p-3" /></label>
      <Button disabled={busy} type="submit">{busy ? 'Please wait…' : 'Update password'}</Button>
    </form> : <p className="mt-6 text-muted-foreground">Open the password reset link from your email.</p>}
    {message && <p role="status" className="mt-4 text-sm">{message}</p>}
    <Button asChild variant="link" className="mt-5"><Link to="/auth" search={{ signup: false }}>Back to login</Link></Button>
  </main>;
}