import { redirect, useActionData, useLoaderData } from "react-router";
import { authService } from "~/features/auth/service";
import { commitSession, getSession } from "~/sessions";
import type { Route } from "./+types/route";
import LoginPage from "./page";
export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userInfo = session.get("userInfo") ?? null;
  return { userInfo };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await authService.login(email as string, password as string);

  if (!response.success) {
    return Response.json(
      { error: response.error ?? "Não foi possível autenticar" },
      { status: response.status ?? 401 }
    );
  }

  const session = await getSession();
  session.set("userInfo", response.data);

  return redirect("/interno", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function LoginRoute() {
  const { userInfo } = useLoaderData<typeof loader>() ?? {};
  const actionData = useActionData() as { error?: string } | undefined;

  return (
    <>
      {/* <h1>Login</h1>
      {userInfo ? <p>Logado como: {userInfo?.name}</p> : null}
      {actionData?.error ? (
        <p style={{ color: "red" }}>{actionData.error}</p>
      ) : null}
      <Form method="post">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            maxWidth: 320,
          }}
        >
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Senha" required />
          <button type="submit">Entrar</button>
        </div>
      </Form> */}
      <LoginPage
        actionError={
          actionData?.error
            ? { error: true, message: actionData.error }
            : { error: false, message: "" }
        }
      />
    </>
  );
}
