"use server";

import prisma from "@/lib/db";
import { getCurrentUser } from "./user";
import { Prisma, StatusProspek } from "@/lib/generated/prisma/client";
import { cacheTag, revalidateTag } from "next/cache";
import { VALID_STATUS_VALUES } from "@/lib/prospek-shared";

// Helper for testing slow server response
// Set env var TEST_DELAY=5000 to simulate 5 second delay
async function testDelay() {
  const delay = Number(process.env.TEST_DELAY || "0");
  if (delay > 0) {
    console.log(`[TEST] Simulating server delay: ${delay}ms`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

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

async function fetchProspekData(
  activeOrganizationId: string,
  page: number,
  pageSize: number,
  query?: string,
  columnFilters?: Record<string, string>
) {
  "use cache";
  cacheTag(`prospek-org-${activeOrganizationId}`);

  const skip = (page - 1) * pageSize;

  // Build where clause from column filters
  const filterClause: Prisma.ProspekWhereInput = {};

  if (columnFilters) {
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (!value || value === "ALL") return;

      switch (key) {
        case "nama_konsumen":
          filterClause.nama_konsumen = { contains: value };
          break;
        case "hp1":
          filterClause.OR = [{ hp1: { contains: value } }, { hp2: { contains: value } }];
          break;
        case "kelurahan":
          filterClause.kelurahan = { nama_kelurahan: { contains: value } };
          break;
        case "model":
          filterClause.model = { nama_model: { contains: value } };
          break;
        case "status": {
          // For enum, exact match with validation
          if (VALID_STATUS_VALUES.includes(value as StatusProspek)) {
            filterClause.status = value as StatusProspek;
          }
          break;
        }
      }
    });
  }

  const whereClause: Prisma.ProspekWhereInput = {
    deletedAt: null,
    cabangId: activeOrganizationId,
    ...filterClause,
    ...(query
      ? {
          OR: [
            { nama_konsumen: { contains: query } },
            { hp1: { contains: query } },
            { hp2: { contains: query } },
            { model: { nama_model: { contains: query } } },
            { kelurahan: { nama_kelurahan: { contains: query } } },
            { sales: { name: { contains: query } } },
          ],
        }
      : {}),
  };

  const [prospek, totalCount] = await Promise.all([
    prisma.prospek.findMany({
      where: whereClause,
      include: {
        cabang: true,
        sales: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subSumber: {
          include: {
            sumberProspek: true,
          },
        },
        model: true,
        warna: true,
        kelurahan: {
          include: {
            kecamatan: {
              include: {
                kabupaten: true,
              },
            },
          },
        },
        pelanggan: true,
        followUps: {
          orderBy: { tanggal: "desc" },
          include: {
            sales: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        pembayarans: {
          orderBy: { createdAt: "desc" },
        },
        spk: {
          include: {
            pelanggan: true,
            unit: {
              include: {
                model: true,
                warna: true,
              },
            },
          },
        },
        leasingOrder: {
          include: {
            leasing: true,
            pembayaran: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
    }),
    prisma.prospek.count({
      where: whereClause,
    }),
  ]);

  const serializedProspek = prospek.map((item) => ({
    ...item,
    model: {
      ...item.model,
      harga_otr: Number(item.model.harga_otr),
    },
    spk: item.spk
      ? {
          ...item.spk,
          totalTagihan: Number(item.spk.totalTagihan),
          totalDibayar: Number(item.spk.totalDibayar),
          diskonPengajuan: item.spk.diskonPengajuan ? Number(item.spk.diskonPengajuan) : null,
          diskonDisetujui: item.spk.diskonDisetujui ? Number(item.spk.diskonDisetujui) : null,
        }
      : null,
    leasingOrder: item.leasingOrder
      ? {
          ...item.leasingOrder,
          jumlahPiutang: Number(item.leasingOrder.jumlahPiutang),
        }
      : null,
    pembayarans: item.pembayarans.map((p) => ({
      ...p,
      jumlah: Number(p.jumlah),
    })),
  }));

  return {
    data: serializedProspek,
    totalCount,
    pageCount: Math.ceil(totalCount / pageSize),
  };
}

export async function getProspekData(
  page: number = 1,
  pageSize: number = 10,
  query?: string,
  columnFilters?: Record<string, string>
) {
  const { session } = await getCurrentUser();
  const activeOrganizationId = session?.activeOrganizationId;

  if (!activeOrganizationId) {
    return { data: [], totalCount: 0, pageCount: 0 };
  }

  return fetchProspekData(activeOrganizationId, page, pageSize, query, columnFilters);
}

// ProspekResponse is the response from getProspekData - returns full ProspekDetail items
export type ProspekResponse = Awaited<ReturnType<typeof getProspekData>>;

// Prospek is now the same as ProspekDetail - used in datatable and client components
export type Prospek = ProspekResponse["data"][number];

export async function createProspek(
  data: Omit<Prisma.ProspekCreateInput, "cabang" | "sales" | "id">
) {
  await testDelay(); // Simulate slow server for testing

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
  data: Omit<Prisma.ProspekUpdateInput, "cabang" | "sales">
) {
  await testDelay(); // Simulate slow server for testing

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
  revalidateTag(`prospek-detail-${id}`, "max");
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
  revalidateTag(`prospek-detail-${id}`, "max");
  return result;
}

async function fetchProspekDetailData(id: string) {
  "use cache";
  cacheTag(`prospek-detail-${id}`);

  const prospek = await prisma.prospek.findUnique({
    where: { id },
    include: {
      cabang: true,
      sales: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      subSumber: {
        include: {
          sumberProspek: true,
        },
      },
      model: true,
      warna: true,
      kelurahan: {
        include: {
          kecamatan: {
            include: {
              kabupaten: true,
            },
          },
        },
      },
      pelanggan: true,
      followUps: {
        orderBy: { tanggal: "desc" },
        include: {
          sales: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      pembayarans: {
        orderBy: { createdAt: "desc" },
      },
      spk: {
        include: {
          pelanggan: true,
          unit: {
            include: {
              model: true,
              warna: true,
            },
          },
        },
      },
      leasingOrder: {
        include: {
          leasing: true,
          pembayaran: true,
        },
      },
    },
  });

  if (!prospek) return null;

  // Convert Decimal to number
  return {
    ...prospek,
    model: {
      ...prospek.model,
      harga_otr: Number(prospek.model.harga_otr),
    },
    spk: prospek.spk
      ? {
          ...prospek.spk,
          totalTagihan: Number(prospek.spk.totalTagihan),
          totalDibayar: Number(prospek.spk.totalDibayar),
          diskonPengajuan: prospek.spk.diskonPengajuan ? Number(prospek.spk.diskonPengajuan) : null,
          diskonDisetujui: prospek.spk.diskonDisetujui ? Number(prospek.spk.diskonDisetujui) : null,
        }
      : null,
    leasingOrder: prospek.leasingOrder
      ? {
          ...prospek.leasingOrder,
          jumlahPiutang: Number(prospek.leasingOrder.jumlahPiutang),
        }
      : null,
    pembayarans: prospek.pembayarans.map((p) => ({
      ...p,
      jumlah: Number(p.jumlah),
    })),
  };
}

export async function getProspekDetail(id: string) {
  const { session } = await getCurrentUser();
  const activeOrganizationId = session?.activeOrganizationId;

  if (!activeOrganizationId) {
    throw new Error("No active organization");
  }

  const prospek = await fetchProspekDetailData(id);

  if (!prospek || prospek.cabangId !== activeOrganizationId) {
    throw new Error("Prospek not found or not authorized");
  }

  return prospek;
}

export type ProspekDetail = Awaited<ReturnType<typeof getProspekDetail>>;

export async function createFollowUp(data: {
  prospekId: string;
  tanggal: Date;
  catatan?: string;
  status: "BARU" | "FOLLOW_UP" | "PENGAJUAN_LEASING" | "DEAL" | "SPK" | "GUGUR";
}) {
  const { currentUser, session } = await getCurrentUser();
  const activeOrganizationId = session?.activeOrganizationId;

  if (!activeOrganizationId) {
    throw new Error("No active organization");
  }

  // Verify prospek exists and user has access
  const prospek = await prisma.prospek.findUnique({
    where: { id: data.prospekId },
  });

  if (!prospek) {
    throw new Error("Prospek not found");
  }

  if (prospek.cabangId !== activeOrganizationId) {
    throw new Error("Not authorized");
  }

  const result = await prisma.followUp.create({
    data: {
      prospek: {
        connect: { id: data.prospekId },
      },
      sales: {
        connect: { id: currentUser.id },
      },
      tanggal: data.tanggal,
      catatan: data.catatan,
      status: data.status,
    },
    include: {
      sales: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  revalidateTag(`prospek-detail-${data.prospekId}`, "max");
  revalidateTag(`prospek-org-${activeOrganizationId}`, "max");
  return result;
}

export type FollowUp = Awaited<ReturnType<typeof createFollowUp>>;
