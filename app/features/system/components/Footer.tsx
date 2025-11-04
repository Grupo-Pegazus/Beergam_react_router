export default function SystemFooter() {
    const year = new Date().getFullYear();
    return (
      <footer className="border-t border-black/15 shadow-layout-primary bg-beergam-blue-primary text-white pt-4 md:pb-4 pb-24 px-4 text-center">
        <span>
          © {year} Beergam. Todos os direitos reservados.
        </span>
      </footer>
    );
  }