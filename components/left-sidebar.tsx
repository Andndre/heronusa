"use client";

import { User } from "better-auth";
import { CreditCard, FileCheck, FileText, Home, Package, Truck, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "@/components/ui/sidebar";

interface LeftSidebarProps {
  user: User;
}

export function LeftSidebar({ user }: LeftSidebarProps) {
  const pathname = usePathname();

  const items = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Manajemen Prospek", url: "/prospek", icon: Users },
    { title: "SPK & Diskon", url: "/spk", icon: FileText },
    { title: "Pembayaran & Leasing", url: "#", icon: CreditCard },
    { title: "Surat Jalan", url: "#", icon: Truck },
    { title: "Dokumen Kendaraan", url: "#", icon: FileCheck },
    { title: "Inventori", url: "#", icon: Package },
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
          <div className="bg-muted flex size-8 items-center justify-center rounded-full">
            <span className="text-xs font-medium">U</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-muted-foreground text-xs">{user.email}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
