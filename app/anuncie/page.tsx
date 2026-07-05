import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { InstitutionalShell } from '@/components/common/InstitutionalShell';
import { MediaKitRequestButton } from '@/components/features/MediaKitRequestButton';
import { ContactEmailModal } from '@/components/features/ContactEmailModal';

export const metadata: Metadata = {
  title: 'Anuncie conosco',
  description:
    'Divulgue sua marca no Portal da Loira. Conheça os espaços publicitários e fale com nossa equipe comercial.',
  alternates: { canonical: '/anuncie' },
};

const AD_SPACES = [
  {
    name: 'Topo do site',
    size: '728 × 90 px',
    description: 'Banner principal visível na home e nas páginas de notícias.',
  },
  {
    name: 'Sidebar',
    size: '300 × 250 px',
    description: 'Bloco lateral ao lado das matérias e listagens.',
  },
  {
    name: 'Dentro da matéria',
    size: '728 × 90 px',
    description: 'Anúncios inseridos no corpo do texto, após parágrafos.',
  },
];

export default function AnunciePage() {
  return (
    <>
      <Header />
      <InstitutionalShell
        title="Anuncie conosco"
        subtitle="Alcance leitores da região"
        actions={
          <Link
            href="/contato"
            className="rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
          >
            Fale conosco
          </Link>
        }
      >
        <p>
          O <strong>Portal da Loira</strong> conecta marcas, comércios e serviços
          a um público engajado com notícias locais. Anuncie em um ambiente de
          credibilidade editorial e visibilidade diária.
        </p>

        <h2>Espaços disponíveis</h2>
        <ul className="not-prose list-none space-y-4 p-0">
          {AD_SPACES.map((space) => (
            <li
              key={space.name}
              className="rounded-xl border border-brand-100 bg-brand-50/50 px-4 py-3"
            >
              <p className="font-display font-bold text-brand-900">{space.name}</p>
              <p className="text-sm font-medium text-accent-700">{space.size}</p>
              <p className="mt-1 text-sm text-gray-600">{space.description}</p>
            </li>
          ))}
        </ul>

        <h2>Formatos</h2>
        <p>
          Trabalhamos com banners em imagem (JPG, PNG, WebP) e, mediante
          avaliação, códigos de parceiros homologados. Todos os anúncios passam
          por aprovação da redação antes de veicular.
        </p>

        <h2>Solicitar mídia kit</h2>
        <p>
          Preencha nome e empresa no formulário e nossa equipe comercial retorna com
          valores, formatos e o material completo.
        </p>
        <div className="not-prose mt-4">
          <MediaKitRequestButton />
        </div>

        <h2>Comercial</h2>
        <p>
          Solicite valores, períodos de campanha e relatórios de veiculação pelo
          e-mail:
        </p>
        <div className="not-prose">
          <ContactEmailModal channel="comercial" />
        </div>
      </InstitutionalShell>
      <Footer />
    </>
  );
}
