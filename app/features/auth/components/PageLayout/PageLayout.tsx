import { Box, ClickAwayListener, Fade } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLogoutFlow } from "~/features/auth/hooks/useLogoutFlow";
import authStore from "~/features/store-zustand";
import { isMaster } from "~/features/user/utils";
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
  const user = authStore.use.user();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { isLoggingOut, logout } = useLogoutFlow({
    redirectTo: "/login",
  });
  // Função para gerar sigla customizada com base nas regras fornecidas
  function generateUserInitials(name: string): string {
    if (!name) return "";
    const names = name.trim().split(/\s+/);
    if (names.length > 1) {
      // Nome composto: pega primeira letra do primeiro (maiúscula) e do segundo (minúscula)
      const first = names[0][0]?.toUpperCase() ?? "";
      const second = names[1][0]?.toLowerCase() ?? "";
      return `${first}${second}`;
    } else {
      // Nome simples: pega primeira letra (maiúscula) e última (minúscula)
      const onlyName = names[0];
      const first = onlyName[0]?.toUpperCase() ?? "";
      const last = onlyName[onlyName.length - 1]?.toLowerCase() ?? "";
      return `${first}${last}`;
    }
  }
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
            {user && (
              <div className="flex items-center gap-2">
                <p className="text-beergam-white text-2xl font-bold">
                  Bem-vindo,{" "}
                  <span className="text-beergam-blue-primary">{user.name}</span>
                  !
                </p>
                <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
                  <Box sx={{ position: "relative" }}>
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className={`relative size-10 shadow-[2.5px_5px_5px_0px_rgba(0,0,0,0.65)] hover:translate-y-[2px] hover:shadow-transparent flex items-center text-xl! justify-center border ${menuOpen ? "shadow-transparent! translate-y-[2px]!" : ""} text-beergam-white bg-beergam-blue-primary border-beergam-white rounded-full`}
                    >
                      {generateUserInitials(user.name)}
                    </button>
                    <Fade in={menuOpen} timeout={200}>
                      <div
                        className={`absolute p-2 top-12 w-[200px] right-4 bg-beergam-blue-primary rounded-xl shadow-[2.5px_5px_5px_0px_rgba(0,0,0,0.65)] border border-beergam-white`}
                      >
                        <div className="text-left">
                          <p className="text-beergam-white text-sm! font-bold!">
                            {user.name}
                          </p>
                          <p className="text-beergam-gray-light">
                            {isMaster(user) ? user.details?.email : user.pin}
                          </p>
                        </div>
                        <hr className="my-2 border-beergam-white" />
                        <button
                          onClick={() => {
                            if (!menuOpen || isLoggingOut) return;
                            navigate("/interno/config");
                          }}
                          className={`flex mb-2 items-center px-2 py-1 rounded-lg gap-2 justify-between w-full hover:bg-beergam-white/10 ${isLoggingOut ? "opacity-50! cursor-not-allowed!" : ""} ${!menuOpen ? "pointer-events-none! cursor-auto!" : ""}`}
                        >
                          <p className="text-beergam-white text-sm!">
                            Configurações
                          </p>
                          <Svg.cog_8_tooth tailWindClasses="text-beergam-white size-6" />
                        </button>
                        <button
                          onClick={() => {
                            if (!menuOpen || isLoggingOut) return;
                            logout();
                          }}
                          className={`flex items-center px-2 py-1 rounded-lg gap-2 justify-between w-full hover:bg-beergam-white/10 ${isLoggingOut ? "opacity-50! cursor-not-allowed!" : ""} ${!menuOpen ? "pointer-events-none! cursor-auto!" : ""}`}
                        >
                          <p className="text-beergam-white text-sm!">Sair</p>
                          <Svg.logout tailWindClasses="text-beergam-white size-6" />
                        </button>
                      </div>
                    </Fade>
                  </Box>
                </ClickAwayListener>
              </div>
            )}
          </header>
        )}
        <div className="bg-beergam-orange absolute top-0 left-0 w-full h-full -z-1000"></div>
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
