/**
 * Valida se o link pertence ao domínio do Mercado Livre.
 * 
 * @param link - Link a ser validado
 * @returns true se o link é do Mercado Livre, false caso contrário
 */
export function isValidMercadoLivreDomain(link: string): boolean {
  if (!link || typeof link !== "string") {
    return false;
  }

  const trimmedLink = link.trim().toLowerCase();

  const validDomains = [
    "www.mercadolivre.com.br",
    "mercadolivre.com.br",
    "produto.mercadolivre.com.br",
    "articulo.mercadolibre.com.br",
    "www.mercadolibre.com.br",
    "mercadolibre.com.br",
  ];

  const linkToCheck = trimmedLink.startsWith("http")
    ? trimmedLink
    : `https://${trimmedLink}`;
  try {
    const url = new URL(linkToCheck);
    const hostname = url.hostname.toLowerCase();
    return validDomains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
  } catch {
    return validDomains.some((domain) => trimmedLink.includes(domain));
  }
}

/**
 * Extrai o MLB (ID do produto) de um link do Mercado Livre.
 * 
 * @param link - Link do produto ou MLB direto
 * @returns MLB extraído ou null se não encontrado
 */
export function extractMlbFromLink(link: string): string | null {
  if (!link || typeof link !== "string") {
    return null;
  }

  const trimmedLink = link.trim();

  const pattern = /(MLB|MLBU)-?\d{10}/i;
  const match = trimmedLink.match(pattern);

  if (match) {
    return match[0].toUpperCase().replace("-", "");
  }

  return null;
}
