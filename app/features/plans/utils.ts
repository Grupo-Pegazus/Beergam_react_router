import Svg from "~/src/assets/svgs/_index";
import type { Plan } from "../user/typings/BaseUser";
export function getPlanIcon(plan: Plan): (typeof Svg)[keyof typeof Svg] {
  if (
    plan.display_name === "Plano Operacional" ||
    plan.display_name === "Influencer iniciante"
  ) {
    return Svg.home;
  }
  if (
    plan.display_name === "Plano Tático" ||
    plan.display_name === "Influencer intermediário"
  ) {
    return Svg.building_library;
  }
  if (
    plan.display_name === "Plano Estratégico" ||
    plan.display_name === "Influencer avançado"
  ) {
    return Svg.graph;
  }
  return Svg.home;
}
