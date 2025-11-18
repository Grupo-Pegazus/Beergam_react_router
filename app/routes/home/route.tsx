import { useQuery } from "@tanstack/react-query";
import { plansService } from "~/features/plans/service";
import type { Plan } from "~/features/user/typings/BaseUser";
import PlansGrid from "../subscription/components/PlansGrid";
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
  const { data, isLoading, error } = useQuery({
    queryKey: ["plans"],
    queryFn: plansService.getPlans,
  });
  return (
    <div className="min-h-screen bg-beergam-blue-lara">
      <LandingHeader />
      <LandingHero />
      <LandingFeatures />
      <LandingAbout />
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PlansGrid
          plans={data?.data as Plan[]}
          isLoading={isLoading}
          onPlanSelect={() => {}}
        />
      </section>
      <LandingFooter />
    </div>
  );
}
