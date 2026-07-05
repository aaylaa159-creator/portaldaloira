'use client';

import { useTransition } from 'react';
import {
  deleteMediaKitLead,
  updateMediaKitLeadStatus,
} from '@/lib/actions/admin/media-kit-leads';
import type { MediaKitLead, MediaKitLeadStatus } from '@/lib/types/media-kit';

const STATUS_LABEL: Record<MediaKitLeadStatus, string> = {
  new: 'Nova',
  contacted: 'Contatado',
  archived: 'Arquivada',
};

const STATUS_CLASS: Record<MediaKitLeadStatus, string> = {
  new: 'bg-accent-100 text-accent-800',
  contacted: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-600',
};

interface MediaKitLeadActionsProps {
  lead: MediaKitLead;
}

export function MediaKitLeadActions({ lead }: MediaKitLeadActionsProps) {
  const [pending, startTransition] = useTransition();

  function setStatus(status: MediaKitLeadStatus) {
    startTransition(async () => {
      await updateMediaKitLeadStatus(lead.id, status);
    });
  }

  function handleDelete() {
    if (!window.confirm('Excluir esta solicitação?')) return;
    startTransition(async () => {
      await deleteMediaKitLead(lead.id);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={lead.status}
        disabled={pending}
        onChange={(e) => setStatus(e.target.value as MediaKitLeadStatus)}
        className="rounded-lg border border-gray-300 px-2 py-1 text-xs"
        aria-label={`Status de ${lead.name}`}
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

export function MediaKitLeadStatusBadge({ status }: { status: MediaKitLeadStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
