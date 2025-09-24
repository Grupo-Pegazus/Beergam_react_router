import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import FormModal from "./components/FormModal";

export default function RegistroPage() {
  return (
    <PageLayout pageType="registro">
      <div className="w-full flex flex-col justify-between h-lvh lg:flex-row-reverse">
        <div className="w-full lg:w-2/3">
          <FormModal />
        </div>
        <div className="w-full lg:w-[60%]">
          <h2>Dados do Usuário</h2>
        </div>
      </div>
    </PageLayout>
  );
}
