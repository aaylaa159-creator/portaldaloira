'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldLabel } from '@/components/admin/FieldLabel';
import { createClient } from '@/lib/supabase/client';

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError('E-mail ou senha incorretos.');
      setLoading(false);
      return;
    }

    const role = data.user?.app_metadata?.role;
    if (role !== 'admin' && role !== 'editor') {
      await supabase.auth.signOut();
      setError('Sem permissão para acessar o painel da redação.');
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div>
        <FieldLabel
          htmlFor="email"
          tooltip="E-mail da conta editorial cadastrada no Supabase com permissão de administrador ou editor."
          className="text-gray-700"
        >
          E-mail
        </FieldLabel>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
        />
      </div>
      <div>
        <FieldLabel
          htmlFor="password"
          tooltip="Senha da conta editorial. Apenas usuários com perfil admin ou editor conseguem acessar o painel."
          className="text-gray-700"
        >
          Senha
        </FieldLabel>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
        />
      </div>
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600/90 disabled:opacity-60"
      >
        {loading ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
