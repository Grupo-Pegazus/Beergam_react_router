import FormModal from "~/features/auth/components/FormModal/FormModal";
export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-beergam-orange-dark">
      <FormModal formType="login" />
    </div>
  );
}
