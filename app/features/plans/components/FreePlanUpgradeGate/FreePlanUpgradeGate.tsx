import Svg from "~/src/assets/svgs/_index";
import BeergamButton from "~/src/components/utils/BeergamButton";

const UPGRADE_BENEFITS = [
  "Integração com Mercado Livre, Shopee e mais",
  "Relatórios financeiros completos",
  "Gestão de vendas e anúncios",
  "Atendimento ao cliente centralizado",
  "Colaboradores e permissões",
];

export default function FreePlanUpgradeGate() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 gap-8">
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-beergam-orange/10 flex items-center justify-center">
          <Svg.lock_closed
            tailWindClasses="text-beergam-orange"
            width="32px"
            height="32px"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-beergam-typography-primary">
            Funcionalidade bloqueada
          </h2>
          <p className="text-sm text-beergam-typography-secondary leading-relaxed">
            Você está no plano <strong>Free</strong>. Faça upgrade para
            desbloquear todas as funcionalidades do Beergam e levar seu negócio
            a outro nível.
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm bg-beergam-background-secondary rounded-2xl p-5 flex flex-col gap-3 border border-beergam-border">
        <p className="text-xs font-semibold text-beergam-typography-tertiary uppercase tracking-wider">
          O que você ganha ao fazer upgrade
        </p>
        <ul className="flex flex-col gap-2">
          {UPGRADE_BENEFITS.map((benefit) => (
            <li
              key={benefit}
              className="flex items-center gap-2 text-sm text-beergam-typography-secondary"
            >
              <Svg.check_circle
                tailWindClasses="text-beergam-primary shrink-0"
                width="16px"
                height="16px"
              />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <BeergamButton
          title="Ver planos e assinar"
          link="/interno/config?session=Minha%20Assinatura"
          animationStyle="slider"
          icon="rocket_launch"
          className="w-full"
        />
        <BeergamButton
          title="Voltar ao início"
          link="/interno/inicio"
          animationStyle="fade"
          mainColor="beergam-typography-secondary"
          className="w-full"
        />
      </div>
    </div>
  );
}
