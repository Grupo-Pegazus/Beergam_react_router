import meli from "~/src/img/Mercado-Livre-Icon-Logo-Vector.svg-.png";
import shopee from "~/src/img/shopee.png";
import EmpresaCard from ".";
export default function EmpresaCardsGroup() {
  const cards = [
    <EmpresaCard.wrapper
      key="amazon"
      style={{
        flex: 1,
        zIndex: 1,
        background:
          "linear-gradient(270deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
      }}
    >
      <EmpresaCard.breve />
      <EmpresaCard.logo logo={meli} alt="Logo da Amazon" width="fit-content" />
      <EmpresaCard.text text="Gestão Sem Barreiras" />
      <EmpresaCard.description
        style={{ fontSize: "14px", lineHeight: "18px" }}
        description="Automatize seu estoque, pedidos e preços na Amazon com uma conexão inteligente e eficiente."
      />
    </EmpresaCard.wrapper>,

    <EmpresaCard.wrapper key="shoppe" style={{ flex: 1, zIndex: 1 }}>
      <EmpresaCard.breve />
      <EmpresaCard.logo
        logo={shopee}
        alt="Logo da Shoppe"
        width="fit-content"
      />
      <EmpresaCard.text text="O Único Expecializado" />
      <EmpresaCard.description
        style={{ fontSize: "14px", lineHeight: "18px" }}
        description="Só a Beergam dá a você total controle sobre sua conta na Shopee, com dados completos e ferramentas poderosas. Nenhum outro sistema oferece isso!"
      />
    </EmpresaCard.wrapper>,

    <EmpresaCard.wrapper key="ml" style={{ flex: 1 }}>
      <EmpresaCard.logo logo={meli} alt="Logo do Mercado Livre" />
      <EmpresaCard.text text="100% Integrado" />
      <EmpresaCard.description description="Nós já estamos do lado do maior marketplace da América Latina. Sincronize sua operação, aumente sua performance e venda sem limites" />
    </EmpresaCard.wrapper>,

    <EmpresaCard.wrapper key="shein" style={{ flex: 1, zIndex: 1 }}>
      <EmpresaCard.breve style={{ right: "10px", left: "auto" }} />
      <EmpresaCard.logo logo={shopee} alt="Logo da Shein" width="fit-content" />
      <EmpresaCard.text text="Plataforma Unificada" />
      <EmpresaCard.description
        style={{ fontSize: "14px", lineHeight: "18px" }}
        description="Acesse um dos maiores marketplaces de moda com gestão automatizada e controle total das suas vendas."
      />
    </EmpresaCard.wrapper>,

    <EmpresaCard.wrapper
      key="magalu"
      style={{
        flex: 1,
        zIndex: 1,
        background:
          "linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
      }}
    >
      <EmpresaCard.breve style={{ right: "10px", left: "auto" }} />
      <EmpresaCard.logo
        logo={shopee}
        alt="Logo da Magalu"
        width="fit-content"
      />
      <EmpresaCard.text text="Integração Total" />
      <EmpresaCard.description
        style={{ fontSize: "14px", lineHeight: "18px" }}
        description="Gerencie seus anúncios, pedidos e estoque na Magalu sem esforço, tudo em um só sistema."
      />
    </EmpresaCard.wrapper>,
  ];
  return <div className="grid grid-cols-4 gap-4">{cards}</div>;
}
