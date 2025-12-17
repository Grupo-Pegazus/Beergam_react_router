import { useGlobalLoading } from "~/features/auth/hooks/useGlobalLoading";
import Loading from "~/src/assets/loading";

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
    </div>
  );
}
