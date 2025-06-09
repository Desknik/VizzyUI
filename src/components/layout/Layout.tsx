
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AuroraBackground } from "@/components/ui/aurora-background";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <AuroraBackground className="min-h-screen flex flex-col h-auto" showRadialGradient={false}>
      <Navbar />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
    </AuroraBackground>
  );
}
