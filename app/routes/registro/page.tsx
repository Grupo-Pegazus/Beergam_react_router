import type { ApiResponse } from "~/features/apiClient/typings";
import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import FormModal from "./components/FormModal";

export default function RegistroPage({
  actionResponse,
}: {
  actionResponse: ApiResponse<any>;
}) {
  return (
    <PageLayout pageType="registro">
      <div className="w-full flex flex-col justify-between h-lvh sm:flex-row-reverse">
        <div className="w-full sm:w-2/5">
          <FormModal />
        </div>
        <div className="w-full sm:w-3/4">
          <h2>Dados do Usuário</h2>
        </div>
      </div>
    </PageLayout>
  );
}
