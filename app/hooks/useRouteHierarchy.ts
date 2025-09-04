// app/hooks/useRouteHierarchy.ts
import { useLocation } from "react-router";
import { internal_routes } from "../routes";

interface RouteNode {
  path: string;
  file?: string;
  index?: boolean;
  segments: string[];
  parent?: RouteNode;
  children: RouteNode[];
}

function buildHierarchyFromExistingRoutes(routes: any[]): RouteNode[] {
  const allNodes: RouteNode[] = [];
  
  // Primeiro, cria todos os nós a partir dos dados existentes
  routes.forEach(route => {
    if (route.path) {
      const segments = route.path.split('/').filter(Boolean);
      
      const node: RouteNode = {
        path: route.path,
        file: route.file,
        index: route.index,
        segments,
        children: []
      };
      
      allNodes.push(node);
    }
  });
  
  // Agora estabelece as relações pai-filho baseado nos segmentos
  allNodes.forEach(node => {
    allNodes.forEach(potentialParent => {
      // Um nó é pai se seus segmentos são um prefixo dos segmentos do filho
      if (potentialParent !== node && 
          potentialParent.segments.length === node.segments.length - 1 &&
          potentialParent.segments.every((seg, index) => seg === node.segments[index])) {
        
        node.parent = potentialParent;
        potentialParent.children.push(node);
      }
    });
  });
  
  return allNodes;
}

export function useRouteHierarchy() {
  const location = useLocation();
  const currentPath = location.pathname;
  const segments = currentPath.split('/').filter(Boolean);
  
  // Constrói a hierarquia a partir dos dados existentes
  const allNodes = buildHierarchyFromExistingRoutes(internal_routes);
  
  // Encontra a rota atual
  const currentRoute = allNodes.find(node => 
    `/${node.path}` === currentPath || 
    (node.index && node.path === segments.join('/'))
  );
  
  // Encontra todos os ancestrais da rota atual
  function getAncestors(node?: RouteNode): RouteNode[] {
    if (!node || !node.parent) return [];
    return [...getAncestors(node.parent), node.parent];
  }
  
  // Encontra todos os irmãos (filhos do mesmo pai)
  function getSiblings(node?: RouteNode): RouteNode[] {
    if (!node || !node.parent) {
      // Se não tem pai, retorna todos os nós raiz
      return allNodes.filter(n => !n.parent);
    }
    return node.parent.children.filter(child => child !== node);
  }
  
  // Encontra nós no mesmo nível (mesma profundidade)
  function getNodesAtLevel(level: number): RouteNode[] {
    return allNodes.filter(node => node.segments.length === level);
  }
  
  const ancestors = getAncestors(currentRoute);
  const siblings = getSiblings(currentRoute);
  const children = currentRoute?.children || [];
  
  return {
    // Dados brutos
    allRoutes: internal_routes,
    allNodes,
    
    // Rota atual
    current: currentRoute,
    currentPath,
    currentSegments: segments,
    
    // Relações hierárquicas (usando apenas dados existentes)
    ancestors,
    children,
    siblings,
    
    // Informações derivadas
    depth: segments.length,
    isLeaf: children.length === 0,
    hasParent: !!currentRoute?.parent,
    
    // Métodos utilitários
    getParent: () => currentRoute?.parent,
    getRoot: () => {
      let root = currentRoute;
      while (root?.parent) {
        root = root.parent;
      }
      return root;
    },
    getNodesAtLevel,
    
    // Navegação
    isChildOf: (pathSegment: string) => 
      ancestors.some(ancestor => ancestor.segments.includes(pathSegment)),
    
    getNodeByPath: (path: string) => 
      allNodes.find(node => node.path === path || `/${node.path}` === path),
    
    // Debug helpers
    getFullHierarchy: () => {
      const rootNodes = allNodes.filter(node => !node.parent);
      
      function buildTree(nodes: RouteNode[]): any {
        return nodes.map(node => ({
          path: node.path,
          file: node.file,
          index: node.index,
          segments: node.segments,
          children: buildTree(node.children)
        }));
      }
      
      return buildTree(rootNodes);
    }
  };
}
