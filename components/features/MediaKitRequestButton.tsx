'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { submitMediaKitLead } from '@/lib/actions/media-kit';
import {
  maskBrazilPhone,
  maskCompanyName,
  maskEmailInput,
  maskMessageInput,
  maskPersonName,
} from '@/lib/input-masks';

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600';

export function MediaKitRequestButton() {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const close = useCallback(() => {
    setOpen(false);
    setError(null);
    setSuccess(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close();
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  function resetForm() {
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setMessage('');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await submitMediaKitLead({
      name,
      company,
      email,
      phone,
      message,
      website: String(formData.get('website') ?? ''),
    });

    setLoading(false);

    if ('error' in result) {
      setError(result.error);
      return;
    }

    resetForm();
    setSuccess(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSuccess(false);
          setError(null);
          setOpen(true);
        }}
        className="rounded-full bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-700"
      >
        Solicitar mídia kit
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          role="presentation"
        >
          <button
            type="button"
            aria-label="Fechar"
            className="absolute inset-0 bg-brand-950/60 backdrop-blur-[2px]"
            onClick={close}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${formId}-title`}
            className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-brand-100 bg-white p-6 shadow-xl"
          >
            {success ? (
              <div className="text-center">
                <p className="font-display text-xl font-bold text-brand-900">
                  Solicitação enviada!
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Nossa equipe comercial recebeu seus dados e entrará em contato em
                  breve com o mídia kit.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-6 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <>
                <h2
                  id={`${formId}-title`}
                  className="font-display text-xl font-bold text-brand-900"
                >
                  Solicitar mídia kit
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Preencha o formulário. Nossa equipe comercial retorna com o material.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="pointer-events-none absolute h-0 w-0 opacity-0"
                  />

                  <div>
                    <label htmlFor={`${formId}-name`} className="mb-1 block text-sm font-medium text-gray-700">
                      Nome *
                    </label>
                    <input
                      id={`${formId}-name`}
                      type="text"
                      required
                      inputMode="text"
                      autoComplete="name"
                      placeholder="Ex.: Maria Silva"
                      maxLength={120}
                      value={name}
                      onChange={(e) => setName(maskPersonName(e.target.value))}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor={`${formId}-company`} className="mb-1 block text-sm font-medium text-gray-700">
                      Empresa *
                    </label>
                    <input
                      id={`${formId}-company`}
                      type="text"
                      required
                      inputMode="text"
                      autoComplete="organization"
                      placeholder="Ex.: Loja Exemplo Ltda."
                      maxLength={160}
                      value={company}
                      onChange={(e) => setCompany(maskCompanyName(e.target.value))}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor={`${formId}-email`} className="mb-1 block text-sm font-medium text-gray-700">
                      E-mail *
                    </label>
                    <input
                      id={`${formId}-email`}
                      type="email"
                      required
                      inputMode="email"
                      maxLength={254}
                      autoComplete="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(maskEmailInput(e.target.value))}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor={`${formId}-phone`} className="mb-1 block text-sm font-medium text-gray-700">
                      Telefone / WhatsApp
                    </label>
                    <input
                      id={`${formId}-phone`}
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="(67) 99999-9999"
                      maxLength={16}
                      value={phone}
                      onChange={(e) => setPhone(maskBrazilPhone(e.target.value))}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor={`${formId}-message`} className="mb-1 block text-sm font-medium text-gray-700">
                      Mensagem
                    </label>
                    <textarea
                      id={`${formId}-message`}
                      rows={3}
                      maxLength={2000}
                      value={message}
                      onChange={(e) => setMessage(maskMessageInput(e.target.value))}
                      placeholder="Conte brevemente sobre a campanha ou dúvida."
                      className={inputClass}
                    />
                    <p className="mt-1 text-right text-xs text-gray-400">
                      {message.length}/2000
                    </p>
                  </div>

                  {error ? (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                      {error}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 rounded-full bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-700 disabled:opacity-60"
                    >
                      {loading ? 'Enviando…' : 'Enviar solicitação'}
                    </button>
                    <button
                      type="button"
                      onClick={close}
                      className="rounded-full border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
