import SystemHeader from "../Header";
import SystemFooter from "../Footer";
import SystemBreadcrumb from "../Breadcrumb";

interface SystemLayoutProps {
  children: React.ReactNode;
}

export default function SystemLayout({ children }: SystemLayoutProps) {
  return (
    <div className="min-h-screen text-[#111827]">
      <main
        className="w-full md:pt-14 pt-0"
      >
        <SystemHeader />
        <section
          className="bg-[#f9f9f9] shadow-sm p-4 min-h-[400px] pb-4"
        >
          <div className="mb-4">
            <SystemBreadcrumb />
          </div>
          {children}

        </section>
      </main>

      <SystemFooter />
    </div>
  );
}