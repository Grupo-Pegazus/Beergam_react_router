import { Profiler } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "~/store";
import { toggleOpen } from "../../redux";
import { type IMenuItem } from "../../typings";

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

  if (!isVisible) return null;

  return (
    <Profiler
      id={itemKey}
      onRender={() => {
        console.log("renderizei o ", itemKey);
      }}
    >
      <li>
        <button onClick={() => dispatch(toggleOpen({ path: currentKey }))}>
          {item.label} {item.dropdown ? (isOpen ? "▲" : "▼") : null}
        </button>

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
