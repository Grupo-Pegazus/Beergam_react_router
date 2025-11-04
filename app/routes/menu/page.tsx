import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import MenuOverlay from "~/features/system/components/mobile/MenuOverlay";

export default function MenuPage() {
  return (
    <PageLayout>
      {/* Renderiza como página dedicada em viewport completa */}
      <div className="relative min-h-[70vh]">
        <MenuOverlay onClose={() => history.back()} />
      </div>
    </PageLayout>
  );
}


