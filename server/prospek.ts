"use server";

import prisma from "@/lib/db";
import { getCurrentUser } from "./user";

export async function getProspekData() {
  await getCurrentUser();
  // TODO: Add authorization & filter based on active Cabang
  const prospek = await prisma.prospek.findMany();
  return prospek;
}

export type Prospek = Awaited<ReturnType<typeof getProspekData>>[number];
