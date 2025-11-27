import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
export default function ConfigPage() {
  return (
    // <main className="min-h-full bg-beergam-orange overflow-x-hidden">
    //   <ConfigHeader />
    //   <ParticlesBackground />
    // </main>
    <PageLayout tailwindClassName="flex items-center justify-center min-h-screen py-12">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Configurações</h1>
      </div>
    </PageLayout>
  );
}
