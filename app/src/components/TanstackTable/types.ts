import '@tanstack/react-table';

// Extende o tipo ColumnMeta do TanStack Table para incluir cores e tamanhos customizados
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    /** Cor de fundo do header (mais escura) */
    headerColor?: string;
    /** Cor de fundo do body (mais clara) */
    bodyColor?: string;
    /** Nome da seção/categoria da coluna */
    sectionName?: string;
    /** Largura customizada da coluna (sobrescreve o cálculo automático) */
    customWidth?: number;
  }
}
