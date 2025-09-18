import FormModal from "~/features/auth/components/FormModal/FormModal";
import calendar from "~/src/img/auth/calendar.webp";
import world_bg from "~/src/img/auth/world_bg.webp";
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
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-beergam-orange-light to-beergam-orange to-65% ">
      <div className="absolute top-0 left-0 max-w-screen max-h-screen w-full h-full opacity-70">
        <img
          src={world_bg}
          alt="world_bg"
          className="absolute top-0 left-0 w-full h-full max-w-screen-xl max-h-screen-2xl object-cover"
        />
        <div>
          <img
            src={calendar}
            alt="logo"
            className="absolute top-10 right-20 skew-x-[15deg] skew-y-[20deg] w-3xs h-80 z-[5]"
          />
          <div className="absolute top-16 right-28 skew-x-[15deg] skew-y-[20deg] w-[14.5rem] h-72 bg-beergam-blue-plano z-[3] rounded-2xl opacity-50"></div>
        </div>
      </div>
      <FormModal formType="login" actionError={actionError} />
    </div>
  );
}
