export function EnumKeyFromValue<E extends Record<string, string | number>>(
  enumObj: E,
  value: E[keyof E]
): keyof E | undefined {
  return (Object.keys(enumObj) as Array<keyof E>).find(
    (k) => enumObj[k] === value
  ) as keyof E;
}
