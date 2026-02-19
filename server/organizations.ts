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

  return organizations as Organization[];
}

export async function getInitialOrganization(userId: string) {
  const member = await prisma.member.findFirst({
    where: {
      userId,
    },
  });

  if (!member) return null;

  const organization = await prisma.organization.findUnique({
    where: {
      id: member.organizationId,
    },
  });

  return organization as Organization;
}
