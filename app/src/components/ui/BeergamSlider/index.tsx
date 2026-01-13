import Paper from "@mui/material/Paper";
import type { PropsWithChildren } from "react";
import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/zoom";
import { Pagination, Zoom } from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperProps } from "swiper/react";
interface BeergamSliderProps extends SwiperProps {
  slides: React.ReactNode[];
}

const DefaultProps: SwiperProps = {
  spaceBetween: 10,
  slidesPerView: 1,
  modules: [Pagination, Zoom],
};

export function BeergamSlider({ slides, ...props }: BeergamSliderProps) {
  // Props passadas sobrescrevem os defaults
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const mergedProps = { ...DefaultProps, ...props };
  const paginationAmmount =
    mergedProps.slidesPerView &&
    typeof mergedProps.slidesPerView === "number" &&
    mergedProps.slidesPerView > 1
      ? Math.max(1, slides.length - mergedProps.slidesPerView + 1)
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
          <SwiperSlide className="p-2" key={index}>
            <Paper
              sx={{
                backgroundColor: "var(--color-beergam-section-background)",
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
