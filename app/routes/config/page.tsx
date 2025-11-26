import ParticlesBackground from "~/src/components/utils/ParticlesBackground";
import ConfigHeader from "./components/ConfigHeader";
export default function ConfigPage() {
  return (
    <main className="min-h-full bg-beergam-orange overflow-x-hidden">
      <ConfigHeader />
      <ParticlesBackground />
    </main>
  );
}
