import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { InstitutionalShell } from '@/components/common/InstitutionalShell';

export const metadata: Metadata = {
  title: 'Quem somos',
  description:
    'Conheça o Portal da Loira: jornalismo regional com credibilidade, agilidade e compromisso com a verdade.',
  alternates: { canonical: '/sobre' },
};

export default function SobrePage() {
  return (
    <>
      <Header />
      <InstitutionalShell
        title="Quem somos"
        subtitle="Onde a notícia ganha voz"
        actions={
          <>
            <Link
              href="/contato"
              className="rounded-full bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-700"
            >
              Fale conosco
            </Link>
            <Link
              href="/"
              className="rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
            >
              Ver últimas notícias
            </Link>
          </>
        }
      >
        <p>
          O <strong>Portal da Loira</strong> é um veículo de comunicação regional
          dedicado a informar com rapidez, clareza e responsabilidade. Cobrimos
          política, cidades, polícia, agronegócio, esportes e entretenimento, com
          foco no que impacta a vida da nossa comunidade.
        </p>

        <h2>Nossa missão</h2>
        <p>
          Levar informação confiável ao leitor, dando voz aos acontecimentos locais
          e fortalecendo o debate público com jornalismo ético e independente.
        </p>

        <h2>O que nos guia</h2>
        <ul>
          <li>
            <strong>Credibilidade</strong> — apuração e checagem antes da
            publicação
          </li>
          <li>
            <strong>Agilidade</strong> — cobertura atualizada ao longo do dia
          </li>
          <li>
            <strong>Compromisso regional</strong> — prioridade ao que acontece
            aqui, com olhar atento às cidades da região
          </li>
          <li>
            <strong>Transparência</strong> — correções quando necessário e
            distinção clara entre reportagem e opinião
          </li>
        </ul>

        <h2>Redação</h2>
        <p>
          Nossa equipe reúne jornalistas, editores e colaboradores com experiência
          em cobertura política, policial, agronegócio e esportes. Cada matéria
          passa por revisão editorial antes de ir ao ar.
        </p>

        <h2>Cobertura</h2>
        <p>
          Acompanhamos o dia a dia das cidades, a política local e estadual, o
          campo e o mercado agrícola, a segurança pública, o esporte amador e
          profissional, além de cultura e entretenimento. O portal é atualizado
          continuamente pela redação.
        </p>
      </InstitutionalShell>
      <Footer />
    </>
  );
}
