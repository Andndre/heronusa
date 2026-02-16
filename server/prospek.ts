"use server";

import prisma from "@/lib/db";
import { getCurrentUser } from "./user";
import { Prisma } from "@/lib/generated/prisma/client";
import { cacheTag, revalidateTag } from "next/cache";

export async function searchModels(query?: string) {
  "use cache";
  cacheTag("master-data");
  const models = await prisma.masterModel.findMany({
    where: query
      ? {
          nama_model: {
            contains: query,
          },
        }
      : undefined,
    orderBy: { nama_model: "asc" },
    take: 50,
  });

  return models.map((model) => ({
    id: model.id,
    nama_model: model.nama_model,
  }));
}

export async function searchWarnas(query?: string) {
  "use cache";
  cacheTag("master-data");
  const warnas = await prisma.masterWarna.findMany({
    where: query
      ? {
          warna: {
            contains: query,
          },
        }
      : undefined,
    orderBy: { warna: "asc" },
    take: 50,
  });

  return warnas.map((warna) => ({
    id: warna.id,
    warna: warna.warna,
  }));
}

export async function searchSubSumberProspek(query?: string) {
  "use cache";
  cacheTag("master-data");
  const subSumber = await prisma.subSumberProspek.findMany({
    where: {
      status: "ACTIVE",
      ...(query
        ? {
            nama_subsumber: {
              contains: query,
            },
          }
        : {}),
    },
    orderBy: { nama_subsumber: "asc" },
    take: 50,
  });

  return subSumber.map((item) => ({
    id: item.id,
    nama_subsumber: item.nama_subsumber,
  }));
}

export async function searchKelurahans(query?: string) {
  "use cache";
  cacheTag("master-data");
  const kelurahans = await prisma.kelurahan.findMany({
    where: query
      ? {
          nama_kelurahan: {
            contains: query,
          },
        }
      : undefined,
    orderBy: { nama_kelurahan: "asc" },
    take: 50,
  });

  return kelurahans.map((item) => ({
    id: item.id,
    nama_kelurahan: item.nama_kelurahan,
  }));
}

export async function getDropdownData() {
  "use cache";
  cacheTag("master-data");

  const [models, warnas, subSumberProspek, kelurahans] = await Promise.all([
    searchModels(),
    searchWarnas(),
    searchSubSumberProspek(),
    searchKelurahans(),
  ]);

  return {
    models,
    warnas,
    subSumberProspek,
    kelurahans,
  };
}

async function fetchProspekData(activeOrganizationId: string, page: number, pageSize: number) {
  "use cache";
  cacheTag(`prospek-org-${activeOrganizationId}`);

  const skip = (page - 1) * pageSize;

  const [prospek, totalCount] = await Promise.all([
    prisma.prospek.findMany({
      where: {
        deletedAt: null,
        cabangId: activeOrganizationId,
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
      skip,
      take: pageSize,
    }),
    prisma.prospek.count({
      where: {
        deletedAt: null,
        cabangId: activeOrganizationId,
      },
    }),
  ]);

  const serializedProspek = prospek.map((item) => ({
    ...item,
    model: {
      ...item.model,
      harga_otr: Number(item.model.harga_otr),
    },
  }));

  return {
    data: serializedProspek,
    totalCount,
    pageCount: Math.ceil(totalCount / pageSize),
  };
}

export async function getProspekData(page: number = 1, pageSize: number = 10) {
  const { session } = await getCurrentUser();
  const activeOrganizationId = session?.activeOrganizationId;

  if (!activeOrganizationId) {
    return { data: [], totalCount: 0, pageCount: 0 };
  }

  return fetchProspekData(activeOrganizationId, page, pageSize);
}

export type ProspekResponse = Awaited<ReturnType<typeof getProspekData>>;
export type Prospek = ProspekResponse["data"][number];

export async function createProspek(
  data: Omit<Prisma.ProspekCreateInput, "cabang" | "sales" | "id">
) {
  const { currentUser, session } = await getCurrentUser();
  const activeOrganizationId = session?.activeOrganizationId;

  if (!activeOrganizationId) {
    throw new Error("No active organization");
  }

  const result = await prisma.prospek.create({
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

  revalidateTag(`prospek-org-${activeOrganizationId}`, "max");
  return result;
}

export async function updateProspek(
  id: string,
  data: Omit<Prisma.ProspekUpdateInput, "cabang" | "sales" | "id">
) {
  const { session } = await getCurrentUser();
  const activeOrganizationId = session?.activeOrganizationId;

  if (!activeOrganizationId) {
    throw new Error("No active organization");
  }

  const prospek = await prisma.prospek.findUnique({
    where: { id },
  });

  if (!prospek) {
    throw new Error("Prospek not found");
  }

  if (prospek.cabangId !== activeOrganizationId) {
    throw new Error("Not authorized");
  }

  const result = await prisma.prospek.update({
    where: { id },
    data,
  });

  revalidateTag(`prospek-org-${activeOrganizationId}`, "max");
  return result;
}

export async function deleteProspek(id: string) {
  const { currentUser, session } = await getCurrentUser();
  const activeOrganizationId = session?.activeOrganizationId;

  if (!activeOrganizationId) {
    throw new Error("No active organization");
  }

  const prospek = await prisma.prospek.findUnique({
    where: { id },
  });

  if (!prospek) {
    throw new Error("Prospek not found");
  }

  if (prospek.salesId !== currentUser.id) {
    throw new Error("Not authorized");
  }

  const result = await prisma.prospek.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });

  revalidateTag(`prospek-org-${activeOrganizationId}`, "max");
  return result;
}
