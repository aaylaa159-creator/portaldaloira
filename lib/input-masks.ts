const PERSON_NAME_RE = /[^\p{L}\s'-]/gu;
const COMPANY_NAME_RE = /[^\p{L}\p{N}\s&.,/'()-]/gu;

/** Nome: apenas letras, espaços, hífen e apóstrofo. */
export function maskPersonName(value: string, max = 120): string {
  return value.replace(PERSON_NAME_RE, '').slice(0, max);
}

/** Empresa: letras, números e pontuação comercial comum. */
export function maskCompanyName(value: string, max = 160): string {
  return value.replace(COMPANY_NAME_RE, '').slice(0, max);
}

/** E-mail: sem espaços, minúsculas, caracteres válidos. */
export function maskEmailInput(value: string, max = 254): string {
  return value
    .replace(/\s/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9@._%+-]/g, '')
    .slice(0, max);
}

/**
 * Telefone BR: (DD) 99999-9999 ou (DD) 9999-9999
 * Aceita 10 ou 11 dígitos.
 */
export function maskBrazilPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/** Mensagem: limita tamanho e normaliza quebras excessivas. */
export function maskMessageInput(value: string, max = 2000): string {
  return value.slice(0, max);
}

/** Assunto: limita tamanho. */
export function maskSubjectInput(value: string, max = 200): string {
  return value.slice(0, max);
}
