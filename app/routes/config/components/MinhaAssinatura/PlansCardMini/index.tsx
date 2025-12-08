import PlanCard from "~/features/plans/components/PlanCard";
import type { Plan } from "~/features/user/typings/BaseUser";
import Section from "~/src/components/ui/Section";
import BeergamButton from "~/src/components/utils/BeergamButton";

import { useNavigate } from "react-router";
import { useModal } from "~/src/components/utils/Modal/useModal";
export default function PlansCardMini({ plan }: { plan: Plan }) {
  const { openModal } = useModal();
  const navigate = useNavigate();
  return (
    <Section
      title={plan.display_name}
      key={plan.display_name}
      onClick={() => {
        openModal(
          <div>
            <PlanCard plan={plan} billingPeriod="monthly" />
          </div>,
          { title: `Visualizar plano` }
        );
      }}
      actions={
        <>
          {!plan.is_current_plan ? (
            <BeergamButton
              title="Assinar"
              icon="star_solid"
              mainColor="beergam-orange"
              disabled={plan.is_current_plan}
              onClick={() => {
                navigate("/interno/subscription", { state: { plan } });
              }}
            />
          ) : (
            // <BeergamButton
            //   title="Atual"
            //   icon="check_solid"
            //   mainColor="beergam-blue-primary"
            // />
            <p className="text-beergam-blue-primary font-bold px-4 py-2 rounded-2xl bg-beergam-blue-primary/10">
              Atual
            </p>
          )}
        </>
      }
    >
      <div className="flex md:flex-row flex-col gap-2">
        {" "}
        <div>
          <h3 className="text-beergam-gray">
            {plan.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}{" "}
            /mês
          </h3>
          <p>{plan.description}</p>
        </div>
        {plan.display_name == "Plano Estratégico" && (
          <Section
            title="Comunidade Beergam"
            className="bg-beergam-blue-primary text-beergam-white"
            titleClassName="text-beergam-white!"
          >
            <hr className="mb-4" />
            <p>
              Ao assinar o plano Estratégico, você também terá acesso à
              comunidade Beergam, onde você pode compartilhar suas ideias e
              projetos com outros usuários do sistema.
            </p>
          </Section>
        )}
      </div>
    </Section>
  );
}
