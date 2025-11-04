import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import FormModal from "~/routes/login/components/FormModal/FormModal";

export default function LoginPage() {
  return (
    <PageLayout tailwindClassName="flex items-center justify-center">
      <FormModal />
    </PageLayout>
  );
}
