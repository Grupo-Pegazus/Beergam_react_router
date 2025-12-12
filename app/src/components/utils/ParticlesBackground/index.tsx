import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { memo, useEffect, useMemo, useState } from "react";

// Variável global para controlar se já inicializamos o motor
let engineInitialized = false;

const ParticlesBackground = memo(function ParticlesBackground() {
  const [init, setInit] = useState(engineInitialized);

  useEffect(() => {
    // Só inicializa o motor uma vez (singleton pattern)
    if (!engineInitialized) {
      initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      }).then(() => {
        engineInitialized = true;
        setInit(true);
      });
    }
  }, []);

  const particlesLoaded = async (): Promise<void> => {};

  const options: ISourceOptions = useMemo(
    () => ({
      // Configurações das partículas (mantidas como estão)
      particles: {
        number: {
          value: 160,
          density: {
            enable: true,
            valueArea: 800,
          },
        },
        color: {
          value: "#ffffff",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
          polygon: {
            nb_sides: 5,
          },
          image: {
            src: "img/github.svg",
            width: 100,
            height: 100,
          },
        },
        opacity: {
          value: 0.8,
          ramdom: true,
          animation: {
            mode: "random",
            enable: true,
            startValue: "min",
            decay: 0,
            speed: 0.5,
          },
        },
        size: {
          value: 3,
          animation: {
            mode: "random",
            enable: true,
            startValue: "min",
            decay: 0,
            speed: 0.5,
          },
        },
        lineLinked: {
          enable: false,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: true,
          straight: false,
          outModes: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 600,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onHover: {
            enable: true,
            mode: "bubble",
          },
          onclick: {
            enable: true,
            mode: "repulse",
          },
          resize: {
            delay: 0,
            enable: true,
          },
        },
        modes: {
          grab: {
            distance: 400,
            lineLinked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 250,
            size: 0,
            duration: 2,
            opacity: 0,
            speed: 3,
          },
          repulse: {
            distance: 400,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particlesNb: 2,
          },
        },
      },
      retina_detect: true,
    }),
    []
  );

  // Adicione uma classe CSS para posicionar as partículas em um container fixo
  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {init && (
        <Particles
          id="tsparticles"
          key="particles-instance"
          options={options}
          particlesLoaded={particlesLoaded}
        />
      )}
    </div>
  );
});

export default ParticlesBackground;
