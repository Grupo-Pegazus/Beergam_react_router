// import { useForm } from "react-hook-form";
import type { IColab } from "~/features/user/typings/Colab";
import { type IUser } from "~/features/user/typings/User";
import { isColab, isMaster } from "~/features/user/utils";
import ColabForm from "./ColabForm";
import UserForm from "./UserForm";
export default function MinhaConta({ user }: { user: IUser | IColab }) {
  return (
    <>
      {isMaster(user) && <UserForm user={user} />}
      {isColab(user) && <ColabForm user={user} />}
    </>
  );
}
