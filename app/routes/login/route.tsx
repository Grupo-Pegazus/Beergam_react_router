import { redirect } from "react-router";
import { authService } from "~/features/auth/service";
import { UserRoles, type IBaseUser } from "~/features/user/typings/BaseUser";
import { UserSchema, type IUser } from "~/features/user/typings/User";
// import { commitSession, getSession } from "~/sessions";
import { toast } from "react-hot-toast";
import { cryptoUser } from "~/features/auth/utils";
import { ColabSchema, type IColab } from "~/features/user/typings/Colab";
import { isMaster } from "~/features/user/utils";
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
const errorResponse = {
  success: false,
  data: {} as IUser | IBaseUser,
  message:
    "Erro ao transformar informações do usuário. Tente novamente em alguns instantes.",
  error_code: 500,
  error_fields: {},
};

function FormSanitizer(formData: FormData, role: UserRoles) {
  if (role === UserRoles.MASTER) {
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
  const formInfo = FormSanitizer(formData, role as UserRoles);

  const responsePromise = authService
    .login(formInfo, role as UserRoles)
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
    let user = null;
    const isMasterUser = isMaster(response.data as IUser);
    if (isMasterUser) {
      user = UserSchema.safeParse(response.data);
    } else {
      user = ColabSchema.safeParse(response.data as IColab);
    }
    if (!user?.success) {
      console.log("user invalido", user);
      errorResponse.data = response.data;
      toast.error(
        "Erro ao transformar informações do usuário. Tente novamente em alguns instantes."
      );
      return Response.json(errorResponse);
    }
    if (isMasterUser) {
      await cryptoUser.encriptarDados(user.data as IUser);
    } else {
      await cryptoUser.encriptarDados(user.data as IColab);
    }
    // session.set("userInfo", user.data);

    console.log("user.data.details.subscription", user.data.details.subscription);
    if ( user.data.details.subscription === null || user.data.details.subscription?.start_date === null) {
      return redirect("/interno/subscription", {});
    }

    return redirect("/interno/choosen_account", {});
  } catch (error) {
    console.error("Erro no login:", error);
    return Response.json({
      success: false,
      message: error instanceof Error ? error.message : "Erro ao fazer login",
      error_code: 500,
      error_fields: {},
      data: {} as IUser | IBaseUser,
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
