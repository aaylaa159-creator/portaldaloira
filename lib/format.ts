/** Formata data ISO para o padrão brasileiro de portais de notícias. */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Cuiaba',
  }).format(new Date(iso));
}

/** Data curta para cards (ex: 02/07/2026 14h30). */
export function formatDateShort(iso: string): string {
  const date = new Date(iso);
  const day = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Cuiaba',
  }).format(date);
  const time = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Cuiaba',
  }).format(date);
  return `${day} ${time.replace(':', 'h')}`;
}

/** Data por extenso do dia atual (header). */
export function formatToday(): string {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Cuiaba',
  }).format(new Date());
}
