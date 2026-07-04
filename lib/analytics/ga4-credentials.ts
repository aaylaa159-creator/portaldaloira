interface ServiceAccountCredentials {
  client_email?: string;
  private_key?: string;
  [key: string]: unknown;
}

/** Credenciais da conta de serviço para a GA4 Data API (somente servidor). */
export function getGa4Credentials(): ServiceAccountCredentials | null {
  const base64 = process.env.GA_SERVICE_KEY_BASE64;
  if (base64) {
    try {
      const json = Buffer.from(base64, 'base64').toString('utf8');
      return JSON.parse(json) as ServiceAccountCredentials;
    } catch {
      return null;
    }
  }

  const clientEmail = process.env.GA4_CLIENT_EMAIL;
  const privateKey = process.env.GA4_PRIVATE_KEY;
  if (clientEmail && privateKey) {
    return {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    };
  }

  return null;
}

export function getGa4PropertyId(): string | null {
  const id = process.env.GA4_PROPERTY_ID?.trim();
  return id && /^\d+$/.test(id) ? id : null;
}

export function isGa4ApiConfigured(): boolean {
  return Boolean(getGa4Credentials() && getGa4PropertyId());
}
