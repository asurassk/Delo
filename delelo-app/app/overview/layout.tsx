import Sidebar from "@/components/layout/Sidebar";
import IntroRedirect from "@/components/layout/IntroRedirect";

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-8 py-8">
        <IntroRedirect>{children}</IntroRedirect>
      </main>
    </div>
  );
}
