import Section from "~/src/components/ui/Section";
import Grid from "~/src/components/ui/Grid";

export default function StockControlSkeleton() {
  return (
    <Section>
      {/* Skeleton do SKU */}
      <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-4" />

      {/* Skeleton do Select de Variação */}
      <Grid cols={{ base: 1, md: 2 }} className="mb-4">
        <div className="space-y-2">
          <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
          <div className="h-10 w-full bg-slate-200 rounded animate-pulse" />
        </div>
      </Grid>

      {/* Skeleton dos Cards de Resumo */}
      <Grid cols={{ base: 1, lg: 1 }} className="mb-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </Grid>

      {/* Skeleton do Card de Custo Médio */}
      <Grid cols={{ base: 1, lg: 1 }} className="mb-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-40 bg-slate-200 rounded animate-pulse" />
            <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="h-10 w-full bg-green-100 rounded animate-pulse mt-4" />
          </div>
        </div>
      </Grid>

      {/* Skeleton do Formulário de Movimentação */}
      <Grid cols={{ base: 1, lg: 1 }} className="mb-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-4" />
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-10 w-32 bg-slate-200 rounded animate-pulse" />
                <div className="h-10 w-32 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-10 w-32 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
      </Grid>

      {/* Skeleton da Tabela */}
      <Section title="Histórico de Movimentações">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="h-10 w-full bg-slate-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-slate-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-10 w-10 bg-slate-200 rounded animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                      <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between p-4 border-t border-slate-200">
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
                <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
                <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </Section>
  );
}

