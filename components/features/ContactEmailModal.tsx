'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { submitContactMessage } from '@/lib/actions/contact-message';
import {
  maskBrazilPhone,
  maskEmailInput,
  maskMessageInput,
  maskPersonName,
  maskSubjectInput,
} from '@/lib/input-masks';
import type { ContactMessageChannel } from '@/lib/types/contact-message';

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600';

const COPY: Record<
  ContactMessageChannel,
  {
    email: string;
    title: string;
    description: string;
    successTitle: string;
    successBody: string;
    submitLabel: string;
  }
> = {
  redacao: {
    email: 'redacao@portaldaloira.com.br',
    title: 'Fale com a redação',
    description:
      'Envie pautas, denúncias, releases ou pedidos de correção. Responderemos pelo e-mail informado.',
    successTitle: 'Mensagem enviada!',
    successBody:
      'A redação recebeu sua mensagem e retornará em breve, no horário comercial.',
    submitLabel: 'Enviar mensagem',
  },
  comercial: {
    email: 'comercial@portaldaloira.com.br',
    title: 'Fale com o comercial',
    description:
      'Solicite valores, períodos de campanha ou tire dúvidas sobre anunciar no portal.',
    successTitle: 'Mensagem enviada!',
    successBody:
      'Nossa equipe comercial recebeu sua mensagem e entrará em contato em breve.',
    submitLabel: 'Enviar mensagem',
  },
};

interface ContactEmailModalProps {
  channel: ContactMessageChannel;
}

export function ContactEmailModal({ channel }: ContactEmailModalProps) {
  const copy = COPY[channel];
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
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
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  }

  function openModal() {
    setSuccess(false);
    setError(null);
    setOpen(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await submitContactMessage({
      channel,
      name,
      email,
      phone,
      subject,
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
        onClick={openModal}
        className="font-semibold text-brand-700 no-underline hover:text-accent-600"
      >
        {copy.email}
      </button>

      {open && typeof document !== 'undefined'
        ? createPortal(
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
                      {copy.successTitle}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">{copy.successBody}</p>
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
                    <p
                      id={`${formId}-title`}
                      className="font-display text-xl font-bold text-brand-900"
                    >
                      {copy.title}
                    </p>
                <p className="mt-1 text-sm text-gray-500">{copy.description}</p>
                <p className="mt-2 text-xs text-gray-400">
                  Destino: {copy.email}
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
                    <label
                      htmlFor={`${formId}-name`}
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
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
                    <label
                      htmlFor={`${formId}-email`}
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Seu e-mail *
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
                    <label
                      htmlFor={`${formId}-phone`}
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
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
                    <label
                      htmlFor={`${formId}-subject`}
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Assunto *
                    </label>
                    <input
                      id={`${formId}-subject`}
                      type="text"
                      required
                      maxLength={200}
                      value={subject}
                      onChange={(e) => setSubject(maskSubjectInput(e.target.value))}
                      placeholder={
                        channel === 'redacao'
                          ? 'Ex.: Sugestão de pauta sobre…'
                          : 'Ex.: Orçamento para banner lateral'
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`${formId}-message`}
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Mensagem *
                    </label>
                    <textarea
                      id={`${formId}-message`}
                      rows={4}
                      required
                      minLength={10}
                      maxLength={2000}
                      value={message}
                      onChange={(e) => setMessage(maskMessageInput(e.target.value))}
                      placeholder="Descreva sua mensagem com o máximo de detalhes possível."
                      className={inputClass}
                    />
                    <p className="mt-1 text-right text-xs text-gray-400">
                      {message.length}/2000
                    </p>
                  </div>

                  {error ? (
                    <p
                      className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
                      role="alert"
                    >
                      {error}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 rounded-full bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-700 disabled:opacity-60"
                    >
                      {loading ? 'Enviando…' : copy.submitLabel}
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
            </div>,
            document.body
          )
        : null}
    </>
  );
}
