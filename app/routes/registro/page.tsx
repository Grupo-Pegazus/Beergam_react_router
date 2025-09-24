import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import FormModal from "./components/FormModal";

export default function RegistroPage() {
  return (
    <PageLayout pageType="registro">
      <div className="w-full flex flex-col justify-between h-lvh lg:flex-row-reverse">
        <div className="w-full lg:w-2/3">
          <FormModal />
        </div>
        <div className="w-full lg:w-[60%] h-full flex items-center justify-center text-beergam-white">
          <div className="flex flex-col gap-4 p-5 rounded-xl h-2/5 text-center">
            <h2 className="!font-black">
              Gestão do seu E-Commerce grátis por 14 dias
            </h2>
            <h3 className="font-medium w-2/3 mx-auto">
              Controle todas as áreas do seu e-commerce em um só lugar e{" "}
              <span className="font-black">tome decisões com confiança</span>.
            </h3>
            <h4>
              <span className="font-black">Deixe as planilhas para trás</span> e
              adote uma solução feita para quem quer vender mais e crescer de
              forma estruturada.
            </h4>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
