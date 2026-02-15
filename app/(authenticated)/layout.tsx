import { AppSidebar } from "@/components/app-sidebar";
import { AppNavbar } from "@/components/app-navbar";
import { SidebarInset } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getOrganizations } from "@/server/organizations";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      }
    >
      <AuthenticatedContent>{children}</AuthenticatedContent>
    </Suspense>
  );
}

async function AuthenticatedContent({ children }: { children: React.ReactNode }) {
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
        <div className="bg-background flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </AppSidebar>
  );
}
