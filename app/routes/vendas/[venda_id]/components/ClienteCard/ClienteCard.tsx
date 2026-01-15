interface VendaSummaryProps {
  img?: string;
  name: string;
  doc: string;
  docType?: string;
}

function VendaSummary({ img, name, doc, docType }: VendaSummaryProps) {
  const formatDocument = (document: string): string => {
    const cleaned = document.replace(/\D/g, "");
    if (cleaned.length === 11) {
      // CPF: 000.000.000-00
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (cleaned.length === 14) {
      // CNPJ: 00.000.000/0000-00
      return cleaned.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
    }
    return document;
  };

  // If docType is provided, use it. Otherwise determine based on document length or use "Buyer ID" if it's a buyer_id
  const tipoDocumento =
    docType ||
    (doc.includes("@")
      ? "Buyer ID"
      : doc.replace(/\D/g, "").length === 14
        ? "CNPJ"
        : "CPF");
  const docFormatado = formatDocument(doc);

  const getInitials = (nome: string) => {
    const nomes = nome
      .trim()
      .split(" ")
      .filter((n) => n.length > 0);
    const primeira = nomes[0]?.[0] || "";
    const segunda = nomes[1]?.[0] || "";
    return (primeira + segunda).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div className="flex items-center justify-between p-5 rounded-[20px] bg-beergam-section-background! flex-wrap gap-0 max-[488px]:gap-4">
      <div className="flex items-center gap-4">
        {img ? (
          <img src={img} alt="Imagem de Perfil" />
        ) : (
          <div
            className="w-10 h-[38px] flex items-center justify-center rounded-full font-bold"
            style={{
              border: "var(--color-beergam-orange) 1px solid",
              color: "var(--color-beergam-orange)",
            }}
          >
            {initials}
          </div>
        )}

        <div className="border-l border-beergam-section-border! pl-[10px]">
          <p className="font-semibold">{name}</p>
          <p className="text-beergam-typography-secondary!">
            {tipoDocumento}: {docFormatado}
          </p>
        </div>
      </div>

      <div className="flex max-[488px]:w-full max-[488px]:justify-start">
        <a
          href="/"
          className="no-underline text-beergam-typography-secondary! font-semibold select-none"
        >
          Mensagens | <i className="fa-regular fa-message"></i>
        </a>
      </div>
    </div>
  );
}

export default VendaSummary;
