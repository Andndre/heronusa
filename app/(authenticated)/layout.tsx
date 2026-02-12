import { AppSidebar } from "@/components/app-sidebar";
import { AppNavbar } from "@/components/app-navbar";
import { SidebarInset } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "user@example.com",
  };

  return (
    <AppSidebar>
      <SidebarInset>
        <AppNavbar user={user} />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </SidebarInset>
    </AppSidebar>
  );
}
