import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { unstable_cache } from 'next/cache';
import {
  getGa4Credentials,
  getGa4PropertyId,
  isGa4ApiConfigured,
} from '@/lib/analytics/ga4-credentials';

export interface Ga4Summary {
  activeUsers: number;
  sessions: number;
  pageViews: number;
  periodLabel: string;
}

export interface Ga4TopPage {
  path: string;
  pageViews: number;
  title: string | null;
}

export interface Ga4DashboardData {
  summary: Ga4Summary;
  realtimeUsers: number;
  topPages: Ga4TopPage[];
  fetchedAt: string;
}

export interface Ga4DashboardResult {
  configured: boolean;
  data: Ga4DashboardData | null;
  error: string | null;
}

const PERIOD_LABEL = 'Últimos 28 dias';

let clientInstance: BetaAnalyticsDataClient | null = null;

function getClient(): BetaAnalyticsDataClient {
  if (!clientInstance) {
    const credentials = getGa4Credentials();
    if (!credentials) {
      throw new Error('Credenciais GA4 ausentes');
    }
    clientInstance = new BetaAnalyticsDataClient({ credentials });
  }
  return clientInstance;
}

function propertyResource(): string {
  const id = getGa4PropertyId();
  if (!id) throw new Error('GA4_PROPERTY_ID inválido');
  return `properties/${id}`;
}

/** Caminhos de matéria: /editoria/slug ou /categoria/slug — exclui home, admin, estáticos. */
function isArticlePath(path: string): boolean {
  if (!path || path === '/') return false;
  if (path.startsWith('/admin') || path.startsWith('/editoria')) return false;
  if (path.startsWith('/_next') || path.startsWith('/api')) return false;
  const segments = path.split('/').filter(Boolean);
  return segments.length === 2;
}

function titleFromPath(path: string): string | null {
  const slug = path.split('/').filter(Boolean)[1];
  if (!slug) return null;
  return slug.replace(/-/g, ' ');
}

async function fetchGa4Dashboard(): Promise<Ga4DashboardResult> {
  if (!isGa4ApiConfigured()) {
    return { configured: false, data: null, error: null };
  }

  try {
    const client = getClient();
    const property = propertyResource();

    const [[summaryReport], [pagesReport], [realtimeReport]] = await Promise.all([
      client.runReport({
        property,
        dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
        ],
      }),
      client.runReport({
        property,
        dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 40,
      }),
      client.runRealtimeReport({
        property,
        metrics: [{ name: 'activeUsers' }],
      }),
    ]);

    const summaryRow = summaryReport.rows?.[0];
    const summary: Ga4Summary = {
      activeUsers: parseInt(summaryRow?.metricValues?.[0]?.value ?? '0', 10),
      sessions: parseInt(summaryRow?.metricValues?.[1]?.value ?? '0', 10),
      pageViews: parseInt(summaryRow?.metricValues?.[2]?.value ?? '0', 10),
      periodLabel: PERIOD_LABEL,
    };

    const realtimeUsers = parseInt(
      realtimeReport.rows?.[0]?.metricValues?.[0]?.value ?? '0',
      10
    );

    const topPages: Ga4TopPage[] = (pagesReport.rows ?? [])
      .map((row) => ({
        path: row.dimensionValues?.[0]?.value ?? '',
        pageViews: parseInt(row.metricValues?.[0]?.value ?? '0', 10),
        title: null as string | null,
      }))
      .filter((row) => isArticlePath(row.path))
      .slice(0, 10)
      .map((row) => ({
        ...row,
        title: titleFromPath(row.path),
      }));

    return {
      configured: true,
      data: {
        summary,
        realtimeUsers,
        topPages,
        fetchedAt: new Date().toISOString(),
      },
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao consultar GA4';
    console.error('[ga4-analytics]', message);
    return { configured: true, data: null, error: message };
  }
}

const getCachedGa4Dashboard = unstable_cache(
  fetchGa4Dashboard,
  ['ga4-admin-dashboard'],
  { revalidate: 300, tags: ['ga4-analytics'] }
);

export async function getGa4Dashboard(): Promise<Ga4DashboardResult> {
  return getCachedGa4Dashboard();
}
