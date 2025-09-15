import type { AxiosInstance } from "axios";

export async function setupAuthInterceptor(client: AxiosInstance) {
  //   client.interceptors.request.use(async (config) => {
  //     const session = await getSession();
  //     if (session.has("JWT")) {
  //       config.headers.Authorization = `Bearer ${session.get("JWT")}`;
  //     }
  //     return config;
  //   });

  //   client.interceptors.response.use(async (response) => {
  //     const session = await getSession();
  //     if (session.has("JWT")) {
  //       session.set("JWT", response.data.token);
  //     }
  //     return response;
  //   });
  client.interceptors.request.use(async (config) => {
    const acess_token = config.headers.get("Set-Cookie");
    return config;
  });
}
