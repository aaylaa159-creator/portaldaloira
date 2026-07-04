import DOMPurify from 'isomorphic-dompurify';

/**
 * Higieniza o HTML vindo do CMS antes de renderizar (anti-XSS).
 * Lista de permissões estrita conforme política de segurança do projeto.
 */
export function sanitizeContent(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'b', 'i', 'em', 'strong', 'a', 'h2', 'h3',
      'ul', 'ol', 'li', 'img', 'blockquote', 'figure', 'figcaption', 'br',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'target', 'rel'],
  });
}

/**
 * Divide o HTML sanitizado em segmentos nos pontos de injeção de anúncio:
 * após o 3º e o 7º parágrafo. O componente de renderização intercala
 * os blocos de anúncio entre os segmentos retornados.
 */
export function splitContentForAds(sanitizedHtml: string): string[] {
  const paragraphs = sanitizedHtml.split('</p>');
  const breakpoints = [3, 7];

  const segments: string[] = [];
  let current = '';
  let paragraphCount = 0;

  for (const chunk of paragraphs) {
    if (chunk.trim() === '') continue;
    current += `${chunk}</p>`;
    paragraphCount += 1;

    if (breakpoints.includes(paragraphCount)) {
      segments.push(current);
      current = '';
    }
  }

  if (current.trim() !== '') {
    segments.push(current);
  }

  return segments.length > 0 ? segments : [sanitizedHtml];
}
