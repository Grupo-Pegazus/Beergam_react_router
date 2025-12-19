import { useGlobalLoading } from "~/features/auth/hooks/useGlobalLoading";
import Loading from "~/src/assets/loading";
import BeergamButton from "~/src/components/utils/BeergamButton";

/**
 * Componente global de loading spinner que aparece durante transições
 * de navegação importantes (login -> choosen_account, choosen_account -> interno, etc.)
 */
export default function GlobalLoadingSpinner() {
  const { isLoading, message } = useGlobalLoading();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-beergam-white flex flex-col items-center justify-center">
      <Loading color="#183153" size="4rem" />
      <p className="mt-6 text-beergam-blue-primary text-lg font-medium">
        {message}
      </p>
      {message === "Saindo da conta..." && (
        <div className="flex mt-2 flex-col gap-2">
          <p>Problemas ao sair da conta?</p>
          <BeergamButton
            title="Fazer Login Novamente"
            link="/login"
            mainColor="beergam-orange"
            icon="arrow_uturn_right"
          />
        </div>
      )}
    </div>
  );
}
