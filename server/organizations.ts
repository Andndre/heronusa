"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Organization } from "@/lib/generated/prisma/client";
import { headers } from "next/headers";

export async function getOrganizations() {
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  return organizations as Organization[];
}

export async function getOrganizationBySlug(slug: string) {
  const organizations = await prisma.organization.findFirst({
    where: { slug },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });
  return organizations;
}
