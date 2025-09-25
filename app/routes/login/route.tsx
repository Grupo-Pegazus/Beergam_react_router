import { redirect, useActionData } from "react-router";
import type { ApiResponse } from "~/features/apiClient/typings";
import { authService } from "~/features/auth/service";
import { UserSchema, type IUsuario } from "~/features/user/typings";
// import { commitSession, getSession } from "~/sessions";
import { toast } from "react-hot-toast";
import { userCrypto } from "~/features/auth/utils";
import type { Route } from "./+types/route";
import LoginPage from "./page";
// export async function loader({ request }: Route.LoaderArgs) {
//   const session = await getSession(request.headers.get("Cookie"));
//   const userInfo = session.get("userInfo") ?? null;
//   console.log("userInfo do route", userInfo, request);
//   return { userInfo: "jorge" };
// }

// export async function clientLoader({ request }: Route.ClientLoaderArgs) {
//   console.log("clientLoader do route", request);
//   return { userInfo: "jorge" };
// }

interface UserData {
  id: string;
  email: string;
  name: string;
}
const errorResponse = {
  success: false,
  data: {} as UserData,
  message:
    "Erro ao transformar informações do usuário. Tente novamente em alguns instantes.",
  error_code: 500,
  error_fields: {},
};
export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  console.log("formData do route", formData, request);
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await authService.login(email as string, password as string);

  if (!response.success) {
    toast.error(response.message);
    return Response.json(response);
  }
  console.log("response do route", response);
  console.log("request do route", request);

  // const session = await getSession();
  const user = UserSchema.safeParse(response.data);
  if (!user.success) {
    console.log("user invalido", user);
    errorResponse.data = response.data;
    return Response.json(errorResponse);
  }
  await userCrypto.encriptarDadosUsuario(user.data);
  // session.set("userInfo", user.data);

  return redirect("/interno", {
    // headers: {
    //   "Set-Cookie": await commitSession(session),
    // },
  });
}
export default function LoginRoute() {
  // const { userInfo } = useLoaderData<typeof loader>() ?? {};
  const actionResponse = useActionData() as ApiResponse<IUsuario | null>;
  return (
    <>
      <LoginPage actionResponse={actionResponse} />
    </>
  );
}
