import { useSubmit } from "react-router";
import type { SubmitData } from "./typings";
export function deepEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  )
    return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Criar um conjunto com todas as chaves únicas de ambos os objetos
  const allKeys = new Set([...keys1, ...keys2]);

  for (const key of allKeys) {
    const value1 = obj1[key as keyof typeof obj1];
    const value2 = obj2[key as keyof typeof obj2];

    // Se um campo não existe em um objeto, considere como null
    const normalizedValue1 = keys1.includes(key) ? value1 : null;
    const normalizedValue2 = keys2.includes(key) ? value2 : null;

    // Se ambos são null, considere como iguais
    if (normalizedValue1 === null && normalizedValue2 === null) {
      continue;
    }

    // Se apenas um é null, são diferentes
    if (normalizedValue1 === null || normalizedValue2 === null) {
      return false;
    }

    // Se nenhum é null, faça a comparação recursiva
    if (!deepEqual(normalizedValue1, normalizedValue2)) {
      return false;
    }
  }

  return true;
}
export function HandleSubmit<T>(
  data: SubmitData<T>,
  submit: ReturnType<typeof useSubmit>
): void {
  //   const dataToSubmit = {
  //     data: data.data,
  submit(
    JSON.stringify({
      data: data.data,
      action: data.action,
    }),
    {
      method: "post",
      encType: "application/json",
    }
  );
}
