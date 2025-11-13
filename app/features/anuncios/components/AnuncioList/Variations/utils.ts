import type { Variation } from "../../../typings";

export interface GroupedVariation {
  commonAttributes: Array<{
    id: string;
    name: string;
    value_name: string;
  }>;
  varyingAttributeId: string | null;
  variations: Variation[];
}

export function groupVariationsByCommonAttributes(
  variations: Variation[]
): GroupedVariation[] {
  if (variations.length === 0) return [];

  // Identifica quais atributos são comuns (mesmo valor em todas) e quais variam
  const attributeIds = new Set<string>();
  variations.forEach((v) => {
    v.attributes.forEach((attr) => attributeIds.add(attr.id));
  });

  const commonAttributes: Record<string, string> = {};
  const varyingAttributes = new Set<string>();

  attributeIds.forEach((attrId) => {
    const values = new Set<string>();
    variations.forEach((v) => {
      const attr = v.attributes.find((a) => a.id === attrId);
      if (attr?.value_name) {
        values.add(attr.value_name);
      }
    });

    if (values.size === 1) {
      // Atributo comum (mesmo valor em todas)
      const attr = variations[0].attributes.find((a) => a.id === attrId);
      if (attr?.value_name) {
        commonAttributes[attrId] = attr.value_name;
      }
    } else {
      // Atributo que varia
      varyingAttributes.add(attrId);
    }
  });

  // Agrupa variações por combinação de atributos comuns
  const groups = new Map<string, Variation[]>();

  variations.forEach((variation) => {
    // Cria uma chave baseada nos atributos comuns
    const commonKey = Object.entries(commonAttributes)
      .map(([id, value]) => `${id}:${value}`)
      .sort()
      .join("|");

    if (!groups.has(commonKey)) {
      groups.set(commonKey, []);
    }
    groups.get(commonKey)!.push(variation);
  });

  return Array.from(groups.entries()).map(([, vars]) => ({
    commonAttributes: Object.entries(commonAttributes).map(([id, value]) => {
      const attr = vars[0].attributes.find((a) => a.id === id);
      return {
        id,
        name: attr?.name || id,
        value_name: value || "",
      };
    }),
    varyingAttributeId: Array.from(varyingAttributes)[0] || null,
    variations: vars,
  }));
}

