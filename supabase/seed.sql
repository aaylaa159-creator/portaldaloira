-- ============================================================================
-- PORTAL DA LOIRA - CONTEUDO DE EXEMPLO (SEED)
-- Execute APOS o schema.sql. Conteudo ficticio apenas para desenvolvimento.
-- ============================================================================

-- Categorias (editorias)
insert into public.categories (name, slug, color_code, display_order) values
  ('Política',        'politica',        '#7C22B8', 1),
  ('Cidades',         'cidades',         '#EA580C', 2),
  ('Polícia',         'policia',         '#DC2626', 3),
  ('Agronegócio',     'agronegocio',     '#16A34A', 4),
  ('Esportes',        'esportes',        '#2563EB', 5),
  ('Entretenimento',  'entretenimento',  '#DB2777', 6)
on conflict (slug) do nothing;

-- Autores
insert into public.authors (name, slug, avatar_url, bio, role, instagram) values
  ('Ayla Ferreira', 'ayla-ferreira', 'https://i.pravatar.cc/300?img=47',
   'Editora-chefe do Portal da Loira. Jornalista com 10 anos de cobertura política.', 'editor', '@aylaferreira'),
  ('Carlos Mendes', 'carlos-mendes', 'https://i.pravatar.cc/300?img=12',
   'Repórter de cidades e cotidiano. Apaixonado por histórias locais.', 'journalist', '@carlosmendes'),
  ('Marina Souza', 'marina-souza', 'https://i.pravatar.cc/300?img=32',
   'Colunista de opinião e análise política.', 'columnist', '@marinasouza')
on conflict (slug) do nothing;

-- Noticias
with
  a1 as (select id from public.authors where slug = 'ayla-ferreira'),
  a2 as (select id from public.authors where slug = 'carlos-mendes'),
  a3 as (select id from public.authors where slug = 'marina-souza'),
  c_pol as (select id from public.categories where slug = 'politica'),
  c_cid as (select id from public.categories where slug = 'cidades'),
  c_pcl as (select id from public.categories where slug = 'policia'),
  c_agr as (select id from public.categories where slug = 'agronegocio'),
  c_esp as (select id from public.categories where slug = 'esportes'),
  c_ent as (select id from public.categories where slug = 'entretenimento')
insert into public.posts
  (title, subtitle, slug, content, cover_image, cover_caption, author_id, category_id, tags, status, published_at, views_count, featured_position)
values
  (
    'Assembleia aprova pacote de investimentos em infraestrutura para o interior',
    'Projeto destina recursos para recuperação de rodovias e construção de pontes em 40 municípios.',
    'assembleia-aprova-pacote-investimentos-infraestrutura',
    '<p>A Assembleia Legislativa aprovou nesta quinta-feira o pacote de investimentos em infraestrutura que destina recursos históricos para o interior do estado. A votação terminou com ampla maioria favorável ao projeto do Executivo.</p><p>O texto prevê a recuperação de mais de 2 mil quilômetros de rodovias estaduais e a construção de 18 novas pontes de concreto, substituindo estruturas de madeira que datam da década de 1980.</p><p>Segundo o relator da proposta, os primeiros editais de licitação devem ser publicados ainda neste semestre. "É o maior programa de infraestrutura da história recente do estado", afirmou.</p><p>Prefeitos de municípios beneficiados acompanharam a votação nas galerias do plenário e comemoraram o resultado. A expectativa é de geração de mais de 5 mil empregos diretos durante as obras.</p><p>A oposição criticou pontos do financiamento, que envolve operação de crédito com aval do Tesouro, mas votou majoritariamente a favor após a inclusão de emendas que garantem fiscalização trimestral pelo Tribunal de Contas.</p><p>O governador deve sancionar a lei na próxima semana em cerimônia no Palácio, com a presença de lideranças regionais.</p><p>As obras devem começar pelo eixo norte, onde o escoamento da produção agrícola sofre com a precariedade das estradas há mais de uma década.</p><p>Especialistas em logística apontam que a melhoria da malha viária pode reduzir em até 15% o custo do frete no estado.</p>',
    'https://picsum.photos/seed/politica-infra/1200/675',
    'Plenário da Assembleia durante a votação do pacote. Foto: Divulgação',
    (select id from a1), (select id from c_pol),
    array['assembleia', 'infraestrutura', 'investimentos'],
    'published', now() - interval '2 hours', 15420, 'main'
  ),
  (
    'Prefeitura anuncia mutirão de limpeza e revitalização do centro histórico',
    'Ação começa no próximo sábado e inclui pintura de fachadas, poda de árvores e recuperação de calçadas.',
    'prefeitura-mutirao-limpeza-centro-historico',
    '<p>A Prefeitura anunciou nesta quarta-feira um mutirão de limpeza e revitalização do centro histórico da cidade. A ação, que começa no próximo sábado, deve mobilizar mais de 300 servidores.</p><p>O programa inclui pintura de fachadas de prédios públicos, poda de árvores, recuperação de calçadas e substituição da iluminação por lâmpadas de LED.</p><p>Comerciantes da região receberam a notícia com otimismo. "O centro estava precisando desse cuidado há anos", disse a presidente da associação comercial.</p><p>A primeira etapa se concentra na praça central e nas ruas do quadrilátero histórico, com previsão de conclusão em 45 dias.</p><p>Além da revitalização física, a Prefeitura estuda a criação de um corredor cultural com apresentações artísticas aos fins de semana.</p><p>O investimento total é estimado em R$ 8 milhões, com recursos próprios e emendas parlamentares.</p>',
    'https://picsum.photos/seed/cidades-centro/1200/675',
    'Centro histórico receberá revitalização completa. Foto: Arquivo',
    (select id from a2), (select id from c_cid),
    array['prefeitura', 'centro histórico', 'revitalização'],
    'published', now() - interval '4 hours', 8930, 'secondary'
  ),
  (
    'Polícia Civil desarticula quadrilha especializada em furto de defensivos agrícolas',
    'Operação cumpriu 12 mandados e recuperou carga avaliada em R$ 3 milhões.',
    'policia-desarticula-quadrilha-furto-defensivos',
    '<p>A Polícia Civil desarticulou nesta madrugada uma quadrilha especializada em furto de defensivos agrícolas que atuava em pelo menos três regiões do estado. Doze mandados de busca e apreensão foram cumpridos.</p><p>Segundo o delegado responsável, o grupo invadia fazendas durante a madrugada e levava produtos de alto valor agregado, revendidos no mercado paralelo.</p><p>A carga recuperada na operação é avaliada em cerca de R$ 3 milhões. Cinco pessoas foram presas em flagrante.</p><p>As investigações começaram há oito meses, após uma série de ocorrências registradas por produtores rurais da região norte.</p><p>A polícia identificou que a quadrilha utilizava caminhões clonados e depósitos alugados em nomes de laranjas para armazenar os produtos.</p><p>Os presos vão responder por furto qualificado, organização criminosa e receptação. As investigações continuam para identificar compradores do material.</p>',
    'https://picsum.photos/seed/policia-operacao/1200/675',
    'Material apreendido durante a operação. Foto: Polícia Civil',
    (select id from a2), (select id from c_pcl),
    array['polícia civil', 'operação', 'agronegócio'],
    'published', now() - interval '6 hours', 12750, 'secondary'
  ),
  (
    'Safra de soja bate recorde e movimenta economia dos municípios produtores',
    'Produtividade média superou expectativas mesmo com instabilidade climática no início do plantio.',
    'safra-soja-bate-recorde-economia',
    '<p>A safra de soja deste ano bateu recorde histórico no estado, com produtividade média superando as expectativas iniciais mesmo após a instabilidade climática registrada no início do plantio.</p><p>Os números divulgados pela companhia estadual de abastecimento apontam crescimento de 12% em relação à safra anterior.</p><p>Nos municípios produtores, o resultado já movimenta o comércio local. Concessionárias de máquinas registram aumento nas vendas.</p><p>O setor de logística também sente o impacto positivo, com transportadoras contratando motoristas para dar conta do escoamento.</p><p>Economistas alertam, porém, para a dependência do preço internacional da commodity, que passa por período de volatilidade.</p><p>Para a próxima safra, a expectativa é de ampliação de 5% na área plantada.</p>',
    'https://picsum.photos/seed/agro-soja/1200/675',
    'Colheita da soja em fazenda do interior. Foto: Divulgação',
    (select id from a1), (select id from c_agr),
    array['soja', 'safra', 'agronegócio', 'economia'],
    'published', now() - interval '8 hours', 6540, 'secondary'
  ),
  (
    'Time da capital garante vaga na final do estadual após virada histórica',
    'Equipe saiu perdendo por dois gols e virou nos minutos finais diante de 25 mil torcedores.',
    'time-capital-vaga-final-estadual-virada',
    '<p>Em uma noite histórica no estádio lotado, o time da capital garantiu vaga na final do campeonato estadual após virada espetacular por 3 a 2, diante de 25 mil torcedores.</p><p>A equipe saiu perdendo por dois gols ainda no primeiro tempo, mas reagiu na etapa final com atuação inspirada do ataque.</p><p>O gol da classificação saiu aos 47 minutos do segundo tempo, em cobrança de escanteio que terminou em cabeçada certeira do zagueiro capitão.</p><p>"Nunca deixamos de acreditar. Essa torcida merece essa final", declarou o treinador emocionado na entrevista coletiva.</p><p>A final será disputada em jogos de ida e volta nos próximos dois fins de semana.</p><p>A diretoria já iniciou a venda de ingressos para o primeiro jogo, com expectativa de casa cheia.</p>',
    'https://picsum.photos/seed/esporte-futebol/1200/675',
    'Comemoração do gol da classificação. Foto: Assessoria do clube',
    (select id from a2), (select id from c_esp),
    array['futebol', 'estadual', 'final'],
    'published', now() - interval '12 hours', 9820, 'none'
  ),
  (
    'Festival de inverno anuncia atrações nacionais e espera 50 mil visitantes',
    'Evento gratuito terá shows, feira gastronômica e apresentações teatrais durante três dias.',
    'festival-inverno-atracoes-nacionais',
    '<p>A organização do festival de inverno anunciou nesta semana a grade completa de atrações da edição deste ano, que espera receber 50 mil visitantes em três dias de programação gratuita.</p><p>Entre os destaques estão dois artistas nacionais de grande porte, cujos nomes foram revelados em coletiva de imprensa.</p><p>Além dos shows musicais, o evento contará com feira gastronômica reunindo 60 expositores locais.</p><p>A rede hoteleira da região já registra 80% de ocupação para o período do festival.</p><p>A programação teatral ocupará o teatro municipal com sessões gratuitas mediante retirada de ingresso.</p><p>O festival é viabilizado por lei de incentivo à cultura e patrocínio de empresas locais.</p>',
    'https://picsum.photos/seed/entretenimento-festival/1200/675',
    'Palco principal da edição anterior do festival. Foto: Divulgação',
    (select id from a3), (select id from c_ent),
    array['festival', 'cultura', 'shows'],
    'published', now() - interval '1 day', 4210, 'carousel'
  ),
  (
    'Análise: o xadrez político por trás da disputa pela presidência da Câmara',
    'Bastidores revelam articulações que podem redesenhar o mapa de alianças para as eleições.',
    'analise-xadrez-politico-presidencia-camara',
    '<p>A disputa pela presidência da Câmara Municipal ganhou contornos de xadrez político nas últimas semanas, com articulações que podem redesenhar o mapa de alianças da cidade.</p><p>Nos bastidores, ao menos três blocos se movimentam. O grupo governista tenta manter o comando da casa, enquanto a oposição costura uma candidatura de consenso.</p><p>O fiel da balança está nas mãos de um grupo de seis vereadores independentes, cortejados por todos os lados.</p><p>A eleição da mesa diretora, marcada para dezembro, definirá também o ritmo das pautas do Executivo no próximo biênio.</p><p>Historicamente, quem controla a presidência da Câmara controla a agenda de votações — e, em ano eleitoral, isso vale ouro.</p><p>A conferir se os acordos de gabinete sobreviverão ao plenário.</p>',
    'https://picsum.photos/seed/politica-camara/1200/675',
    'Plenário da Câmara Municipal. Foto: Arquivo',
    (select id from a3), (select id from c_pol),
    array['câmara', 'análise', 'eleições'],
    'published', now() - interval '1 day 4 hours', 7340, 'carousel'
  ),
  (
    'Obras do novo hospital regional atingem 70% de execução',
    'Unidade terá 200 leitos e deve atender moradores de 15 municípios da região.',
    'obras-hospital-regional-70-por-cento',
    '<p>As obras do novo hospital regional atingiram 70% de execução, segundo balanço divulgado pela secretaria estadual de saúde. A unidade terá 200 leitos.</p><p>Quando concluído, o hospital atenderá moradores de 15 municípios, desafogando as unidades da capital.</p><p>O prédio de cinco andares contará com centro cirúrgico de última geração, UTI adulto e neonatal, e ala oncológica completa.</p><p>A previsão de entrega é para o primeiro semestre do próximo ano, com início de operação gradual.</p><p>O investimento total supera os R$ 180 milhões, entre recursos estaduais e federais.</p><p>A secretaria estima que a unidade realizará 400 internações e 2 mil consultas especializadas por mês.</p>',
    'https://picsum.photos/seed/cidades-hospital/1200/675',
    'Fachada do hospital em construção. Foto: Secretaria de Saúde',
    (select id from a2), (select id from c_cid),
    array['saúde', 'hospital', 'obras'],
    'published', now() - interval '1 day 8 hours', 5670, 'none'
  ),
  (
    'Operação nas rodovias flagra 45 motoristas embriagados no fim de semana',
    'Blitz da lei seca abordou mais de 1,2 mil veículos em pontos estratégicos.',
    'operacao-rodovias-motoristas-embriagados',
    '<p>A operação de fiscalização nas rodovias estaduais flagrou 45 motoristas dirigindo sob efeito de álcool durante o fim de semana. Mais de 1,2 mil veículos foram abordados.</p><p>As blitze foram montadas em pontos estratégicos, incluindo saídas de eventos e trechos com histórico de acidentes.</p><p>Além das autuações por embriaguez, foram registradas 120 infrações por outras irregularidades.</p><p>Sete condutores foram presos em flagrante por dirigir com concentração alcoólica acima do limite criminal.</p><p>Segundo o comando da operação, o número de acidentes caiu 30% nos trechos fiscalizados.</p><p>As operações continuam nos próximos fins de semana, com reforço no período de festas.</p>',
    'https://picsum.photos/seed/policia-blitz/1200/675',
    'Blitz em rodovia estadual. Foto: PM',
    (select id from a2), (select id from c_pcl),
    array['trânsito', 'lei seca', 'fiscalização'],
    'published', now() - interval '2 days', 8450, 'none'
  ),
  (
    'Exportações do agronegócio crescem 18% e puxam balança comercial do estado',
    'China segue como principal destino, mas novos mercados no Oriente Médio ganham espaço.',
    'exportacoes-agronegocio-crescem-balanca',
    '<p>As exportações do agronegócio cresceram 18% no acumulado do ano, puxando o resultado positivo da balança comercial do estado, segundo dados divulgados nesta semana.</p><p>A China segue como principal destino dos embarques, respondendo por quase metade do volume exportado.</p><p>Novos mercados no Oriente Médio, porém, ganham espaço, com destaque para a carne bovina com certificação halal.</p><p>O complexo soja lidera a pauta, seguido por milho, algodão e carnes.</p><p>Para os próximos meses, a expectativa é de manutenção do ritmo, sustentada pela safra recorde.</p><p>Entidades do setor pedem investimentos em armazenagem para reduzir gargalos logísticos no escoamento.</p>',
    'https://picsum.photos/seed/agro-export/1200/675',
    'Terminal de cargas durante embarque de grãos. Foto: Divulgação',
    (select id from a1), (select id from c_agr),
    array['exportações', 'agronegócio', 'economia'],
    'published', now() - interval '2 days 6 hours', 3980, 'none'
  ),
  (
    'Corrida de rua reúne 5 mil atletas e movimenta domingo na capital',
    'Prova teve percursos de 5 km, 10 km e meia maratona, com participação recorde.',
    'corrida-rua-reune-atletas-capital',
    '<p>A tradicional corrida de rua da capital reuniu 5 mil atletas neste domingo, número recorde na história da prova, que chegou à sua 15ª edição.</p><p>Os participantes puderam escolher entre percursos de 5 km, 10 km e meia maratona, com largada na praça central.</p><p>O vencedor da meia maratona completou o percurso em 1h08min, novo recorde da prova.</p><p>Na categoria feminina, a campeã celebrou o tricampeonato consecutivo.</p><p>O evento movimentou hotéis e restaurantes, com atletas vindos de mais de 50 cidades.</p><p>A organização já confirmou a data da próxima edição e promete ampliar as inscrições para 7 mil vagas.</p>',
    'https://picsum.photos/seed/esporte-corrida/1200/675',
    'Largada da corrida na praça central. Foto: Organização',
    (select id from a3), (select id from c_esp),
    array['corrida', 'atletismo', 'esporte'],
    'published', now() - interval '3 days', 2890, 'none'
  ),
  (
    'Cinema ao ar livre volta à praça com sessões gratuitas todo fim de semana',
    'Projeto cultural exibe clássicos nacionais e filmes infantis até o fim do mês.',
    'cinema-ar-livre-praca-sessoes-gratuitas',
    '<p>O projeto de cinema ao ar livre está de volta à praça central, com sessões gratuitas todos os fins de semana até o fim do mês.</p><p>A programação mescla clássicos do cinema nacional com produções infantis, sempre a partir das 19h.</p><p>A estrutura conta com telão de 12 metros, som profissional e 300 cadeiras, além de espaço para quem preferir levar canga.</p><p>Food trucks locais complementam a experiência.</p><p>Nas primeiras sessões, o público superou as 800 pessoas por noite.</p><p>O projeto é gratuito e realizado com apoio da lei municipal de incentivo à cultura.</p>',
    'https://picsum.photos/seed/entretenimento-cinema/1200/675',
    'Sessão de cinema na praça. Foto: Divulgação',
    (select id from a3), (select id from c_ent),
    array['cinema', 'cultura', 'lazer'],
    'published', now() - interval '3 days 12 hours', 1950, 'none'
  )
on conflict (slug) do nothing;

-- Banners de exemplo (espacos publicitarios com imagem placeholder)
insert into public.ad_banners (placement, type, image_url, target_url, active) values
  ('header_top',    'image', 'https://picsum.photos/seed/ad-leaderboard-1/728/90',  'https://example.com', true),
  ('header_top',    'image', 'https://picsum.photos/seed/ad-leaderboard-2/728/90',  'https://example.com', true),
  ('header_top',    'image', 'https://picsum.photos/seed/ad-leaderboard-3/728/90',  'https://example.com', true),
  ('sidebar_right', 'image', 'https://picsum.photos/seed/ad-sidebar-1/300/250',     'https://example.com', true),
  ('sidebar_right', 'image', 'https://picsum.photos/seed/ad-sidebar-2/300/250',     'https://example.com', true),
  ('in_content_1',  'image', 'https://picsum.photos/seed/ad-content1/728/90',     'https://example.com', true),
  ('in_content_2',  'image', 'https://picsum.photos/seed/ad-content2/728/90',     'https://example.com', true);
