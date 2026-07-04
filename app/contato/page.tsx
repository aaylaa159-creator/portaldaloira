import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { InstitutionalShell } from '@/components/common/InstitutionalShell';

export const metadata: Metadata = {
  title: 'Contato e pauta',
  description:
    'Entre em contato com a redação do Portal da Loira. Envie pautas, sugestões e informações para nossa equipe jornalística.',
  alternates: { canonical: '/contato' },
};

export default function ContatoPage() {
  return (
    <>
      <Header />
      <InstitutionalShell
        title="Contato e pauta"
        subtitle="Fale com a redação"
        actions={
          <>
            <Link
              href="/anuncie"
              className="rounded-full bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-700"
            >
              Anuncie conosco
            </Link>
            <Link
              href="/sobre"
              className="rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
            >
              Quem somos
            </Link>
          </>
        }
      >
        <p>
          Tem uma informação, sugestão de pauta ou crítica sobre o portal? Nossa
          redação está aberta ao diálogo com leitores, fontes e parceiros da
          região.
        </p>

        <h2>Redação</h2>
        <p>
          Para enviar pautas, denúncias, releases ou pedidos de correção, utilize
          o e-mail institucional da redação:
        </p>
        <p>
          <a
            href="mailto:redacao@portaldaloira.com.br"
            className="font-semibold text-brand-700 no-underline hover:text-accent-600"
          >
            redacao@portaldaloira.com.br
          </a>
        </p>

        <h2>Envie sua pauta</h2>
        <p>Ao escrever, inclua sempre que possível:</p>
        <ul>
          <li>O que aconteceu, onde e quando</li>
          <li>Nome e telefone de uma fonte ou contato para apuração</li>
          <li>Fotos ou vídeos, se houver (com autorização de uso)</li>
          <li>Links ou documentos de apoio</li>
        </ul>

        <h2>Horário de atendimento</h2>
        <p>
          A redação acompanha a cobertura ao longo do dia útil. Mensagens recebidas
          fora do horário comercial são lidas no próximo expediente editorial.
        </p>

        <h2>Correções</h2>
        <p>
          Encontrou um erro em alguma matéria? Informe o link da notícia e o
          trecho incorreto. Correções relevantes são publicadas com
          transparência, conforme as boas práticas jornalísticas.
        </p>
      </InstitutionalShell>
      <Footer />
    </>
  );
}
