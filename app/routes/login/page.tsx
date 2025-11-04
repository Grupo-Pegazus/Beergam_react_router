import FormModal from "~/features/auth/components/FormModal/FormModal";
import PageLayout from "~/features/auth/components/PageLayout/PageLayout";

export default function LoginPage() {
  return (
    <PageLayout tailwindClassName="flex items-center justify-center">
      <FormModal />
    </PageLayout>
  );
}
