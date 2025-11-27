import styles from "./ClienteCard.module.css";

interface VendaSummaryProps {
    img?: string;
    name: string;
    doc: string;
}

function VendaSummary({ img, name, doc }: VendaSummaryProps) {
    const formatDocument = (document: string): string => {
        const cleaned = document.replace(/\D/g, '');
        if (cleaned.length === 11) {
            // CPF: 000.000.000-00
            return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (cleaned.length === 14) {
            // CNPJ: 00.000.000/0000-00
            return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        return document;
    };

    const tipoDocumento = doc.replace(/\D/g, '').length === 14 ? 'CNPJ' : 'CPF';
    const docFormatado = formatDocument(doc);

    const getInitials = (nome: string) => {
        const nomes = nome.trim().split(" ").filter(n => n.length > 0);
        const primeira = nomes[0]?.[0] || "";
        const segunda = nomes[1]?.[0] || "";
        return (primeira + segunda).toUpperCase();
    };

    const initials = getInitials(name);

    return (
        <div className={styles.card}>
            <div className={styles.imgInfo}>
                {img ? (
                    <img src={img} alt="Imagem de Perfil" />
                ) : (
                    <div className={`${styles.initialsCircle} font-bold`} style={{ border: "var(--color-beergam-orange) 1px solid", color: "var(--color-beergam-orange)"}}>
                        {initials}
                    </div>
                )}

                <div className={styles.info}>
                    <p className={styles.name}>{name}</p>
                    <p className={styles.doc}>{tipoDocumento}: {docFormatado}</p>
                </div>
            </div>

            <div className={styles.msg}>
                <a href="/">Mensagens | <i className="fa-regular fa-message"></i></a>
            </div>
        </div>
    );
}

export default VendaSummary;
