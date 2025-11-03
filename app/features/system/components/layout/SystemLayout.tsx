import SystemHeader from "../Header";
import SystemFooter from "../Footer";

interface SystemLayoutProps {
  children: React.ReactNode;
}

export default function SystemLayout({ children }: SystemLayoutProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        color: "#111827",
      }}
    >
      <main
        style={{
          width: "100%",
          paddingTop: 56,
        }}
      >
        <SystemHeader />
        <section
          style={{
            background: "#f9f9f9",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            padding: 16,
            minHeight: 400,
          }}
        >
          {children}

        </section>
      </main>

      <SystemFooter />
    </div>
  );
}