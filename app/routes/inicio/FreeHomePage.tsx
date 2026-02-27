import { Link } from "react-router";
import authStore from "~/features/store-zustand";
import type { IUser } from "~/features/user/typings/User";
import { isMaster } from "~/features/user/utils";
import Svg from "~/src/assets/svgs/_index";
import BeergamButton from "~/src/components/utils/BeergamButton";
import Section from "~/src/components/ui/Section";
import MainCards from "~/src/components/ui/MainCards";

const FREE_QUICK_ACCESS = [
  {
    label: "Calculadora",
    description: "Calcule custos e margens de lucro",
    icon: "calculator" as const,
    path: "/interno/calculadora",
    color: "beergam-primary",
  },
  {
    label: "Ver planos",
    description: "Desbloqueie todas as funcionalidades",
    icon: "rocket_launch" as const,
    path: "/interno/config?session=Minha%20Assinatura",
    color: "beergam-orange",
  },
] as const;

const LOCKED_FEATURES = [
  { label: "Vendas", icon: "graph" as const },
  { label: "Anúncios", icon: "bag" as const },
  { label: "Produtos", icon: "box" as const },
  { label: "Financeiro", icon: "currency_dollar" as const },
  { label: "Atendimento", icon: "chat" as const },
];

export default function FreeHomePage() {
  const user = authStore.use.user();
  const firstName = user?.name?.split(" ")[0] ?? "usuário";
  const isMasterUser = user && isMaster(user);
  const onboardingDone = isMasterUser
    ? (user as IUser).onboarding_free_plan_completed
    : false;

  return (
    <>
      {/* Hero / Banner de boas-vindas */}
      <Section title="">
        <div className="rounded-2xl bg-linear-to-br from-beergam-primary/10 via-beergam-background-secondary to-beergam-orange/5 border border-beergam-border p-6 flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-beergam-primary/15 flex items-center justify-center shrink-0">
            <Svg.home_solid
              tailWindClasses="text-beergam-primary"
              width="26px"
              height="26px"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <h2 className="text-xl font-bold text-beergam-typography-primary">
              Olá, {firstName}! Seja bem-vindo a Beergam.
            </h2>
            <p className="text-sm text-beergam-typography-secondary leading-relaxed">
              Você está no plano gratuito vitalício. Aproveite as ferramentas
              disponíveis e faça upgrade quando quiser para desbloquear todo o
              potencial do Beergam.
            </p>
          </div>
          <BeergamButton
            title="Fazer upgrade"
            link="/interno/config?session=Minha%20Assinatura"
            animationStyle="slider"
            icon="rocket_launch"
            className="shrink-0"
          />
        </div>
      </Section>

      {/* Acesso rápido */}
      <Section title="Acesso rápido">
        <MainCards className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FREE_QUICK_ACCESS.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center gap-4 p-4 rounded-xl border border-beergam-border bg-beergam-background-secondary hover:border-beergam-primary/50 hover:bg-beergam-primary/5 transition-colors group"
            >
              <div
                className={`w-11 h-11 rounded-full bg-${item.color}/10 flex items-center justify-center shrink-0`}
              >
                {Svg[item.icon] &&
                  (() => {
                    const Icon = Svg[item.icon];
                    return (
                      <Icon
                        tailWindClasses={`text-${item.color}`}
                        width="22px"
                        height="22px"
                      />
                    );
                  })()}
              </div>
              <div className="flex flex-col gap-0.5 flex-1">
                <span className="text-sm font-semibold text-beergam-typography-primary group-hover:text-beergam-primary transition-colors">
                  {item.label}
                </span>
                <span className="text-xs text-beergam-typography-tertiary">
                  {item.description}
                </span>
              </div>
              <Svg.chevron
                tailWindClasses="text-beergam-typography-tertiary rotate-0 group-hover:text-beergam-primary transition-colors"
                width="16px"
                height="16px"
              />
            </Link>
          ))}
        </MainCards>
      </Section>

      {/* Funcionalidades bloqueadas */}
      <Section
        title="Funcionalidades exclusivas"
        actions={
          <span className="text-xs text-beergam-typography-tertiary">
            Disponíveis nos planos pagos
          </span>
        }
      >
        <MainCards className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {LOCKED_FEATURES.map((feature) => (
            <Link
              key={feature.label}
              to="/interno/config?session=Minha%20Assinatura"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-beergam-border bg-beergam-background-secondary hover:border-beergam-orange/40 hover:bg-beergam-orange/5 transition-colors group cursor-pointer"
              title={`${feature.label} — disponível nos planos pagos`}
            >
              <div className="relative">
                {Svg[feature.icon] &&
                  (() => {
                    const Icon = Svg[feature.icon];
                    return (
                      <Icon
                        tailWindClasses="text-beergam-typography-tertiary group-hover:text-beergam-orange/60 transition-colors"
                        width="26px"
                        height="26px"
                      />
                    );
                  })()}
                <div className="absolute -bottom-0.5 -right-1 w-4 h-4 bg-beergam-orange rounded-full flex items-center justify-center">
                  <Svg.lock_closed
                    tailWindClasses="text-white"
                    width="9px"
                    height="9px"
                  />
                </div>
              </div>
              <span className="text-xs font-medium text-beergam-typography-tertiary group-hover:text-beergam-typography-secondary transition-colors text-center">
                {feature.label}
              </span>
            </Link>
          ))}
        </MainCards>
      </Section>

      {/* Espaço reservado para ads/promoções */}
      {!onboardingDone && (
        <Section title="">
          <div className="rounded-xl border border-dashed border-beergam-border bg-beergam-background-secondary p-6 flex flex-col items-center gap-3 text-center">
            <Svg.megaphone
              tailWindClasses="text-beergam-typography-tertiary"
              width="28px"
              height="28px"
            />
            <p className="text-sm text-beergam-typography-tertiary">
              Espaço reservado para comunicados e novidades
            </p>
          </div>
        </Section>
      )}

      {/* CTA final */}
      <Section title="">
        <div className="rounded-2xl bg-linear-to-br from-beergam-primary/10 via-beergam-background-secondary to-beergam-orange/5 border border-beergam-border p-6 flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="flex flex-col gap-1 text-beergam-typography-primary flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold">
              Pronto para levar seu negócio mais longe?
            </h3>
            <p className="text-sm text-beergam-typography-secondary">
              Desbloqueie vendas, anúncios, financeiro e muito mais.
            </p>
          </div>
          <BeergamButton
            title="Ver planos"
            link="/interno/config?session=Minha%20Assinatura"
            animationStyle="slider"
            icon="rocket_launch"
            className="shrink-0"
          />
        </div>
      </Section>
    </>
  );
}
