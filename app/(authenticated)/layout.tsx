import { AppSidebar } from "@/components/app-sidebar";
import { AppNavbar } from "@/components/app-navbar";
import { SidebarInset } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getOrganizations } from "@/server/organizations";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const organizations = await getOrganizations();

  if (!user) {
    throw new Error("User not found in session");
  }

  return (
    <AppSidebar user={user}>
      <SidebarInset>
        <AppNavbar user={user} organizations={organizations} />
        <main className="flex-1 overflow-auto bg-background p-6">
          {children}
        </main>
      </SidebarInset>
    </AppSidebar>
  );
}
