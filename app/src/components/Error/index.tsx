import { useCallback } from "react";
import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import { useAuthUser } from "~/features/auth/context/AuthStoreContext";
import { CDN_IMAGES } from "~/src/constants/cdn-images";
import BeergamButton from "../utils/BeergamButton";
import type { TError } from "./typings";
export default function Error({ error }: { error: TError }) {
  const user = useAuthUser();
  function ErrorContent({
    subtitle,
    description,
    image,
  }: {
    subtitle: string;
    description: string;
    image: keyof typeof CDN_IMAGES;
  }) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-4 ">
        <h1 className="text-center text-beergam-white">Ops!</h1>
        <h2 className="text-center text-beergam-white">{subtitle}</h2>
        <h3 className="text-center text-beergam-white">{description}</h3>
        <div className="w-[45%] h-auto max-w-96 max-h-96 relative">
          <img
            src={CDN_IMAGES[image]}
            alt="Lara Worker"
            className="w-full h-full object-contain relative z-10"
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <BeergamButton
            link="/"
            icon="home_solid"
            title="Voltar para a página inicial"
          />
          {user && (
            <BeergamButton
              link="/interno"
              icon="arrow_uturn_right"
              mainColor="beergam-orange"
              title="Voltar para o sistema"
            />
          )}
        </div>
      </div>
    );
  }
  const handleError = useCallback(() => {
    switch (error) {
      case "NOT_FOUND":
        return (
          <ErrorContent
            subtitle="Parece que a página que você está procurando não existe."
            description="Verifique se a URL está correta ou contate o suporte."
            image="LARA_CONFUSED"
          />
        );
      case "INTERNAL_SERVER_ERROR":
        return (
          <ErrorContent
            subtitle="Erro Interno do Servidor"
            description="Ocorreu um erro ao processar a requisição. Tente novamente mais tarde ou contate o suporte."
            image="LARA_DOWNED"
          />
        );
      case "MAINTENANCE":
        return (
          <ErrorContent
            subtitle="Manutenção em Andamento"
            description="Estamos realizando algumas atualizações no sistema. Volte mais tarde."
            image="LARA_WORKER"
          />
        );
    }
  }, [error]);
  return (
    <PageLayout tailwindClassName="flex items-center justify-center">
      {handleError()}
    </PageLayout>
  );
}
