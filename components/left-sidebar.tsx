"use client";

import { useState } from "react";
import { CreditCard, FileCheck, FileText, Home, Package, Search, Truck, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
  SidebarRail,
} from "@/components/ui/sidebar";
import { GlobalCommandDialog, useCommandShortcut } from "@/components/command-dialog";

export function LeftSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [commandOpen, setCommandOpen] = useState(false);

  useCommandShortcut(() => setCommandOpen((prev) => !prev));

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
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-center gap-2 px-2 py-2">
          <Image
            src="/images/logo.webp"
            alt="Heronusa Logo"
            width={200}
            height={63}
            className="h-10 w-auto object-contain"
            loading="eager"
            priority
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigasi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      aria-current={pathname === item.url}
                      tooltip={item.title}
                      onMouseEnter={() => {
                        if (item.url !== "#") router.prefetch(item.url);
                      }}
                    >
                      <Link href={item.url} prefetch={false}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 px-2"
          onClick={() => setCommandOpen(true)}
        >
          <Search className="h-4 w-4 shrink-0" />
          <div className="flex flex-1 flex-col items-start">
            <span className="text-sm font-medium">Cari</span>
            <span className="text-muted-foreground text-xs">Navigasi cepat fitur...</span>
          </div>
          <kbd className="bg-muted text-muted-foreground pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </SidebarFooter>
      <GlobalCommandDialog open={commandOpen} onOpenChange={setCommandOpen} />
      <SidebarRail />
    </Sidebar>
  );
}
