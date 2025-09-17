import FormModal from "~/features/auth/components/FormModal/FormModal";
interface ActionData {
  error: boolean;
  message: string;
}
export default function LoginPage({
  actionError,
}: {
  actionError: ActionData;
}) {
  return (
    <div className="flex justify-center items-center h-screen bg-beergam-orange-dark">
      <FormModal formType="login" actionError={actionError} />
    </div>
  );
}
