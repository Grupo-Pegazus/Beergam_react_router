import { Link } from "react-router";
import AccountView from "~/features/system/components/desktop/AccountView";
import Svg from "~/src/assets/svgs/_index";
import ParticlesBackground from "~/src/components/utils/ParticlesBackground";
import { CDN_IMAGES } from "~/src/constants/cdn-images";
function CardComponent({ title, value }: { title: string; value: string }) {
  return (
    <div className="relative w-full max-w-44 h-26 group">
      <div className="w-full bg-amber-100 h-full flex z-1 relative rounded-bl-xl rounded-tl-xl">
        <div className="w-3.5 bg-beergam-orange rounded-bl-xl rounded-tl-xl h-full"></div>
        <div className="p-3.5 w-full">
          <div className="flex gap-2 items-center mb-2">
            <h3 className="font-medium! text-beergam-black-blue">{title}</h3>
            <Svg.question_mark />
          </div>
          <h2 className="font-medium! text-beergam-blue-primary group-hover:text-beergam-blue">
            {value}
          </h2>
        </div>
      </div>
      <div className="w-42 h-20 bg-beergam-blue-plano absolute top-10 right-4 z-0"></div>
    </div>
  );
}

export default function PageLayout({
  children,
  tailwindClassName,
  hideHeader = false,
}: {
  children: React.ReactNode;
  tailwindClassName?: string;
  hideHeader?: boolean;
}) {
  return (
    <>
      <main className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
        {!hideHeader && (
          <header className="w-full p-4 px-4 md:px-8 flex z-99 items-center justify-between">
            <Link to="/" className="w-10 h-10 cursor-pointer hover:opacity-80">
              <img
                src={CDN_IMAGES.BERGAMOTA_LOGO}
                alt="beergam_flower_logo"
                className="w-full h-full object-contain"
              />
            </Link>
            <AccountView showMarketplaces={false} />
          </header>
        )}
        <div className="bg-beergam-secundary absolute top-0 left-0 w-full h-full -z-1000"></div>
        <div className="absolute -z-10 hidden lg:block top-0 left-0 max-w-screen max-h-screen overflow-hidden w-full h-full opacity-50">
          <div className="absolute top-0 left-0 w-3/4 max-w-6xl object-contain">
            <img
              src={CDN_IMAGES.AUTH_WORLD_BG}
              alt="world_bg"
              className="w-full h-full max-w-7xl max-h-screen-2xl object-cover"
            />
          </div>
          <div className="absolute max-h-240 opacity-0 max-w-80 w-[16%] h-10/12 right-0 top-1/2 -translate-y-1/2 sm:opacity-100">
            <div className="absolute right-[-30%] top-[-35%] w-[190%] h-[45%] skew-x-15 skew-y-10">
              <img
                src={CDN_IMAGES.AUTH_GRAPH}
                alt="logo"
                className="absolute top-2/6 right-2/4 w-full h-full z-5"
              />
              <div className="absolute top-[42%] right-[62%] w-[90%] h-[90%] bg-beergam-blue-plano z-3 rounded-2xl opacity-50"></div>
            </div>
            <div className="absolute right-2/5 top-[10%] w-[85%] aspect-square max-w-full h-[35%] skew-x-15 skew-y-10">
              <img
                src={CDN_IMAGES.AUTH_CALENDAR}
                alt="logo"
                className="absolute top-2/6 right-2/4 w-full h-full z-5"
              />
              <div className="absolute top-[42%] right-[62%] w-[90%] h-[90%] bg-beergam-blue-plano z-3 rounded-2xl opacity-50"></div>
            </div>

            <div className="absolute right-[90%] bottom-[-10%] w-[85%] max-w-44 h-[55%] flex flex-col gap-4 skew-x-15 skew-y-10">
              <CardComponent title="Impressões" value="126.1k" />
              <CardComponent title="Cliques" value="4.4k" />
              <CardComponent title="CTR" value="3,47%" />
            </div>
            <div className="absolute right-[35%] bottom-[8%] w-[55%] max-w-44 h-[35%] skew-x-15 skew-y-10">
              <img src={CDN_IMAGES.AUTH_CARD} alt="" />
            </div>
          </div>
        </div>
        <div
          className={`w-full  max-h-[90%] md:max-h-full z-50 relative h-full ${tailwindClassName}`}
        >
          {children}
        </div>
      </main>
      <ParticlesBackground />
    </>
  );
}
