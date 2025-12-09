import { useMemo } from "react";
import BeergamButton from "~/src/components/utils/BeergamButton";
import type { Question, QuestionsPagination } from "../typings";

interface QuestionsListProps {
  questions: Question[];
  pagination?: QuestionsPagination;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  onSelectToAnswer: (question: Question) => void;
  onSelectDetails: (question: Question) => void;
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export function QuestionsList({
  questions,
  pagination,
  loading,
  onPageChange,
  onSelectToAnswer,
  onSelectDetails,
}: QuestionsListProps) {
  const hasPagination = Boolean(pagination?.total_pages && pagination.total_pages > 1);

  const empty = useMemo(() => !loading && questions.length === 0, [loading, questions.length]);

  return (
    <div className="space-y-3">
      {loading ? (
        <div className="p-4 text-sm text-slate-600">Carregando perguntas...</div>
      ) : null}

      {empty ? (
        <div className="p-6 bg-white border border-dashed border-slate-200 rounded-2xl text-center text-slate-600">
          Nenhuma pergunta encontrada para os filtros atuais.
        </div>
      ) : null}

      {!loading &&
        questions.map((question) => (
          <div
            key={question.id}
            className="bg-white border border-black/5 rounded-2xl p-4 shadow-sm flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-sm text-slate-500">
                  {question.item_title ?? "Item sem título"} {question.item_id ? `• ${question.item_id}` : ""}
                </p>
                <p className="text-base font-semibold text-slate-900 break-words">{question.text}</p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">
                    Status: {question.status ?? "N/A"}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-amber-50 border border-amber-200">
                    Criada: {formatDate(question.date_created)}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                    Resposta: {formatDate(question.answer_date)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <BeergamButton
                  title="Responder"
                  mainColor="beergam-orange"
                  animationStyle="slider"
                  onClick={() => onSelectToAnswer(question)}
                  className="px-4"
                />
                <BeergamButton
                  title="Ver detalhes"
                  mainColor="beergam-blue"
                  animationStyle="fade"
                  onClick={() => onSelectDetails(question)}
                  className="px-4"
                />
              </div>
            </div>
            {question.answer ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-800">
                <p className="font-semibold mb-1">Resposta</p>
                <p>{question.answer}</p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                <p className="font-semibold">Aguardando resposta</p>
              </div>
            )}
          </div>
        ))}

      {hasPagination ? (
        <div className="flex items-center justify-between mt-2 text-sm text-slate-600">
          <span>
            Página {pagination?.page ?? 1} de {pagination?.total_pages ?? 1}
          </span>
          <div className="flex gap-2">
            <BeergamButton
              title="Anterior"
              mainColor="beergam-blue"
              animationStyle="fade"
              onClick={() => {
                if (!onPageChange || !pagination) return;
                onPageChange(Math.max(1, pagination.page - 1));
              }}
              disabled={!pagination || pagination.page <= 1}
              className="px-3"
            />
            <BeergamButton
              title="Próxima"
              mainColor="beergam-orange"
              animationStyle="slider"
              onClick={() =>
                onPageChange &&
                pagination &&
                onPageChange(
                  Math.min(pagination.total_pages ?? pagination.page + 1, (pagination.total_pages ?? 1)),
                )
              }
              disabled={!pagination || (pagination.total_pages ?? 1) <= (pagination.page ?? 1)}
              className="px-3"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

