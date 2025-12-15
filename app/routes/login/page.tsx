import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import FormModal from "~/routes/login/components/FormModal/FormModal";

export default function LoginPage() {
  return (
    <PageLayout
      tailwindClassName="flex md:items-center max-h-full! overflow-y-auto! md:justify-center"
      hideHeader={true}
    >
      <FormModal />
    </PageLayout>
  );
}
