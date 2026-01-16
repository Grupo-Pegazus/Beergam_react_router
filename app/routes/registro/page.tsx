import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import RegistroForm from "./components/RegistroForm";

// interface RegistroPageProps {
//   actionData: ApiResponse | null;
// }

export default function RegistroPage() {
  return (
    <PageLayout
      tailwindClassName="max-h-full! overflow-y-auto! mt-0!"
      hideHeader={true}
      paddingTop={false}
    >
      <div className="w-full flex flex-col justify-between h-auto lg:flex-row-reverse lg:h-lvh">
        <div className="w-full lg:w-2/3">
          <RegistroForm />
        </div>
        <div className="w-full hidden lg:flex lg:w-[60%] h-full items-center justify-center text-beergam-white">
          <div className="flex flex-col gap-4 p-5 rounded-xl h-2/5 text-center">
            <h2 className="!font-black">
              Gestão do seu E-Commerce grátis por 14 dias
            </h2>
            <h3 className="font-medium mx-auto lg:w-2/3">
              Controle todas as áreas do seu e-commerce em um só lugar e{" "}
              <span className="font-black text-lg! lg:text-sm! xl:text-xl! 2xl:text-2xl!">
                tome decisões com confiança
              </span>
              .
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
