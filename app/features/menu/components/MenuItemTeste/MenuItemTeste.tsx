import { Profiler } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { type RootState } from "~/store";
import { toggleOpen } from "../../redux";
import { type IMenuItem } from "../../typings";
import { getRelativePath } from "../../utils";

type Props = {
  item: IMenuItem;
  itemKey: string; // chave local (ex: "atendimento")
  parentKey: string; // chave pai (ex: "atendimento.mercado_livre")
};

export default function MenuItemTeste({ item, itemKey, parentKey }: Props) {
  const dispatch = useDispatch();
  const currentKey = parentKey ? `${parentKey}.${itemKey}` : itemKey;

  const isVisible = useSelector(
    (s: RootState) =>
      s.menu.views[itemKey as keyof typeof s.menu.views]?.active ?? true
  );

  const isOpen = useSelector(
    (s: RootState) => s.menu.open[currentKey] ?? false
  );

  const isCurrentSelected = useSelector(
    (s: RootState) => s.menu.currentSelected[currentKey] ?? false
  );

  if (!isVisible) return null;

  type ActionProps = {
    item: IMenuItem;
    onToggle: () => void;
  };

  function MenuItemActionWrapper({ item, onToggle }: ActionProps) {
    if (item.path) {
      return <Link to={getRelativePath(itemKey) ?? "/"}>{item.label}</Link>;
    }
    return (
      <button onClick={onToggle}>
        {item.label}
        {item.dropdown ? (isOpen ? "▲" : "▼") : null}
      </button>
    );
  }

  return (
    <Profiler
      id={itemKey}
      onRender={() => {
        console.log("renderizei o ", itemKey);
      }}
    >
      <li>
        <MenuItemActionWrapper
          item={item}
          onToggle={() => dispatch(toggleOpen({ path: currentKey }))}
        />
        <p>{isCurrentSelected ? "true" : "false"}</p>
        {item.dropdown && isOpen && (
          <ul>
            {Object.entries(item.dropdown).map(([childKey, child]) => (
              <MenuItemTeste
                key={childKey}
                item={child}
                itemKey={childKey}
                parentKey={currentKey}
              />
            ))}
          </ul>
        )}
      </li>
    </Profiler>
  );
}
