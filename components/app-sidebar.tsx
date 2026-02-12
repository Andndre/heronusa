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
import { ReactNode } from "react";

interface AppSidebarProps {
  children: ReactNode;
}

function AppSidebarContent() {
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
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                <span className="text-xs font-medium">U</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">User</span>
                <span className="text-xs text-muted-foreground">
                  user@example.com
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppSidebar({ children }: AppSidebarProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <AppSidebarContent />
        {children}
      </div>
    </SidebarProvider>
  );
}
