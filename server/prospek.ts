"use server";

import prisma from "@/lib/db";
import { getCurrentUser } from "./user";

export async function getProspekData() {
  await getCurrentUser();
  const prospek = await prisma.prospek.findMany();
  return prospek;
}

export type Prospek = Awaited<ReturnType<typeof getProspekData>>[number];
