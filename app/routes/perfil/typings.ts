export type SubmitAction = "Minha Conta" | "Colaboradores" | "Minha Assinatura";
export type ColabAction = "Editar" | "Excluir" | "Criar";
export interface SubmitData<T> {
  action: SubmitAction;
  data: T;
  colabAction?: ColabAction;
}
