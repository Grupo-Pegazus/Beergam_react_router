import { useLocation, useParams, useNavigate } from "react-router";
import { MenuConfig, type IMenuConfig, type IMenuItem } from "~/features/menu/typings";
import { findKeyPathByRoute, getRelativePath, DEFAULT_INTERNAL_PATH } from "~/features/menu/utils";

interface BreadcrumbItem {
  label: string;
  path: string | undefined;
  isLast: boolean;
}

/**
 * Link sem âncora: mantém aparência de <span> e comportamento de link com acessibilidade
 */
function SpanLink({ to, className, children }: { to?: string; className?: string; children: React.ReactNode }) {
  const navigate = useNavigate();
  function handleActivate() {
    if (to) navigate(to);
  }
  return (
    <span
      role="link"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }}
      className={["cursor-pointer select-none", className].filter(Boolean).join(" ")}
    >
      {children}
    </span>
  );
}


function isIMenuItem(item: IMenuConfig | IMenuItem): item is IMenuItem {
  return "label" in item && "status" in item;
}

function getMenuItemByChain(
  menu: IMenuConfig,
  keyChain: string[]
): IMenuItem | null {
  let current: IMenuConfig | IMenuItem = menu;
  
  for (const key of keyChain) {
    if (isIMenuItem(current)) {
      if (current.dropdown && key in current.dropdown) {
        current = current.dropdown[key];
      } else {
        return null;
      }
    } else {
      if (key in current) {
        current = current[key];
      } else {
        return null;
      }
    }
  }
  
  return isIMenuItem(current) ? current : null;
}

function getPathByKeyChain(keyChain: string[]): string {
  if (keyChain.length === 0) {
    return DEFAULT_INTERNAL_PATH;
  }

  const lastKey = keyChain[keyChain.length - 1];
  return getRelativePath(lastKey) || DEFAULT_INTERNAL_PATH;
}

function useBreadcrumbItems(): BreadcrumbItem[] {
  const location = useLocation();
  const params = useParams();
  const currentPath = location.pathname;

  const { keyChain } = findKeyPathByRoute(MenuConfig, currentPath);
  
  const items: BreadcrumbItem[] = [];
  
  if (keyChain.length === 0) {
    const segments = currentPath.replace(/^\/interno\/?/, "").split("/").filter(Boolean);
    
    if (segments.length >= 2) {
      const parentKey = segments[0];
      const parentItem = MenuConfig[parentKey as keyof typeof MenuConfig];
      
      if (parentItem && "dinamic_id" in parentItem && parentItem.dinamic_id) {
        items.push({
          label: parentItem.label,
          path: getRelativePath(parentKey),
          isLast: false,
        });
        
        const dynamicValue = params[parentItem.dinamic_id] || segments[segments.length - 1];
        items.push({
          label: dynamicValue,
          path: currentPath,
          isLast: true,
        });
        return items;
      }
    }
    
    // Fallback: usa o último segmento da URL
    const lastSegment = segments.pop() || "Início";
    items.push({
      label: lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, " "),
      path: currentPath,
      isLast: true,
    });
    return items;
  }
  
  for (let i = 0; i < keyChain.length; i++) {
    const chainUntilNow = keyChain.slice(0, i + 1);
    const menuItem = getMenuItemByChain(MenuConfig, chainUntilNow);
    
    if (!menuItem) continue;
    
    const isLast = i === keyChain.length - 1;
    
    if (isLast && menuItem.dinamic_id && params[menuItem.dinamic_id]) {
      const parentPath = getPathByKeyChain(keyChain.slice(0, -1));
      items.push({
        label: menuItem.label,
        path: parentPath,
        isLast: false,
      });
      const dynamicValue = params[menuItem.dinamic_id];
      if (dynamicValue) {
        items.push({
          label: dynamicValue,
          path: currentPath,
          isLast: true,
        });
      } else {
        items.push({
          label: menuItem.label,
          path: currentPath,
          isLast: true,
        });
      }
    } else {
      // Para itens intermediários, só adiciona path se o item tiver path próprio
      // Itens sem path próprio (apenas dropdowns) não devem ser clicáveis
      const path = isLast 
        ? currentPath 
        : (menuItem.path ? getPathByKeyChain(chainUntilNow) : undefined);
      items.push({
        label: menuItem.label,
        path,
        isLast,
      });
    }
  }
  
  return items;
}

/**
 * Componente de Breadcrumb inspirado no estilo da Microsoft
 * Substitui o título da página com um breadcrumb dinâmico baseado na tipagem do menu
 */
export default function SystemBreadcrumb() {
  const items = useBreadcrumbItems();

  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="breadcrumb">
      <div className="flex items-center gap-3 text-4xl font-semibold leading-snug">
        {items.map((item, index) => {
          const isLast = item.isLast;
          return (
            <span key={`${item.path}-${index}`} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-beergam-black-blue">
                  {item.label}
                </span>
              ) : (
                // Foi uma grande gambiarra que pedi pro Cursor
                // Usar diretamente o Link estava dando alguma incompatibilidade com o Tailwind
                // O breadcrumb clicável ficava estupidamente pequeno
                // Essa solução funcionou, mas não sei se é a melhor possível
                <>
                  {item.path ? (
                    <SpanLink
                      to={item.path}
                      className="text-beergam-black-blue opacity-50 hover:opacity-100 transition-colors inline-flex"
                    >
                      {item.label}
                    </SpanLink>
                  ) : (
                    <span className="text-[#6b7280] inline-flex">
                      {item.label}
                    </span>
                  )}
                  <span className="text-[#6b7280] select-none">›</span>
                </>
              )}
            </span>
          );
        })}
      </div>
    </nav>
  );
}
