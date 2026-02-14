"use server";

import prisma from "@/lib/db";
import { getCurrentUser } from "./user";
import { Prisma } from "@/lib/generated/prisma/client";

export async function getDropdownData() {
  const [models, warnas, subSumberProspek, kelurahans] = await Promise.all([
    prisma.masterModel.findMany({
      orderBy: { nama_model: "asc" },
      take: 100,
    }),
    prisma.masterWarna.findMany({
      orderBy: { warna: "asc" },
      take: 100,
    }),
    prisma.subSumberProspek.findMany({
      where: { status: "ACTIVE" },
      orderBy: { nama_subsumber: "asc" },
      take: 100,
    }),
    prisma.kelurahan.findMany({
      orderBy: { nama_kelurahan: "asc" },
      take: 500,
    }),
  ]);

  // Convert Decimal fields to numbers for client components
  const serializedModels = models.map((model) => ({
    ...model,
    harga_otr: model.harga_otr ? Number(model.harga_otr) : null,
  }));

  return {
    models: serializedModels,
    warnas,
    subSumberProspek,
    kelurahans,
  };
}

export async function getProspekData() {
  const { session } = await getCurrentUser();
  const activeOrganizationId = session?.activeOrganizationId;

  // TODO: Add authorization
  const prospek = await prisma.prospek.findMany({
    where: {
      deletedAt: null,
      cabangId: activeOrganizationId ?? undefined,
    },
    include: {
      cabang: true,
      subSumber: true,
      model: true,
      warna: true,
      kelurahan: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert Decimal fields to numbers for client components
  const serializedProspek = prospek.map((item) => ({
    ...item,
    model: {
      ...item.model,
      harga_otr: Number(item.model.harga_otr),
    },
  }));

  return serializedProspek;
}

export type Prospek = Awaited<ReturnType<typeof getProspekData>>[number];

export async function createProspek(
  data: Omit<Prisma.ProspekCreateInput, "cabang" | "sales" | "id">,
) {
  const { currentUser, session } = await getCurrentUser();
  const activeOrganizationId = session?.activeOrganizationId;

  if (!activeOrganizationId) {
    throw new Error("No active organization");
  }

  return prisma.prospek.create({
    data: {
      ...data,
      cabang: {
        connect: {
          id: activeOrganizationId,
        },
      },
      sales: {
        connect: {
          id: currentUser.id,
        },
      },
    },
  });
}

export async function deleteProspek(id: string) {
  const { currentUser } = await getCurrentUser();

  const prospek = await prisma.prospek.findUnique({
    where: { id },
  });

  if (!prospek) {
    throw new Error("Prospek not found");
  }

  // Check authorization
  if (prospek.salesId !== currentUser.id) {
    throw new Error("Not authorized");
  }

  // Soft delete
  return prisma.prospek.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
}

export async function getProspekById(id: string) {
  const { currentUser } = await getCurrentUser();

  const prospek = await prisma.prospek.findUnique({
    where: { id },
    include: {
      cabang: true,
      subSumber: true,
      model: true,
      warna: true,
      kelurahan: true,
      sales: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      followUps: {
        orderBy: {
          tanggal: "desc",
        },
        take: 10,
      },
    },
  });

  if (!prospek) {
    throw new Error("Prospek not found");
  }

  const sessions = await prisma.session.findMany({
    where: {
      userId: currentUser.id,
    },
    orderBy: {
      expiresAt: "desc",
    },
    take: 1,
  });

  const activeOrganizationId = sessions[0]?.activeOrganizationId;

  // Check authorization - user must be in the same organization
  if (prospek.cabangId !== activeOrganizationId) {
    throw new Error("Not authorized");
  }

  return prospek;
}
