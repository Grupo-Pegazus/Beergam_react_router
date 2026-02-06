import SystemBreadcrumb from "../Breadcrumb";
import SystemHeader from "../Header";

interface SystemLayoutProps {
  children: React.ReactNode;
}

export default function SystemLayout({ children }: SystemLayoutProps) {
  return (
    <main className="w-full md:pt-0 pt-8 max-w-screen h-full max-h-screen pb-5">
      <SystemHeader />
      <section
        id="system-scroll-container"
        className="w-full max-h-full h-full pb-20 md:pb-0 md:h-[calc(100%-52px)] md:ml-[100px] p-5 overflow-auto rounded-2xl bg-beergam-layout-background md:block md:w-[calc(100vw-120px)]!"
      >
        <div>
          <div className="mb-4">
            <SystemBreadcrumb />
          </div>
          {children}
          {/* <SystemFooter /> */}
        </div>
      </section>
    </main>
  );
}
