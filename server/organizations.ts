"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Organization } from "@/lib/generated/prisma/client";
import { headers } from "next/headers";
import { getCurrentUser } from "./user";

export async function getOrganizations() {
  const { session } = await getCurrentUser();

  const members = await prisma.member.findMany({
    where: {
      userId: session.userId,
    },
  });

  const organizations = await prisma.organization.findMany({
    where: {
      id: {
        in: members.map((member) => member.organizationId),
      },
    },
  });

  console.log("Organizations:", organizations);

  return organizations as Organization[];
}

export async function getActiveOrganizationId() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    return null;
  }

  return data.session.activeOrganizationId;
}

export async function getActiveOrganizationData() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    return null;
  }

  const organizationId = data.session.activeOrganizationId;

  if (!organizationId) {
    return null;
  }

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  return organization;
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
