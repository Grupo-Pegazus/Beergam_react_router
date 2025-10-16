import { Switch } from "@mui/material";
import { type IMenuConfig } from "~/features/menu/typings";
export default function ViewAccess(view: IMenuConfig[keyof IMenuConfig]) {
  return (
    <div className="flex items-center justify-between gap-2 shadow-lg/20 rounded-md p-2 max-h-[46px]">
      <p>{view.label}</p>
      <Switch checked={view.active} />
    </div>
  );
}
