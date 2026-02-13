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
