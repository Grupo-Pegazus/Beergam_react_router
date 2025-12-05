export type SubmitAction = "Minha Conta" | "Colaboradores" | "Minha Assinatura";
export type ColabAction = "Editar" | "Excluir" | "Visualizar" | "Criar";
export interface SubmitData<T> {
  action: SubmitAction;
  data: T;
  colabAction?: ColabAction;
}
