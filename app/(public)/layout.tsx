import { PublicHeader } from "@/components/layout/public-header";
import { AppFooter } from "@/components/layout/app-footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
