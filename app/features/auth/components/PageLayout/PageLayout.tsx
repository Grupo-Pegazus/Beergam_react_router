import Svg from "~/src/assets/svgs";
import ParticlesBackground from "~/src/components/utils/ParticlesBackground";
import calendar from "~/src/img/auth/calendar.webp";
import card from "~/src/img/auth/card.webp";
import graph from "~/src/img/auth/graph.webp";
import world_bg from "~/src/img/auth/world_bg.webp";
import beergam_flower_logo from "~/src/img/beergam_flower_logo.webp";
function CardComponent({ title, value }: { title: string; value: string }) {
  return (
    <div className="relative w-full max-w-44 h-26 group">
      <div className="w-full bg-amber-100 h-full flex z-1 relative rounded-bl-xl rounded-tl-xl">
        <div className="w-3.5 bg-beergam-orange rounded-bl-xl rounded-tl-xl h-full"></div>
        <div className="p-3.5 w-full">
          <div className="flex gap-2 items-center mb-2">
            <h3 className="!font-medium text-beergam-black-blue">{title}</h3>
            <Svg.question_mark />
          </div>
          <h2 className="!font-medium text-beergam-blue-primary group-hover:text-beergam-blue">
            {value}
          </h2>
        </div>
      </div>
      <div className="w-[10.5rem] h-20 bg-beergam-blue-plano absolute top-10 right-4 z-0"></div>
    </div>
  );
}

export default function PageLayout({
  children,
  tailwindClassName,
}: {
  children: React.ReactNode;
  tailwindClassName?: string;
}) {
  return (
    <>
      <main className="flex min-h-full bg-beergam-orange">
        <data className="absolute top-2 left-2 w-30 h-30 z-10">
          <img
            src={beergam_flower_logo}
            alt="beergam_flower_logo"
            className="w-full h-full object-contain"
          />
        </data>
        <div className="absolute top-0 left-0 max-w-screen max-h-screen overflow-hidden w-full h-full opacity-50">
          <div className="absolute top-0 left-0 w-3/4 max-w-6xl object-contain">
            <img
              src={world_bg}
              alt="world_bg"
              className="w-full h-full max-w-screen-xl max-h-screen-2xl object-cover"
            />
          </div>
          <div className="absolute max-h-[60rem] opacity-0 max-w-80 w-[16%] h-10/12 right-0 top-1/2 -translate-y-1/2 sm:opacity-100">
            <div className="absolute right-[-30%] top-[-35%] w-[190%] h-[45%] skew-x-[15deg] skew-y-[10deg]">
              <img
                src={graph}
                alt="logo"
                className="absolute top-2/6 right-2/4 w-full h-full z-[5]"
              />
              <div className="absolute top-[42%] right-[62%] w-[90%] h-[90%] bg-beergam-blue-plano z-[3] rounded-2xl opacity-50"></div>
            </div>
            <div className="absolute right-2/5 top-[10%] w-[85%] aspect-square max-w-full h-[35%] skew-x-[15deg] skew-y-[10deg]">
              <img
                src={calendar}
                alt="logo"
                className="absolute top-2/6 right-2/4 w-full h-full z-[5]"
              />
              <div className="absolute top-[42%] right-[62%] w-[90%] h-[90%] bg-beergam-blue-plano z-[3] rounded-2xl opacity-50"></div>
            </div>

            <div className="absolute right-[90%] bottom-[-10%] w-[85%] max-w-44 h-[55%] flex flex-col gap-4 skew-x-[15deg] skew-y-[10deg]">
              <CardComponent title="Impressões" value="126.1k" />
              <CardComponent title="Cliques" value="4.4k" />
              <CardComponent title="CTR" value="3,47%" />
            </div>
            <div className="absolute right-[35%] bottom-[8%] w-[55%] max-w-44 h-[35%] skew-x-[15deg] skew-y-[10deg]">
              <img src={card} alt="" />
            </div>
          </div>
        </div>
        <div className={`w-full min-h-full z-50 ${tailwindClassName}`}>
          {children}
        </div>
      </main>
      <ParticlesBackground />
    </>
  );
}
