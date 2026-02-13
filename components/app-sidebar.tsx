"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { User } from "better-auth";
import {
  CreditCard,
  FileCheck,
  FileText,
  Home,
  Package,
  Truck,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface AppSidebarProps {
  children: ReactNode;
  user: User;
}

interface AppSidebarContentProps {
  user: User;
}

function AppSidebarContent({ user }: AppSidebarContentProps) {
  const pathname = usePathname();

  const items = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Manajemen Prospek",
      url: "/prospek",
      icon: Users,
    },
    {
      title: "SPK & Diskon",
      url: "/spk",
      icon: FileText,
    },
    {
      title: "Pembayaran & Leasing",
      url: "/payment",
      icon: CreditCard,
    },
    {
      title: "Surat Jalan",
      url: "/surat-jalan",
      icon: Truck,
    },
    {
      title: "Dokumen Kendaraan",
      url: "/dokumen-kendaraan",
      icon: FileCheck,
    },
    {
      title: "Inventori",
      url: "/inventori",
      icon: Package,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-center gap-2 px-2 py-2">
          <Image
            src="/images/logo.webp"
            alt="Heronusa Logo"
            width={200}
            height={63}
            className="h-12 w-auto"
            loading="eager"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted">
            <span className="text-xs font-medium">U</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppSidebar({ children, user }: AppSidebarProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <AppSidebarContent user={user} />
        {children}
      </div>
    </SidebarProvider>
  );
}
