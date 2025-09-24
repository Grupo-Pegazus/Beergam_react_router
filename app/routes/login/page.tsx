import type { ApiResponse } from "~/features/apiClient/typings";
import FormModal from "~/features/auth/components/FormModal/FormModal";
import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import type { IUsuario } from "~/features/user/typings";

export default function LoginPage({
  actionResponse,
}: {
  actionResponse: ApiResponse<IUsuario | null>;
}) {
  return (
    <PageLayout>
      <FormModal actionResponse={actionResponse} />
    </PageLayout>
  );
}
