import { ContactMessagesTable } from '@/components/admin/ContactMessageActions';
import { listContactMessages } from '@/lib/data/admin/contact-messages';

export const dynamic = 'force-dynamic';

export default async function AdminRedacaoPage() {
  const messages = await listContactMessages('redacao');
  const newCount = messages.filter((item) => item.status === 'new').length;

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold text-gray-900">
        Mensagens da redação
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        Contatos enviados pelo e-mail{' '}
        <span className="font-medium text-brand-700">redacao@portaldaloira.com.br</span>{' '}
        na página Contato e pauta.
        {newCount > 0 ? (
          <span className="ml-2 font-medium text-accent-700">
            {newCount} nova{newCount > 1 ? 's' : ''} pendente{newCount > 1 ? 's' : ''}
          </span>
        ) : null}
      </p>

      <ContactMessagesTable
        messages={messages}
        emptyMessage="Nenhuma mensagem ainda. Elas aparecem aqui quando alguém envia pelo formulário em /contato."
      />
    </div>
  );
}
