"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findFirst({
    where: { id: session.user.id },
  });

  if (!currentUser) {
    redirect("/login");
  }

  return { ...session, currentUser };
}
