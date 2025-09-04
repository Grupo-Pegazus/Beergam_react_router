import { type RouteConfig, index, route, prefix, layout,type RouteConfigEntry } from "@react-router/dev/routes";

function withPrefix(prefixPath: string, routes: RouteConfigEntry[]): RouteConfigEntry[] {
  return [...prefix(prefixPath, routes)];
}


export const internal_routes = [
  ...withPrefix("interno", [
    index("routes/inicio.tsx"),
    ...withPrefix("atendimento",
    [...withPrefix("mercado_livre", [route("perguntas", "routes/perguntas.tsx")])])
  ]
  ) 
]



export default [
    index("routes/home.tsx"),
    layout("src/components/layouts/MenuLayout.tsx", internal_routes)
] satisfies RouteConfig;
