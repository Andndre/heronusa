"use server";

import { auth } from "@/lib/auth";
import { Organization } from "@/lib/generated/prisma/client";
import { headers } from "next/headers";

export async function getOrganizations() {
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  return organizations as Organization[];
}
