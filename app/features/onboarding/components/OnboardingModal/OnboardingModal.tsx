import { useState } from "react";
import { Modal } from "~/src/components/utils/Modal";
import Svg from "~/src/assets/svgs/_index";
import BeergamButton from "~/src/components/utils/BeergamButton";
import OnboardingForm from "../OnboardingForm/OnboardingForm";

interface OnboardingModalProps {
  onCompleted: () => void;
}

const INTRO_ITEMS = [
  "Perguntas rápidas e objetivas",
  "Suas respostas são confidenciais",
  "Não pode ser pulado — mas vale a pena!",
];

export default function OnboardingModal({ onCompleted }: OnboardingModalProps) {
  const [started, setStarted] = useState(false);

  return (
    <Modal
      isOpen
      onClose={() => {}}
      disableClickAway
      title="Bem-vindo a Beergam!"
      icon="rocket_launch"
      contentClassName="max-w-lg! [&>div:first-child_button]:hidden"
    >
      {!started ? (
        <div className="flex flex-col items-center gap-6 text-center py-2">
          <div className="w-16 h-16 rounded-full bg-beergam-primary/10 flex items-center justify-center">
            <Svg.question_mark
              tailWindClasses="text-beergam-primary"
              width="32px"
              height="32px"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold text-beergam-typography-primary">
              Conta um pouco sobre você
            </h3>
            <p className="text-sm text-beergam-typography-secondary leading-relaxed">
              Para personalizarmos sua experiência, precisamos de algumas
              informações rápidas sobre o seu negócio.
            </p>
          </div>

          <div className="w-full flex flex-col gap-2 text-left">
            {INTRO_ITEMS.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm text-beergam-typography-secondary"
              >
                <Svg.check_circle
                  tailWindClasses="text-beergam-primary shrink-0"
                  width="18px"
                  height="18px"
                />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <BeergamButton
            title="Vamos começar"
            animationStyle="slider"
            icon="arrow_uturn_right"
            className="w-full"
            onClick={() => setStarted(true)}
          />
        </div>
      ) : (
        <OnboardingForm onCompleted={onCompleted} />
      )}
    </Modal>
  );
}
