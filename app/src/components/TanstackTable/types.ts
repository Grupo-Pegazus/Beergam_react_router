import '@tanstack/react-table';

// Extende o tipo ColumnMeta do TanStack Table para incluir cores, tamanhos e sorting customizados
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    /** Cor de fundo do header (mais escura) */
    headerColor?: string;
    /** Cor de fundo do body (mais clara) */
    bodyColor?: string;
    /** Cor do texto dos valores na coluna */
    textColor?: string;
    /** Nome da seção/categoria da coluna */
    sectionName?: string;
    /** Largura customizada da coluna (sobrescreve o cálculo automático) */
    customWidth?: number;
    /** Habilita sorting para esta coluna (default: false) */
    enableSorting?: boolean;
    /** Valor a ser exibido na linha de rodapé (footer) da coluna */
    footerValue?: string | number | React.ReactNode;
    /** Cor de fundo do footer (opcional, usa headerColor se não definido) */
    footerColor?: string;
  }
}
