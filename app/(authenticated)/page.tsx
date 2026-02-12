"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const onClick = async () => {
    await signOut();
    redirect("/login");
  };
  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={onClick}>Logout</Button>
    </div>
  );
}
