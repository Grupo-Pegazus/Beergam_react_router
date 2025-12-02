import Loading from "~/src/assets/loading";

interface LogoutOverlayProps {
  message?: string;
}

export default function LogoutOverlay({
  message = "Saindo da conta...",
}: LogoutOverlayProps) {
  return (
    <div className="fixed inset-0 z-9999 bg-beergam-white/95 flex flex-col items-center justify-center">
      <Loading color="#183153" size="4rem" />
      <p className="mt-6 text-beergam-blue-primary text-lg font-medium">
        {message}
      </p>
    </div>
  );
}


