export default function SystemFooter() {
    const year = new Date().getFullYear();
    return (
      <footer
        style={{
          borderTop: "1px solid #e5e7eb",
          color: "#6b7280",
          fontSize: "12px",
          padding: "12px 16px",
          textAlign: "center",
        }}
      >
        <span>
          © {year} • Beergam • Todos os direitos reservados
        </span>
      </footer>
    );
  }