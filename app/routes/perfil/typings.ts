export type SubmitAction = "Minha Conta" | "Colaboradores" | "Minha Assinatura";
export interface SubmitData<T> {
  action: SubmitAction;
  data: T;
}
