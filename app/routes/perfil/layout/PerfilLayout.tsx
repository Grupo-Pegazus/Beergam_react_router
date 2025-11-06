import PerfilBottomNav from "./mobile/PerfilBottomNav";

interface PerfilLayoutProps {
  children: React.ReactNode;
  activeButton: string;
  onSelectButton: (button: string) => void;
}

export default function PerfilLayout({ children, activeButton, onSelectButton }: PerfilLayoutProps) {
  return (
    <>
      {children}
      <PerfilBottomNav activeButton={activeButton} onSelect={onSelectButton} />
    </>
  );
}

