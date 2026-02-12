"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const onClick = async () => {
    await authClient.signOut();
    router.push("/login");
  };
  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={onClick}>Logout</Button>
    </div>
  );
}
