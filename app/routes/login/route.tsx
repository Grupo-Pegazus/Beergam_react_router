import { redirect, useActionData, useLoaderData } from "react-router";
import type { ApiResponse } from "~/features/apiClient/typings";
import { authService } from "~/features/auth/service";
import { UserSchema } from "~/features/user/typings";
import { commitSession, getSession } from "~/sessions";
import type { Route } from "./+types/route";
import LoginPage from "./page";
export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userInfo = session.get("userInfo") ?? null;
  return { userInfo };
}
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

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await authService.login(email as string, password as string);

  if (!response.success) {
    return Response.json(response);
  }
  console.log("response do route", response);
  const session = await getSession();
  const user = UserSchema.safeParse(response.data);
  if (!user.success) {
    console.log("user invalido", user);
    errorResponse.data = response.data;
    return Response.json(errorResponse);
  }

  return redirect("/interno", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function LoginRoute() {
  const { userInfo } = useLoaderData<typeof loader>() ?? {};
  const actionResponse = useActionData() as ApiResponse<any>;
  return (
    <>
      <LoginPage actionResponse={actionResponse} />
    </>
  );
}
