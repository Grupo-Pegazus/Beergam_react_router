import { useEffect, useState } from "react";
import { Modal } from "~/src/components/utils/Modal";
import BeergamButton from "~/src/components/utils/BeergamButton";
import type { Question } from "../typings";

interface AnswerModalProps {
  open: boolean;
  question: Question | null;
  onClose: () => void;
  onSubmit: (payload: { questionId: string; answer: string }) => void;
  loading?: boolean;
}

export function AnswerModal({ open, question, onClose, onSubmit, loading }: AnswerModalProps) {
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (open) {
      setAnswer(question?.answer ?? "");
    }
  }, [open, question]);

  function handleSave() {
    if (!question?.id) return;
    onSubmit({ questionId: question.id, answer });
  }

  return (
    <Modal title="Responder pergunta" isOpen={open} onClose={onClose}>
      <div className="space-y-3">
        <p className="text-sm text-slate-700">
          {question?.text ?? "Pergunta não encontrada."}
        </p>
        <textarea
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          rows={4}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-beergam-orange focus:border-beergam-orange outline-none"
          placeholder="Digite sua resposta"
        />
        <div className="flex justify-end gap-3">
          <BeergamButton
            type="button"
            title="Cancelar"
            mainColor="beergam-blue"
            animationStyle="fade"
            onClick={onClose}
          />
          <BeergamButton
            type="button"
            title={loading ? "Enviando..." : "Enviar"}
            mainColor="beergam-orange"
            animationStyle="slider"
            onClick={handleSave}
            disabled={loading || !answer.trim()}
          />
        </div>
      </div>
    </Modal>
  );
}

