import type { ApiResponse } from "~/features/apiClient/typings";
import FormModal from "~/features/auth/components/FormModal/FormModal";
import PageLayout from "~/features/auth/components/PageLayout/PageLayout";

export default function LoginPage({
  actionResponse,
}: {
  actionResponse: ApiResponse<any>;
}) {
  return (
    <PageLayout>
      <FormModal actionResponse={actionResponse} />
    </PageLayout>
  );
}
