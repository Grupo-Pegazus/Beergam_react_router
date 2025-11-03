import { Link, useLocation } from "react-router";

const SECTION_MAP: Record<string, { label: string; singular?: string }> = {
    anuncios: { label: "Anúncios", singular: "anúncio" },
    vendas: { label: "Vendas", singular: "venda" },
};

function toTitleCase(text: string) {
    return text
        .replace(/[-_]/g, " ")
        .replace(/\[(.*)\]/, "$1")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function useBreadcrumbItems() {
    const location = useLocation();
    const pathname = location.pathname.replace(/\/?$/, "");
    const segments = pathname.split("/").filter(Boolean);
  
    // Encontrar o índice de "interno" e trabalhar a partir dele
    const internoIdx = segments.indexOf("interno");
    const afterInterno = internoIdx >= 0 ? segments.slice(internoIdx + 1) : segments;
  
    const items: { label: string; path: string; isLast: boolean }[] = [];
  
    const basePath = "/interno";
    // Raiz do módulo interno
    if (afterInterno.length === 0) {
      items.push({ label: "Início", path: basePath, isLast: true });
      return items;
    }
  
    items.push({ label: "Início", path: basePath, isLast: false });
  
    // Primeira seção (ex.: anuncios, vendas)
    const section = afterInterno[0];
    const sectionConf = SECTION_MAP[section];
    const sectionLabel = sectionConf?.label ?? toTitleCase(section);
    const sectionPath = `${basePath}/${section}`;
    if (afterInterno.length === 1) {
      items.push({ label: sectionLabel, path: sectionPath, isLast: true });
      return items;
    }
    items.push({ label: sectionLabel, path: sectionPath, isLast: false });
  
    // Detalhe (ex.: /interno/anuncios/:id)
    const singular = sectionConf?.singular ?? sectionLabel.toLowerCase();
    items.push({
      label: `Detalhe de ${singular}`,
      path: `${sectionPath}/${afterInterno[1]}`,
      isLast: true,
    });
  
    return items;
  }

export default function SystemBreadcrumb() {
    const items = useBreadcrumbItems();
  
    return (
      <nav aria-label="breadcrumb" style={{ fontSize: "12px", color: "#6b7280" }}>
        {items.map((item, idx) => (
          <span key={item.path}>
            {item.isLast ? (
              <span style={{ color: "#111827", fontWeight: 500 }}>{item.label}</span>
            ) : (
              <Link
                to={item.path}
                style={{
                  color: "#6b7280",
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            )}
            {idx < items.length - 1 && <span style={{ margin: "0 8px" }}>/</span>}
          </span>
        ))}
      </nav>
    );
  }