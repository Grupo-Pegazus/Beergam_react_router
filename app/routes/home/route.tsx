import type { Route } from "./+types/route";
import LandingAbout from "./components/LandingAbout";
import LandingFeatures from "./components/LandingFeatures";
import LandingFooter from "./components/LandingFooter";
import LandingHeader from "./components/LandingHeader";
import LandingHero from "./components/LandingHero";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | ERP Completo para E-commerce" },
    {
      name: "description",
      content:
        "Gerencie seu e-commerce com inteligência. Simplifique processos, automatize vendas e expanda seu negócio com a plataforma mais completa para vendedores de e-commerce.",
    },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-beergam-blue-lara">
      <LandingHeader />
      <LandingHero />
      <LandingFeatures />
      <LandingAbout />
      <LandingFooter />
    </div>
  );
}
