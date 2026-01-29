import { Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { anuncioService } from "~/features/anuncios/service";
import Thumbnail from "~/src/components/Thumbnail/Thumbnail";
import CopyButton from "~/src/components/ui/CopyButton";
import PaginationBar from "~/src/components/ui/PaginationBar";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { Fields } from "~/src/components/utils/_fields";
import {
  getQuestionStatus,
  type Question,
  type QuestionsPagination,
  QuestionStatus,
} from "../typings";
import QuestionsListSkeleton from "./QuestionsListSkeleton";

interface QuestionsListProps {
  questions: Question[];
  pagination?: QuestionsPagination;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  onAnswer: (questionId: string, answer: string) => Promise<void>;
  /** Quando true, a página é lida/escrita na URL (`?page=N`). @default false */
  syncPageWithUrl?: boolean;
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function QuestionCard({
  question,
  onAnswer,
}: {
  question: Question;
  onAnswer: (questionId: string, answer: string) => Promise<void>;
}) {
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

  // Determina o título do item
  const itemTitle = question.item_title?.trim() || null;
  const hasItemInfo = itemTitle || question.item_id;
  const questionStatus = getQuestionStatus(question.status);
  return (
    <Paper className="space-y-4!">
      {/* Cabeçalho da pergunta */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          {hasItemInfo && (
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-beergam-typography-secondary!">
              {question.item_id && (
                <>
                  {itemTitle && <span className="hidden sm:inline">•</span>}
                  <span className="break-all">{String(question.item_id)}</span>
                  <CopyButton
                    textToCopy={String(question.item_id)}
                    successMessage="MLB copiado para a área de transferência"
                    iconSize="h-3.5 w-3.5"
                    ariaLabel="Copiar MLB"
                  />
                  <span className="hidden sm:inline">•</span>
                  <span className="break-all">
                    Usuário {String(question.from?.id)}
                  </span>
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
          <p className="text-sm sm:text-base font-semibold text-beergam-typography-primary! wrap-break-word">
            {String(question.text ?? "")}
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-beergam-typography-secondary!">
            <span
              className={`px-2 py-1 rounded-full border ${questionStatus === QuestionStatus.ANSWERED
                  ? "bg-beergam-primary/10 border-beergam-primary/30 text-beergam-primary"
                  : questionStatus === QuestionStatus.UNANSWERED
                    ? "bg-beergam-typography-secondary/10 border-beergam-typography-secondary/30 text-beergam-typography-secondary"
                    : questionStatus === QuestionStatus.BANNED
                      ? "bg-beeram-red/10 border-beeram-red/30 text-beeram-red"
                      : "bg-slate-100 border-slate-200"
                }`}
            >
              Status: {questionStatus}
            </span>
            <span className="px-2 py-1 rounded-full bg-beergam-typography-tertiary/10 border border-beergam-typography-tertiary/30 text-beergam-typography-tertiary! whitespace-nowrap">
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
            className="w-full sm:w-auto sm:shrink-0 px-4"
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
        <div className="bg-beergam-primary/10 border border-beergam-primary/30 rounded-xl p-3 text-sm text-beergam-primary">
          <div className="flex flex-col gap-3 mb-2">
            <div className="flex gap-1 items-baseline">
              <p className="font-semibold text-beergam-typography-primary! mb-1">
                Resposta
              </p>
              <span className="text-xs text-beergam-typography-primary ml-auto">
                Respondida em: {formatDate(question.answer?.date_created)}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-beergam-typography-tertiary!">
              {question.answer?.text}
            </p>
          </div>
        </div>
      )}

      <BeergamButton
        title="Ver detalhes"
        icon="chevron"
        iconClassName={showDetails ? "rotate-270" : "rotate-90"}
        animationStyle="slider"
        onClick={() => setShowDetails(!showDetails)}
      />

      {/* Detalhes expandidos (acordeon) */}
      {showDetails && (
        <div className="mt-2 pt-3 border-t border-slate-200">
          <div className="grid grid-cols-1 gap-2">
            <Paper className="bg-beergam-section-background! space-y-4!">
              <p className="font-semibold text-beergam-typography-primary! mb-2">
                Anúncio
              </p>
              {anuncioQuery.isLoading ? (
                <p className="text-xs text-beergam-typography-secondary!">
                  Carregando...
                </p>
              ) : anuncio ? (
                <>
                  <div className="flex flex-col sm:flex-row gap-3 mb-2">
                    <Thumbnail thumbnail={anuncio.thumbnail ?? ""} />
                    <div className="flex-1 min-w-0">
                      <p className="text-beergam-typography-primary! mb-1 wrap-break-word">
                        {anuncio.name ?? "—"}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-beergam-typography-secondary!">
                        <span className="break-all">
                          MLB: {anuncio.mlb ?? question.item_id ?? "—"}
                        </span>
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
                  <p className="text-xs text-beergam-typography-secondary!">
                    SKU: {anuncio.sku ?? "—"}
                  </p>
                  <p className="text-xs text-beergam-typography-secondary!">
                    Preço: {anuncio.price ? `R$ ${anuncio.price}` : "—"}
                  </p>
                  <p className="text-xs text-beergam-typography-secondary!">
                    Estoque: {anuncio.stock ?? "—"}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-beergam-typography-primary! mb-1">
                    {question.item_title ?? "—"}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-beergam-typography-secondary!">
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
                  <p className="text-xs text-beergam-typography-secondary!">
                    Seller ID: {question.seller_id ?? "—"}
                  </p>
                </>
              )}
            </Paper>
          </div>
        </div>
      )}
    </Paper>
  );
}

export function QuestionsList({
  questions,
  pagination,
  loading,
  onPageChange,
  onAnswer,
}: QuestionsListProps) {
  const hasPagination = Boolean(
    pagination?.total_pages && pagination.total_pages > 1
  );

  const empty = useMemo(
    () => !loading && questions.length === 0,
    [loading, questions.length]
  );

  return (
    <div className="space-y-3" id="questions-list-top">
      {loading ? <QuestionsListSkeleton /> : null}

      {empty ? (
        <div className="p-6 bg-white border border-dashed border-slate-200 rounded-2xl text-center text-slate-600">
          Nenhuma pergunta encontrada para os filtros atuais.
        </div>
      ) : null}

      {!loading &&
        Array.isArray(questions) &&
        questions
          .filter((question) => question && typeof question === "object" && question.id)
          .map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onAnswer={onAnswer}
            />
          ))}

      {hasPagination && pagination ? (
        <PaginationBar
          page={pagination.page}
          totalPages={pagination.total_pages ?? 1}
          totalCount={pagination.total_count}
          entityLabel="perguntas"
          onChange={(nextPage) => {
            if (!onPageChange) return;
            onPageChange(nextPage);
          }}
          scrollOnChange
          scrollTargetId="questions-list-top"
          isLoading={loading}
          syncWithUrl={syncPageWithUrl}
        />
      ) : null}
    </div>
  );
}
