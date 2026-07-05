'use client';

import { useTransition } from 'react';
import {
  deleteContactMessage,
  updateContactMessageStatus,
} from '@/lib/actions/admin/contact-messages';
import { formatDateShort } from '@/lib/format';
import type {
  ContactMessage,
  ContactMessageChannel,
  ContactMessageStatus,
} from '@/lib/types/contact-message';

const STATUS_LABEL: Record<ContactMessageStatus, string> = {
  new: 'Nova',
  contacted: 'Contatado',
  archived: 'Arquivada',
};

const STATUS_CLASS: Record<ContactMessageStatus, string> = {
  new: 'bg-accent-100 text-accent-800',
  contacted: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-600',
};

interface ContactMessageActionsProps {
  message: ContactMessage;
}

export function ContactMessageActions({ message }: ContactMessageActionsProps) {
  const [pending, startTransition] = useTransition();

  function setStatus(status: ContactMessageStatus) {
    startTransition(async () => {
      await updateContactMessageStatus(message.id, message.channel, status);
    });
  }

  function handleDelete() {
    if (!window.confirm('Excluir esta mensagem?')) return;
    startTransition(async () => {
      await deleteContactMessage(message.id, message.channel);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={message.status}
        disabled={pending}
        onChange={(e) => setStatus(e.target.value as ContactMessageStatus)}
        className="rounded-lg border border-gray-300 px-2 py-1 text-xs"
        aria-label={`Status de ${message.name}`}
      >
        <option value="new">Nova</option>
        <option value="contacted">Contatado</option>
        <option value="archived">Arquivada</option>
      </select>
      <button
        type="button"
        disabled={pending}
        onClick={handleDelete}
        className="text-xs text-red-600 hover:underline disabled:opacity-50"
      >
        Excluir
      </button>
    </div>
  );
}

export function ContactMessageStatusBadge({
  status,
}: {
  status: ContactMessageStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

interface ContactMessagesTableProps {
  messages: ContactMessage[];
  emptyMessage: string;
}

export function ContactMessagesTable({
  messages,
  emptyMessage,
}: ContactMessagesTableProps) {
  if (messages.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">Contato</th>
              <th className="px-4 py-3 text-left">Assunto</th>
              <th className="px-4 py-3 text-left">Mensagem</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {messages.map((item) => (
              <tr key={item.id} className="align-top">
                <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                  {formatDateShort(item.created_at)}
                </td>
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3">
                  <a
                    href={`mailto:${item.email}`}
                    className="block text-brand-600 hover:underline"
                  >
                    {item.email}
                  </a>
                  {item.phone ? (
                    <a
                      href={`tel:${item.phone.replace(/\D/g, '')}`}
                      className="mt-1 block text-gray-600 hover:text-brand-600"
                    >
                      {item.phone}
                    </a>
                  ) : null}
                </td>
                <td className="max-w-[10rem] px-4 py-3 font-medium text-gray-800">
                  {item.subject}
                </td>
                <td className="max-w-xs px-4 py-3 text-gray-600">
                  <p className="whitespace-pre-wrap break-words">{item.message}</p>
                </td>
                <td className="px-4 py-3">
                  <ContactMessageStatusBadge status={item.status} />
                </td>
                <td className="px-4 py-3">
                  <ContactMessageActions message={item} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function contactChannelLabel(channel: ContactMessageChannel): string {
  return channel === 'redacao'
    ? 'redacao@portaldaloira.com.br'
    : 'comercial@portaldaloira.com.br';
}
