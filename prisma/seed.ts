import { config } from "dotenv";
config();

import { auth } from "../lib/auth";
import prisma from "../lib/db";

async function main() {
  // 1. Add super admin user
  const email = process.env.SUPER_ADMIN_EMAIL || "admin@example.com";
  const password = process.env.SUPER_ADMIN_PASSWORD || "admin123";
  const name = process.env.SUPER_ADMIN_NAME || "Admin";

  try {
    await auth.api.signUpEmail({
      body: { email, password, name },
    });
    console.log("Super Admin seeded");
  } catch {
    console.log("Super Admin already exists, skipping...");
  }

  // Helper untuk "Upsert" berdasarkan nama tanpa @unique di schema
  async function ensureKabupaten(nama: string) {
    const existing = await prisma.kabupaten.findFirst({
      where: { nama_kabupaten: nama },
    });
    if (existing) return existing;
    return prisma.kabupaten.create({ data: { nama_kabupaten: nama } });
  }

  async function ensureKecamatan(nama: string, kabupatenId: string) {
    const existing = await prisma.kecamatan.findFirst({
      where: { nama_kecamatan: nama, kabupatenId },
    });
    if (existing) return existing;
    return prisma.kecamatan.create({
      data: { nama_kecamatan: nama, kabupatenId },
    });
  }

  async function ensureKelurahan(
    nama: string,
    kecamatanId: string,
    lat?: number,
    lng?: number,
  ) {
    const existing = await prisma.kelurahan.findFirst({
      where: { nama_kelurahan: nama, kecamatanId },
    });
    if (existing) return existing;
    return prisma.kelurahan.create({
      data: {
        nama_kelurahan: nama,
        kecamatanId,
        latitude: lat,
        longitude: lng,
      },
    });
  }

  // 2. Seed Kabupaten
  const denpasar = await ensureKabupaten("Denpasar");
  console.log("Kabupaten seeded");

  // 3. Seed Kecamatan & Kelurahan secara hirarkis
  const denpasarSelatan = await ensureKecamatan(
    "Denpasar Selatan",
    denpasar.id,
  );
  const denpasarTimur = await ensureKecamatan("Denpasar Timur", denpasar.id);
  const denpasarBarat = await ensureKecamatan("Denpasar Barat", denpasar.id);
  const denpasarUtara = await ensureKecamatan("Denpasar Utara", denpasar.id);
  console.log("Kecamatan seeded");

  // Kelurahan Denpasar Selatan
  await Promise.all([
    ensureKelurahan("Sesetan", denpasarSelatan.id, -8.6742, 115.2263),
    ensureKelurahan("Sanur", denpasarSelatan.id, -8.6833, 115.2619),
    ensureKelurahan("Sanur Kauh", denpasarSelatan.id, -8.6872, 115.2578),
    ensureKelurahan("Sidakarya", denpasarSelatan.id, -8.6897, 115.2358),
    ensureKelurahan("Renon", denpasarSelatan.id, -8.6667, 115.2311),
    ensureKelurahan("Panjer", denpasarSelatan.id, -8.6628, 115.2181),
    ensureKelurahan("Pedungan", denpasarSelatan.id, -8.6889, 115.2194),
    ensureKelurahan("Serangan", denpasarSelatan.id, -8.7206, 115.2333),
  ]);

  // Kelurahan Denpasar Timur
  await Promise.all([
    ensureKelurahan("Kesiman", denpasarTimur.id, -8.6422, 115.2444),
    ensureKelurahan("Kesiman Petilan", denpasarTimur.id, -8.6371, 115.2511),
    ensureKelurahan("Kesiman Kertalangu", denpasarTimur.id, -8.6333, 115.2583),
    ensureKelurahan("Penatih", denpasarTimur.id, -8.6281, 115.2708),
    ensureKelurahan("Penatih Dangin Puri", denpasarTimur.id, -8.6244, 115.2764),
    ensureKelurahan("Sumerta", denpasarTimur.id, -8.6408, 115.2369),
    ensureKelurahan("Sumerta Kelod", denpasarTimur.id, -8.6503, 115.2397),
    ensureKelurahan("Sumerta Kauh", denpasarTimur.id, -8.6394, 115.2292),
  ]);

  // Kelurahan Denpasar Barat
  await Promise.all([
    ensureKelurahan("Dauh Puri", denpasarBarat.id, -8.6578, 115.2069),
    ensureKelurahan("Dauh Puri Kauh", denpasarBarat.id, -8.6525, 115.2008),
    ensureKelurahan("Dauh Puri Kangin", denpasarBarat.id, -8.6614, 115.2092),
    ensureKelurahan("Dauh Puri Kelod", denpasarBarat.id, -8.6711, 115.2028),
    ensureKelurahan("Padang Sambian", denpasarBarat.id, -8.6589, 115.1936),
    ensureKelurahan("Padang Sambian Kaja", denpasarBarat.id, -8.6508, 115.1919),
    ensureKelurahan("Padang Sambian Kelod", denpasarBarat.id, -8.6686, 115.1944),
    ensureKelurahan("Tegal Harum", denpasarBarat.id, -8.6542, 115.1842),
    ensureKelurahan("Tegal Kerta", denpasarBarat.id, -8.6625, 115.1889),
    ensureKelurahan("Pemecutan", denpasarBarat.id, -8.6503, 115.2056),
    ensureKelurahan("Pemecutan Kaja", denpasarBarat.id, -8.6444, 115.2042),
    ensureKelurahan("Pemecutan Kelod", denpasarBarat.id, -8.6578, 115.2083),
  ]);

  // Kelurahan Denpasar Utara
  await Promise.all([
    ensureKelurahan("Ubung", denpasarUtara.id, -8.6244, 115.1981),
    ensureKelurahan("Ubung Kaja", denpasarUtara.id, -8.6133, 115.1958),
    ensureKelurahan("Peguyangan", denpasarUtara.id, -8.6308, 115.2056),
    ensureKelurahan("Peguyangan Kaja", denpasarUtara.id, -8.6206, 115.2028),
    ensureKelurahan("Peguyangan Kangin", denpasarUtara.id, -8.6283, 115.2139),
    ensureKelurahan("Tonja", denpasarUtara.id, -8.6347, 115.2181),
    ensureKelurahan("Dangin Puri", denpasarUtara.id, -8.6419, 115.2208),
    ensureKelurahan("Dangin Puri Kauh", denpasarUtara.id, -8.6392, 115.2139),
    ensureKelurahan("Dangin Puri Kaja", denpasarUtara.id, -8.6333, 115.2194),
    ensureKelurahan("Dangin Puri Kangin", denpasarUtara.id, -8.6453, 115.225),
  ]);

  console.log("Kelurahan seeded");

  // 4. Seed Sumber Prospek
  const sumberData = [
    "Walk In",
    "Referral",
    "Online",
    "Event",
    "Telemarketing",
    "Media Sosial",
  ];
  for (const nama of sumberData) {
    const existing = await prisma.sumberProspek.findFirst({
      where: { nama_sumber: nama },
    });
    if (!existing) {
      await prisma.sumberProspek.create({
        data: { nama_sumber: nama, status: "ACTIVE" },
      });
    }
  }
  console.log("Sumber Prospek seeded");

  // 5. Seed Master Warna
  const warnaData = [
    "Hitam",
    "Putih",
    "Merah",
    "Biru",
    "Silver",
    "Abu-abu",
    "Hitam Doff",
  ];
  for (const warna of warnaData) {
    const existing = await prisma.masterWarna.findFirst({
      where: { warna: warna },
    });
    if (!existing) {
      await prisma.masterWarna.create({ data: { warna } });
    }
  }
  console.log("Master Warna seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
