import { redirect } from "react-router";
import { authService } from "~/features/auth/service";
import { UserSchema, UsuarioRoles } from "~/features/user/typings";
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

function FormSanitizer(formData: FormData, role: UsuarioRoles) {
  if (role === UsuarioRoles.MASTER) {
    return {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
  }
  return {
    master_pin: formData.get("master_pin") as string,
    pin: formData.get("pin") as string,
    password: formData.get("password") as string,
  };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const role = formData.get("role");
  const formInfo = FormSanitizer(formData, role as UsuarioRoles);

  const responsePromise = authService
    .login(formInfo, role as UsuarioRoles)
    .then((response) => {
      if (!response.success) {
        // Rejeita a Promise se o login falhar
        const errorObj = new Error(response.message || "Erro ao fazer login");
        Object.assign(errorObj, { ...response });
        throw errorObj;
      }
      return response;
    })
    .finally(() => {
      localStorage.setItem("loginLoading", "false");
    });

  toast.promise(responsePromise, {
    loading: "Carregando...",
    success: "Login realizado com sucesso",
    error: (err) => (
      <div>
        <p className="text-nowrap">{`${err.message || "Erro ao fazer login"}`}</p>
        <p>
          <u>Código: {err.error_code}</u>
        </p>
      </div>
    ),
  });

  // Use try/catch para lidar com a Promise rejeitada
  try {
    const response = await responsePromise;

    console.log("response do route", response);
    console.log("request do route", request);

    // Continuar com o código existente...
    const user = UserSchema.safeParse(response.data);
    if (!user.success) {
      console.log("user invalido", user);
      errorResponse.data = response.data;
      toast.error(
        "Erro ao transformar informações do usuário. Tente novamente em alguns instantes."
      );
      return Response.json(errorResponse);
    }
    await userCrypto.encriptarDadosUsuario(user.data);
    // session.set("userInfo", user.data);

    return redirect("/interno", {
      // headers: {
      //   "Set-Cookie": await commitSession(session),
      // },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return Response.json({
      success: false,
      message: error instanceof Error ? error.message : "Erro ao fazer login",
      error_code: 500,
      error_fields: {},
      data: {} as UserData,
    });
  }
}
export default function LoginRoute() {
  // const { userInfo } = useLoaderData<typeof loader>() ?? {};
  return (
    <>
      <LoginPage />
    </>
  );
}
