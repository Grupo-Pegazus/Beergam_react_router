import { Fields } from "~/src/components/utils/_fields";

export default function FormModal() {
  return (
    <div className="h-full bg-beergam-white p-8 rounded-xl gap-4 flex flex-col">
      <h1 className="text-beergam-blue-primary">Cadastre-se</h1>
      <div>
        <Fields.wrapper>
          <Fields.label
            text="DIGITE SEU ENDEREÇO DE E-MAIL"
            tailWindClasses="!text-beergam-gray-light capitalize"
          />
          <Fields.input
            type="text"
            name="email
          "
            placeholder="Email"
            value=""
          />
        </Fields.wrapper>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Fields.wrapper>
          <Fields.label text="NOME COMPLETO / RAZÃO SOCIAL"></Fields.label>
          <Fields.input value={""}></Fields.input>
        </Fields.wrapper>
        <Fields.wrapper>
          <Fields.select
            value={"CPF"}
            options={[
              { value: "CPF", label: "CPF" },
              { value: "CNPJ", label: "CNPJ" },
            ]}
            style={{ width: "100px", position: "absolute", top: "-20px" }}
          ></Fields.select>
          <Fields.label
            text="DOCUMENTO"
            tailWindClasses="opacity-0 relative z-[-1]"
          ></Fields.label>
          <Fields.input value={""} placeholder="Documento"></Fields.input>
        </Fields.wrapper>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Fields.wrapper>
          <Fields.label text="DIGITE SUA SENHA" />
          <Fields.input value={""} type="password"></Fields.input>
        </Fields.wrapper>
        <Fields.wrapper>
          <Fields.label text="CONFIRME SUA SENHA" />
          <Fields.input value={""} type="password"></Fields.input>
        </Fields.wrapper>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Fields.wrapper>
          <Fields.label text="CÓDIGO DE INDICAÇÃO" />
          <Fields.input value={""}></Fields.input>
        </Fields.wrapper>
        <Fields.wrapper>
          <Fields.label text="WHATSAPP" />
          <Fields.input value={""}></Fields.input>
        </Fields.wrapper>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Fields.wrapper>
          <Fields.label text="COMO CONHECEU A BEERGAM" />
          <Fields.select
            value={""}
            options={[{ value: "aa", label: "aa" }]}
          ></Fields.select>
        </Fields.wrapper>
        <Fields.wrapper>
          <Fields.label text="FATURAMENTO MENSAL" />
          <Fields.select
            value={""}
            options={[{ value: "aa", label: "aa" }]}
          ></Fields.select>
        </Fields.wrapper>
      </div>
      <button className="p-2 rounded-2xl bg-beergam-orange text-beergam-white roundend hover:bg-beergam-blue-primary">
        Criar conta grátis
      </button>
    </div>
  );
}
