import type { Category, PostSummary } from '@/lib/types';

/** Dados locais usados só em desenvolvimento quando o Supabase está inacessível. */
export const DEV_CATEGORIES: Category[] = [
  { id: 'dev-1', name: 'Política', slug: 'politica', color_code: '#7C22B8', display_order: 1 },
  { id: 'dev-2', name: 'Cidades', slug: 'cidades', color_code: '#EA580C', display_order: 2 },
  { id: 'dev-3', name: 'Polícia', slug: 'policia', color_code: '#DC2626', display_order: 3 },
  { id: 'dev-4', name: 'Agronegócio', slug: 'agronegocio', color_code: '#16A34A', display_order: 4 },
  { id: 'dev-5', name: 'Esportes', slug: 'esportes', color_code: '#2563EB', display_order: 5 },
  { id: 'dev-6', name: 'Entretenimento', slug: 'entretenimento', color_code: '#DB2777', display_order: 6 },
];

const DEV_AUTHOR = {
  id: 'dev-author',
  name: 'Ayla Ferreira',
  slug: 'ayla-ferreira',
  avatar_url: 'https://i.pravatar.cc/300?img=47',
  role: 'editor' as const,
};

/** Espelha o seed.sql para manter visual idêntico quando o Supabase demora. */
const DEV_POSTS: PostSummary[] = [
  {
    id: 'dev-1',
    title: 'Assembleia aprova pacote de investimentos em infraestrutura para o interior',
    subtitle: 'Projeto destina recursos para recuperação de rodovias e construção de pontes em 40 municípios.',
    slug: 'assembleia-aprova-pacote-investimentos-infraestrutura',
    cover_image: 'https://picsum.photos/seed/politica-infra/1200/675',
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    views_count: 15420,
    featured_position: 'main',
    category: DEV_CATEGORIES[0],
    author: DEV_AUTHOR,
  },
  {
    id: 'dev-2',
    title: 'Prefeitura anuncia mutirão de limpeza e revitalização do centro histórico',
    subtitle: 'Ação começa no próximo sábado e inclui pintura de fachadas, poda de árvores e recuperação de calçadas.',
    slug: 'prefeitura-mutirao-limpeza-centro-historico',
    cover_image: 'https://picsum.photos/seed/cidades-centro/1200/675',
    published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    views_count: 8930,
    featured_position: 'secondary',
    category: DEV_CATEGORIES[1],
    author: DEV_AUTHOR,
  },
  {
    id: 'dev-3',
    title: 'Polícia Civil desarticula quadrilha especializada em furto de defensivos agrícolas',
    subtitle: 'Operação cumpriu 12 mandados e recuperou carga avaliada em R$ 3 milhões.',
    slug: 'policia-desarticula-quadrilha-furto-defensivos',
    cover_image: 'https://picsum.photos/seed/policia-operacao/1200/675',
    published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    views_count: 12750,
    featured_position: 'secondary',
    category: DEV_CATEGORIES[2],
    author: DEV_AUTHOR,
  },
  {
    id: 'dev-4',
    title: 'Safra de soja bate recorde e movimenta economia dos municípios produtores',
    subtitle: 'Produtividade média superou expectativas mesmo com instabilidade climática no início do plantio.',
    slug: 'safra-soja-bate-recorde-economia',
    cover_image: 'https://picsum.photos/seed/agro-soja/1200/675',
    published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    views_count: 6540,
    featured_position: 'secondary',
    category: DEV_CATEGORIES[3],
    author: DEV_AUTHOR,
  },
  {
    id: 'dev-5',
    title: 'Festival de inverno anuncia atrações nacionais e espera 50 mil visitantes',
    subtitle: 'Evento gratuito terá shows, feira gastronômica e apresentações teatrais durante três dias.',
    slug: 'festival-inverno-atracoes-nacionais',
    cover_image: 'https://picsum.photos/seed/entretenimento-festival/1200/675',
    published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    views_count: 4210,
    featured_position: 'carousel',
    category: DEV_CATEGORIES[5],
    author: DEV_AUTHOR,
  },
  {
    id: 'dev-6',
    title: 'Análise: o xadrez político por trás da disputa pela presidência da Câmara',
    subtitle: 'Bastidores revelam articulações que podem redesenhar o mapa de alianças para as eleições.',
    slug: 'analise-xadrez-politico-presidencia-camara',
    cover_image: 'https://picsum.photos/seed/politica-camara/1200/675',
    published_at: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    views_count: 7340,
    featured_position: 'carousel',
    category: DEV_CATEGORIES[0],
    author: DEV_AUTHOR,
  },
  {
    id: 'dev-7',
    title: 'Time da capital garante vaga na final do estadual após virada histórica',
    subtitle: 'Equipe saiu perdendo por dois gols e virou nos minutos finais diante de 25 mil torcedores.',
    slug: 'time-capital-vaga-final-estadual-virada',
    cover_image: 'https://picsum.photos/seed/esporte-futebol/1200/675',
    published_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    views_count: 9820,
    featured_position: 'none',
    category: DEV_CATEGORIES[4],
    author: DEV_AUTHOR,
  },
  {
    id: 'dev-8',
    title: 'Obras do novo hospital regional atingem 70% de execução',
    subtitle: 'Unidade terá 200 leitos e deve atender moradores de 15 municípios da região.',
    slug: 'obras-hospital-regional-70-por-cento',
    cover_image: 'https://picsum.photos/seed/cidades-hospital/1200/675',
    published_at: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(),
    views_count: 5670,
    featured_position: 'none',
    category: DEV_CATEGORIES[1],
    author: DEV_AUTHOR,
  },
  {
    id: 'dev-9',
    title: 'Operação nas rodovias flagra 45 motoristas embriagados no fim de semana',
    subtitle: 'Blitz da lei seca abordou mais de 1,2 mil veículos em pontos estratégicos.',
    slug: 'operacao-rodovias-motoristas-embriagados',
    cover_image: 'https://picsum.photos/seed/policia-blitz/1200/675',
    published_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    views_count: 8450,
    featured_position: 'none',
    category: DEV_CATEGORIES[2],
    author: DEV_AUTHOR,
  },
  {
    id: 'dev-10',
    title: 'Exportações do agronegócio crescem 18% e puxam balança comercial do estado',
    subtitle: 'China segue como principal destino, mas novos mercados no Oriente Médio ganham espaço.',
    slug: 'exportacoes-agronegocio-crescem-balanca',
    cover_image: 'https://picsum.photos/seed/agro-export/1200/675',
    published_at: new Date(Date.now() - 54 * 60 * 60 * 1000).toISOString(),
    views_count: 3980,
    featured_position: 'none',
    category: DEV_CATEGORIES[3],
    author: DEV_AUTHOR,
  },
  {
    id: 'dev-11',
    title: 'Corrida de rua reúne 5 mil atletas e movimenta domingo na capital',
    subtitle: 'Prova teve percursos de 5 km, 10 km e meia maratona, com participação recorde.',
    slug: 'corrida-rua-reune-atletas-capital',
    cover_image: 'https://picsum.photos/seed/esporte-corrida/1200/675',
    published_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    views_count: 2890,
    featured_position: 'none',
    category: DEV_CATEGORIES[4],
    author: DEV_AUTHOR,
  },
  {
    id: 'dev-12',
    title: 'Cinema ao ar livre volta à praça com sessões gratuitas todo fim de semana',
    subtitle: 'Projeto cultural exibe clássicos nacionais e filmes infantis até o fim do mês.',
    slug: 'cinema-ar-livre-praca-sessoes-gratuitas',
    cover_image: 'https://picsum.photos/seed/entretenimento-cinema/1200/675',
    published_at: new Date(Date.now() - 84 * 60 * 60 * 1000).toISOString(),
    views_count: 1950,
    featured_position: 'none',
    category: DEV_CATEGORIES[5],
    author: DEV_AUTHOR,
  },
];

export function getDevHomePostsData() {
  const main = DEV_POSTS.find((post) => post.featured_position === 'main') ?? null;
  const secondary = DEV_POSTS.filter((post) => post.featured_position === 'secondary').slice(0, 3);
  const carousel = DEV_POSTS.filter((post) => post.featured_position === 'carousel').slice(0, 4);
  const mostRead = [...DEV_POSTS].sort((a, b) => b.views_count - a.views_count).slice(0, 5);

  const postsByCategorySlug: Record<string, PostSummary[]> = {};
  for (const category of DEV_CATEGORIES) {
    postsByCategorySlug[category.slug] = DEV_POSTS.filter(
      (post) => post.category.slug === category.slug
    ).slice(0, 4);
  }

  return { main, secondary, carousel, mostRead, postsByCategorySlug };
}
