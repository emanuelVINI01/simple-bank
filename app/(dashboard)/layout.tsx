import { DashboardHeader } from "@/components/layout/dashboard-header";
import { AppFooter } from "@/components/layout/app-footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
