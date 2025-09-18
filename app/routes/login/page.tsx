import FormModal from "~/features/auth/components/FormModal/FormModal";
import QuestionMark from "~/src/assets/svgs/QuestionMark";
import calendar from "~/src/img/auth/calendar.webp";
import world_bg from "~/src/img/auth/world_bg.webp";
interface ActionData {
  error: boolean;
  message: string;
}

function CardComponent({ title, value }: { title: string; value: string }) {
  return (
    <div className="relative w-44 h-26">
      <div className="w-full bg-amber-100 h-full flex z-1 relative rounded-bl-xl rounded-tl-xl">
        <div className="w-3.5 bg-beergam-orange rounded-bl-xl rounded-tl-xl h-full"></div>
        <div className="p-3.5 w-full">
          <div className="flex gap-2 items-center mb-2">
            <h3 className="!font-medium text-beergam-black-blue">{title}</h3>
            <QuestionMark />
          </div>
          <h1 className="!font-medium !text-beergam-blue-primary">{value}</h1>
        </div>
      </div>
      <div className="w-[10.5rem] h-20 bg-beergam-blue-plano absolute top-10 right-4 z-0"></div>
    </div>
  );
}

export default function LoginPage({
  actionError,
}: {
  actionError: ActionData;
}) {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-beergam-orange-light to-beergam-orange to-65%">
      <div className="absolute top-0 left-0 max-w-screen max-h-screen w-full h-full opacity-50">
        <img
          src={world_bg}
          alt="world_bg"
          className="absolute top-0 left-0 w-full h-full max-w-screen-xl max-h-screen-2xl object-cover"
        />
        <div className="absolute max-h-[60rem] max-w-80 w-[16%] h-10/12 right-0">
          <div className="absolute right-2/5 top-40 w-[85%] aspect-square max-w-full h-[35%] skew-x-[15deg] skew-y-[10deg]">
            <img
              src={calendar}
              alt="logo"
              className="absolute top-2/6 right-2/4 w-full h-full z-[5]"
            />
            <div className="absolute top-[42%] right-[62%] w-[90%] h-[90%] bg-beergam-blue-plano z-[3] rounded-2xl opacity-50"></div>
          </div>
          {/* <div className="absolute right-50 bottom-80 w-3xs skew-x-[15deg] skew-y-[10deg]">
            <CardComponent title="Impressões" value="126.1k" />
          </div>
          <div className="absolute right-44 bottom-50 w-3xs skew-x-[15deg] skew-y-[10deg]">
            <CardComponent title="Cliques" value="4.4k" />
          </div>
          <div className="absolute right-[9.5rem] bottom-20 w-3xs skew-x-[15deg] skew-y-[10deg]">
            <CardComponent title="CTR" value="3,47%" />
          </div> */}
        </div>
      </div>
      <FormModal formType="login" actionError={actionError} />
    </div>
  );
}
