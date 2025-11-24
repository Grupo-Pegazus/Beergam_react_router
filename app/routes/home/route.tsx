import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "~/features/auth/hooks";
import { authService } from "~/features/auth/service";
import { plansService } from "~/features/plans/service";
import type { Plan } from "~/features/user/typings/BaseUser";
import BeergamButton from "~/src/components/utils/BeergamButton";
import PlansGrid from "../../features/plans/components/PlansGrid";
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
  const { data, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: plansService.getPlans,
  });
  const { authInfo } = useAuth();
  const navigate = useNavigate();
  const getSubscription = useMutation({
    mutationFn: authService.getSubscription,
  });
  function handlePlanSelect(plan: Plan) {
    if (!authInfo.success) {
      //Quer dizer que o usuário não está logado
      navigate("/login", { state: { plan } });
      return;
    } else {
      getSubscription.mutate(undefined, {
        onSuccess: (data) => {
          if (!data.success) {
            throw new Error(data.message);
          }
          toast.success("Plano selecionado com sucesso");
          navigate("/interno/subscription", { state: { plan } });
        },
        onError: () => {
          navigate("/login", { state: { plan } });
        },
      });
      return;
    }
  }
  return (
    <div className="min-h-screen bg-beergam-blue-lara text-white">
      <LandingHeader />
      <LandingHero />
      <LandingFeatures />
      <LandingAbout />
      <section
        id="planos"
        className="w-full py-24 bg-beergam-blue-primary-dark"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Conheça nossos planos</h2>
            <p>
              Desbloqueie todo o potencial do Beergam com nossos planos premium.
              Escolha o que melhor se adapta ao seu negócio.
            </p>
          </div>
          <PlansGrid
            plans={data?.data as Plan[]}
            isLoading={isLoading}
            onPlanSelect={(plan) => handlePlanSelect(plan)}
          />
        </div>
      </section>
      <section className="w-full text-center py-24 flex flex-col items-center justify-center gap-6">
        <h1>
          Teste o Beergam{" "}
          <span className="text-beergam-orange">gratuitamente</span>.
        </h1>
        <p>O destino do seu E-Commerce está aqui.</p>
        <BeergamButton
          title="Testar Agora"
          mainColor="beergam-orange"
          animationStyle="slider"
          className="text-2xl"
          link="/registro"
        ></BeergamButton>
      </section>
      <LandingFooter />
    </div>
  );
}
