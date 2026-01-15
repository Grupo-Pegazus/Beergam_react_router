import Paper from "@mui/material/Paper";
import type { PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/zoom";
import { Pagination, Zoom } from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperProps } from "swiper/react";

interface BeergamSliderProps extends SwiperProps {
  slides: React.ReactNode[];
  slidesClassName?: string;
}

const DefaultProps: SwiperProps = {
  spaceBetween: 10,
  slidesPerView: 1,
  modules: [Pagination, Zoom],
};

/**
 * Calcula o slidesPerView atual baseado nos breakpoints e no tamanho da tela
 */
function getCurrentSlidesPerView(
  breakpoints: SwiperProps["breakpoints"],
  defaultSlidesPerView: number | "auto" | undefined
): number {
  if (!breakpoints || typeof window === "undefined") {
    return typeof defaultSlidesPerView === "number" ? defaultSlidesPerView : 1;
  }

  const width = window.innerWidth;
  const breakpointKeys = Object.keys(breakpoints)
    .map((key) => parseInt(key))
    .sort((a, b) => b - a); // Ordena do maior para o menor

  // Encontra o breakpoint mais adequado para a largura atual
  for (const breakpoint of breakpointKeys) {
    if (width >= breakpoint) {
      const breakpointConfig = breakpoints[breakpoint];
      if (
        breakpointConfig &&
        typeof breakpointConfig === "object" &&
        "slidesPerView" in breakpointConfig
      ) {
        const slidesPerView = breakpointConfig.slidesPerView;
        return typeof slidesPerView === "number" ? slidesPerView : 1;
      }
    }
  }

  return typeof defaultSlidesPerView === "number" ? defaultSlidesPerView : 1;
}

export function BeergamSlider({
  slides,
  slidesClassName,
  ...props
}: BeergamSliderProps) {
  // Props passadas sobrescrevem os defaults
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [currentSlidesPerView, setCurrentSlidesPerView] = useState<number>(1);
  const mergedProps = { ...DefaultProps, ...props };

  // Calcula o slidesPerView atual baseado nos breakpoints
  useEffect(() => {
    const calculateSlidesPerView = () => {
      const slidesPerView = getCurrentSlidesPerView(
        mergedProps.breakpoints,
        mergedProps.slidesPerView
      );
      setCurrentSlidesPerView(slidesPerView);
    };

    // Calcula inicialmente
    calculateSlidesPerView();

    // Recalcula quando a janela for redimensionada
    if (typeof window !== "undefined") {
      window.addEventListener("resize", calculateSlidesPerView);
      return () => window.removeEventListener("resize", calculateSlidesPerView);
    }
  }, [mergedProps.breakpoints, mergedProps.slidesPerView]);

  // Calcula a quantidade de paginação baseada no slidesPerView atual
  const paginationAmmount =
    currentSlidesPerView > 1
      ? Math.max(1, slides.length - currentSlidesPerView + 1)
      : slides.length;
  return (
    <>
      <Swiper
        onSlideChange={(swiper) => {
          console.log("Slide changed to:", swiper.activeIndex);
          setActiveIndex(swiper.activeIndex);
        }}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        zoom={{
          limitToOriginalSize: true,
        }}
        {...mergedProps}
        pagination={false}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            className={`p-2 ${slidesClassName ?? "bg-beergam-section-background"}`}
            key={index}
          >
            <Paper
              sx={{
                height: "100%",
              }}
            >
              <div className="max-h-[100%] overflow-scroll">{slide}</div>
            </Paper>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex items-center p-4 justify-center gap-2 w-full">
        {paginationAmmount > 1 &&
          Array.from({ length: paginationAmmount }).map((_, index) => (
            <button
              onClick={() => swiperRef.current?.slideTo(index)}
              key={index}
              className={`swiper-pagination-bullet hover:opacity-100! ${
                activeIndex === index ? "swiper-pagination-bullet-active" : ""
              }`}
            >
              <p className="text-beergam-white! text-[10px]!">{index + 1}</p>
            </button>
          ))}
      </div>
    </>
  );
}

BeergamSlider.displayName = "BeergamSlider";

/**
 * Wrapper para BeergamSlider com tamanho fixo
 * Use este componente quando o slider estiver dentro de Modals ou containers dinâmicos
 */
export function BeergamSliderWrapper({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`w-full h-[300px] md:h-[400px] min-h-[300px] md:min-h-[400px] mb-16 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

BeergamSliderWrapper.displayName = "BeergamSliderWrapper";
