import { useEffect } from "react";
import FormModal from "~/features/auth/components/FormModal/FormModal";
import PageLayout from "~/features/auth/components/PageLayout/PageLayout";

export default function LoginPage() {
  useEffect(() => {
    localStorage.removeItem("loginLoading");
  }, []);
  return (
    <PageLayout>
      <FormModal />
    </PageLayout>
  );
}
