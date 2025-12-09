import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { Fields } from "~/src/components/utils/_fields";
import Svg from "~/src/assets/svgs/_index";
import CopyButton from "~/src/components/ui/CopyButton";
import Thumbnail from "~/src/components/Thumbnail/Thumbnail";
import { anuncioService } from "~/features/anuncios/service";
import QuestionsListSkeleton from "./QuestionsListSkeleton";
import type { Question, QuestionsPagination } from "../typings";

interface QuestionsListProps {
  questions: Question[];
  pagination?: QuestionsPagination;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  onAnswer: (questionId: string, answer: string) => Promise<void>;
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function translateStatus(status?: string): string {
  const statusMap: Record<string, string> = {
    UNANSWERED: "Pendente",
    ANSWERED: "Respondida",
    BANNED: "Bloqueada",
    ACTIVE: "Ativa",
  };
  return statusMap[status ?? ""] ?? status ?? "N/A";
}

function getCardStyle(status?: string): string {
  const baseStyle = "rounded-2xl p-4 shadow-sm flex flex-col gap-3";
  if (status === "ANSWERED") {
    return `${baseStyle} bg-emerald-50 border-emerald-200`;
  }
  if (status === "UNANSWERED") {
    return `${baseStyle} bg-amber-50 border-amber-200`;
  }
  if (status === "BANNED") {
    return `${baseStyle} bg-red-50 border-red-200`;
  }
  return `${baseStyle} bg-white border-black/5`;
}

function QuestionCard({ question, onAnswer }: { question: Question; onAnswer: (questionId: string, answer: string) => Promise<void> }) {
  const [showAnswerInput, setShowAnswerInput] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [newAnswerText, setNewAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const anuncioQuery = useQuery({
    queryKey: ["anuncio", question.item_id],
    queryFn: () => anuncioService.getAnuncioDetails(question.item_id!),
    enabled: showDetails && Boolean(question.item_id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const anuncio = anuncioQuery.data?.success ? anuncioQuery.data.data : null;

  async function handleSubmitAnswer() {
    const text = newAnswerText.trim();
    if (!text) return;

    setSubmitting(true);
    try {
      await onAnswer(question.id, text);
      setShowAnswerInput(false);
      setNewAnswerText("");
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
    } finally {
      setSubmitting(false);
    }
  }

  const statusTranslated = translateStatus(question.status);
  const cardStyle = getCardStyle(question.status);

  // Determina o título do item
  const itemTitle = question.item_title?.trim() || null;
  const hasItemInfo = itemTitle || question.item_id;

  return (
    <div className={cardStyle}>
      {/* Cabeçalho da pergunta */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          {hasItemInfo && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              {question.item_id && (
                <>
                  {itemTitle && <span>•</span>}
                  <span className="font-mono">{String(question.item_id)}</span>
                  <CopyButton
                    textToCopy={String(question.item_id)}
                    successMessage="MLB copiado para a área de transferência"
                    iconSize="h-3.5 w-3.5"
                    ariaLabel="Copiar MLB"
                  />
                  <span>•</span>
                  <span>Usuário {String(question.from?.id)}</span>
                  <CopyButton
                    textToCopy={String(question.from?.id)}
                    successMessage="ID do usuário copiado para a área de transferência"
                    iconSize="h-3.5 w-3.5"
                    ariaLabel="Copiar ID do usuário"
                  />
                </>
              )}
            </div>
          )}
          <p className="text-base font-semibold text-slate-900 wrap-break-word">{String(question.text ?? "")}</p>
          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
            <span className={`px-2 py-1 rounded-full border ${
              question.status === "ANSWERED" 
                ? "bg-emerald-100 border-emerald-300 text-emerald-800" 
                : question.status === "UNANSWERED"
                ? "bg-amber-100 border-amber-300 text-amber-800"
                : question.status === "BANNED"
                ? "bg-red-100 border-red-300 text-red-800"
                : "bg-slate-100 border-slate-200"
            }`}>
              Status: {statusTranslated}
            </span>
            <span className="px-2 py-1 rounded-full bg-amber-50 border border-amber-200">
              Criada: {formatDate(question.date_created)}
            </span>
          </div>
        </div>
        {!question.answer?.text && (
          <BeergamButton
            title={showAnswerInput ? "Cancelar" : "Responder"}
            mainColor={showAnswerInput ? "beergam-gray" : "beergam-orange"}
            animationStyle="slider"
            onClick={() => {
              setShowAnswerInput(!showAnswerInput);
              if (showAnswerInput) {
                setNewAnswerText("");
              }
            }}
            className="px-4 shrink-0"
            disabled={submitting}
          />
        )}
      </div>

      {/* Textarea de resposta (acordeon) */}
      {showAnswerInput && !question.answer?.text && (
        <div className="bg-white border border-beergam-orange/30 rounded-xl p-3 flex flex-col gap-2">
          <Fields.wrapper>
            <Fields.label text="Sua resposta" />
            <textarea
              value={newAnswerText}
              onChange={(e) => setNewAnswerText(e.target.value)}
              placeholder="Digite sua resposta aqui..."
              disabled={submitting}
              rows={4}
              className="w-full px-3 py-2.5 border border-black/20 rounded-xl text-sm bg-white text-[#1e1f21] transition-colors duration-200 outline-none focus:border-beergam-orange focus:outline-beergam-orange disabled:bg-gray-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-beergam-blue-primary resize-y"
            />
          </Fields.wrapper>
          <div className="flex gap-2 justify-end">
            <BeergamButton
              title="Enviar"
              mainColor="beergam-green"
              animationStyle="slider"
              onClick={handleSubmitAnswer}
              disabled={submitting || !newAnswerText.trim()}
              className="px-4"
            />
          </div>
        </div>
      )}

      {/* Resposta existente (acordeon) */}
      {question.answer?.text && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-800">
          <div className="flex flex-col gap-3 mb-2">
            <div className="flex gap-1 items-baseline">
              <p className="font-semibold mb-1">Resposta</p>
              <span className="text-xs text-emerald-700 ml-auto">Respondida em: {formatDate(question.answer?.date_created)}</span>
            </div>
            <p className="whitespace-pre-wrap">{question.answer?.text}</p>
          </div>
        </div>
      )}

      {/* Botão de detalhes */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-slate-50 transition-colors text-left"
      >
        <span className="text-sm font-medium text-slate-700">Ver detalhes</span>
        <Svg.chevron
          tailWindClasses={`h-4 w-4 transition-transform duration-200 ${
            showDetails ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Detalhes expandidos (acordeon) */}
      {showDetails && (
        <div className="mt-2 pt-3 border-t border-slate-200">
          <div className={`grid grid-cols-1 ${question.status === "ANSWERED" ? "md:grid-cols-2" : ""} gap-3 text-sm text-slate-700`}>
            {/* Informações da pergunta - só mostra se for respondida */}
            {question.status === "ANSWERED" && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="font-semibold text-slate-900 mb-2">Pergunta</p>
                <p className="mb-2">{String(question.text ?? "")}</p>
                <p className="text-xs text-slate-500">
                  Criada em {question.date_created ? formatDate(question.date_created) : "—"}
                </p>
              </div>
            )}

            {/* Informações do anúncio */}
            <div className="bg-white border border-slate-200 rounded-xl p-3">
              <p className="font-semibold text-slate-900 mb-2">Anúncio</p>
              {anuncioQuery.isLoading ? (
                <p className="text-xs text-slate-500">Carregando...</p>
              ) : anuncio ? (
                <>
                  <div className="flex gap-3 mb-2">
                    <Thumbnail thumbnail={anuncio.thumbnail ?? ""} />
                    <div className="flex-1">
                      <p className="text-slate-800 mb-1">{anuncio.name ?? "—"}</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span>MLB: {anuncio.mlb ?? question.item_id ?? "—"}</span>
                        {(anuncio.mlb || question.item_id) && (
                          <CopyButton
                            textToCopy={String(anuncio.mlb ?? question.item_id)}
                            successMessage="MLB copiado para a área de transferência"
                            iconSize="h-3 w-3"
                            ariaLabel="Copiar MLB"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">SKU: {anuncio.sku ?? "—"}</p>
                  <p className="text-xs text-slate-500">Preço: {anuncio.price ? `R$ ${anuncio.price}` : "—"}</p>
                  <p className="text-xs text-slate-500">Estoque: {anuncio.stock ?? "—"}</p>
                </>
              ) : (
                <>
                  <p className="text-slate-800 mb-1">{question.item_title ?? "—"}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span>Item ID: {question.item_id ?? "—"}</span>
                    {question.item_id && (
                      <CopyButton
                        textToCopy={String(question.item_id)}
                        successMessage="MLB copiado para a área de transferência"
                        iconSize="h-3 w-3"
                        ariaLabel="Copiar MLB"
                      />
                    )}
                  </div>
                  <p className="text-xs text-slate-500">Seller ID: {question.seller_id ?? "—"}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function QuestionsList({
  questions,
  pagination,
  loading,
  onPageChange,
  onAnswer,
}: QuestionsListProps) {
  const hasPagination = Boolean(pagination?.total_pages && pagination.total_pages > 1);

  const empty = useMemo(() => !loading && questions.length === 0, [loading, questions.length]);

  return (
    <div className="space-y-3">
      {loading ? <QuestionsListSkeleton /> : null}

      {empty ? (
        <div className="p-6 bg-white border border-dashed border-slate-200 rounded-2xl text-center text-slate-600">
          Nenhuma pergunta encontrada para os filtros atuais.
        </div>
      ) : null}

      {!loading &&
        Array.isArray(questions) &&
        questions.map((question) => {
          if (!question || typeof question !== "object" || !question.id) {
            return null;
          }
          return <QuestionCard key={question.id} question={question} onAnswer={onAnswer} />;
        })}

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
