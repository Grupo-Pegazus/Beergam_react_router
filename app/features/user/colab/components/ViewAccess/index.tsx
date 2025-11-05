import { Paper, Switch } from "@mui/material";
import { Tooltip } from "react-tooltip";
import {
  MenuHandler,
  MenuViewExtraInfo,
  type IMenuItem,
  type MenuKeys,
  type MenuState,
} from "~/features/menu/typings";
export default function ViewAccess({
  views,
  onChange,
}: {
  views: MenuState | undefined;
  onChange: (key: MenuKeys, value: boolean) => void;
}) {
  const itens = Object.entries(MenuHandler.getMenu())
    .filter(([, item]: [string, IMenuItem]) => !item.denyColabAccess)
    .reduce(
      (acc, [key, item]) => {
        acc[key] = item;
        return acc;
      },
      {} as { [key: string]: IMenuItem }
    );
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`,
        width: "100%",
      }}
    >
      {Object.keys(itens).map((key: string) => (
        <>
          <Paper
            key={key}
            className="flex items-center justify-between gap-2 max-h-[46px]"
            data-tooltip-id={key}
          >
            <p>{itens[key].label}</p>
            <Switch
              checked={views?.[key as MenuKeys]?.access ?? false}
              onChange={(e) => onChange(key as MenuKeys, e.target.checked)}
            />
          </Paper>
          <Tooltip
            id={key}
            content={
              MenuViewExtraInfo[key as keyof typeof MenuViewExtraInfo]
                .description
            }
          />
        </>
      ))}
    </div>
  );
}
