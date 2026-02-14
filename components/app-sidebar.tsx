"use client";

import { createContext, useContext, useState, ReactNode } from "react";
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
import { RightSidebar, RightSidebarView } from "@/components/right-sidebar";

interface AppSidebarProps {
  children: ReactNode;
  user: User;
}

interface RightSidebarContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  view: RightSidebarView;
  setView: (view: RightSidebarView) => void;
  content: ReactNode | null;
  setContent: (content: ReactNode | null) => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
}

const RightSidebarContext = createContext<RightSidebarContextProps | null>(
  null,
);

export function useRightSidebar() {
  const context = useContext(RightSidebarContext);
  if (!context) {
    throw new Error("useRightSidebar must be used within AppSidebar.");
  }
  return context;
}

interface AppSidebarContentProps {
  user: User;
}

function AppSidebarContent({ user }: AppSidebarContentProps) {
  const pathname = usePathname();

  const items = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Manajemen Prospek", url: "/prospek", icon: Users },
    { title: "SPK & Diskon", url: "/spk", icon: FileText },
    { title: "Pembayaran & Leasing", url: "/payment", icon: CreditCard },
    { title: "Surat Jalan", url: "/surat-jalan", icon: Truck },
    { title: "Dokumen Kendaraan", url: "/dokumen-kendaraan", icon: FileCheck },
    { title: "Inventori", url: "/inventori", icon: Package },
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
  const [rightOpen, setRightOpen] = useState(false);
  const [rightView, setRightView] = useState<RightSidebarView>("none");
  const [rightContent, setRightContent] = useState<ReactNode | null>(null);
  const [rightTitle, setRightTitle] = useState("");
  const [rightDescription, setRightDescription] = useState("");

  const handleCloseRightSidebar = () => setRightOpen(false);

  return (
    <SidebarProvider>
      <RightSidebarContext.Provider
        value={{
          open: rightOpen,
          setOpen: setRightOpen,
          view: rightView,
          setView: setRightView,
          content: rightContent,
          setContent: setRightContent,
          title: rightTitle,
          setTitle: setRightTitle,
          description: rightDescription,
          setDescription: setRightDescription,
        }}
      >
        <AppSidebarContent user={user} />
        {children}
        <RightSidebar
          open={rightOpen}
          onOpenChange={(open) => {
            setRightOpen(open);
            if (!open) handleCloseRightSidebar();
          }}
          view={rightView}
          title={rightTitle}
          description={rightDescription}
        >
          {rightContent}
        </RightSidebar>
      </RightSidebarContext.Provider>
    </SidebarProvider>
  );
}
