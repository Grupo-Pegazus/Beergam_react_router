import RegistroPage from "./page";

export default function RegistroRoute() {
  return (
    <RegistroPage
      actionResponse={{
        success: true,
        data: null,
        message: "",
        error_code: 0,
        error_fields: {},
      }}
    />
  );
}
