import { config } from "dotenv";
config();

import { auth } from "../lib/auth";
import prisma from "../lib/db";

async function main() {
  // Add super admin user
  const email = process.env.SUPER_ADMIN_EMAIL || "admin@example.com";
  const password = process.env.SUPER_ADMIN_PASSWORD || "admin123";
  const name = process.env.SUPER_ADMIN_NAME || "Admin";

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });
    console.log("Super Admin seeded");
  } catch {
    console.log("Super Admin already exists, skipping...");
  }

  // Seed Kabupaten (Denpasar)
  const denpasar = await prisma.kabupaten.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nama_kabupaten: "Denpasar",
    },
  });
  console.log("Kabupaten seeded");

  // Seed Kecamatan
  const kecamatanData = [
    { id: 1, nama_kecamatan: "Denpasar Selatan", kabupatenId: denpasar.id },
    { id: 2, nama_kecamatan: "Denpasar Timur", kabupatenId: denpasar.id },
    { id: 3, nama_kecamatan: "Denpasar Barat", kabupatenId: denpasar.id },
    { id: 4, nama_kecamatan: "Denpasar Utara", kabupatenId: denpasar.id },
  ];

  for (const kec of kecamatanData) {
    await prisma.kecamatan.upsert({
      where: { id: kec.id },
      update: {},
      create: kec,
    });
  }
  console.log("Kecamatan seeded");

  // Seed Kelurahan
  const kelurahanData = [
    // Denpasar Selatan
    {
      id: 1,
      nama_kelurahan: "Sesetan",
      kecamatanId: 1,
      latitude: -8.6742,
      longitude: 115.2263,
    },
    {
      id: 2,
      nama_kelurahan: "Sanur",
      kecamatanId: 1,
      latitude: -8.6833,
      longitude: 115.2619,
    },
    {
      id: 3,
      nama_kelurahan: "Sanur Kauh",
      kecamatanId: 1,
      latitude: -8.6872,
      longitude: 115.2578,
    },
    {
      id: 4,
      nama_kelurahan: "Sidakarya",
      kecamatanId: 1,
      latitude: -8.6897,
      longitude: 115.2358,
    },
    {
      id: 5,
      nama_kelurahan: "Renon",
      kecamatanId: 1,
      latitude: -8.6667,
      longitude: 115.2311,
    },
    {
      id: 6,
      nama_kelurahan: "Panjer",
      kecamatanId: 1,
      latitude: -8.6628,
      longitude: 115.2181,
    },
    {
      id: 7,
      nama_kelurahan: "Pedungan",
      kecamatanId: 1,
      latitude: -8.6889,
      longitude: 115.2194,
    },
    {
      id: 8,
      nama_kelurahan: "Serangan",
      kecamatanId: 1,
      latitude: -8.7206,
      longitude: 115.2333,
    },

    // Denpasar Timur
    {
      id: 9,
      nama_kelurahan: "Kesiman",
      kecamatanId: 2,
      latitude: -8.6422,
      longitude: 115.2444,
    },
    {
      id: 10,
      nama_kelurahan: "Kesiman Petilan",
      kecamatanId: 2,
      latitude: -8.6371,
      longitude: 115.2511,
    },
    {
      id: 11,
      nama_kelurahan: "Kesiman Kertalangu",
      kecamatanId: 2,
      latitude: -8.6333,
      longitude: 115.2583,
    },
    {
      id: 12,
      nama_kelurahan: "Penatih",
      kecamatanId: 2,
      latitude: -8.6281,
      longitude: 115.2708,
    },
    {
      id: 13,
      nama_kelurahan: "Penatih Dangin Puri",
      kecamatanId: 2,
      latitude: -8.6244,
      longitude: 115.2764,
    },
    {
      id: 14,
      nama_kelurahan: "Sumerta",
      kecamatanId: 2,
      latitude: -8.6408,
      longitude: 115.2369,
    },
    {
      id: 15,
      nama_kelurahan: "Sumerta Kelod",
      kecamatanId: 2,
      latitude: -8.6503,
      longitude: 115.2397,
    },
    {
      id: 16,
      nama_kelurahan: "Sumerta Kauh",
      kecamatanId: 2,
      latitude: -8.6394,
      longitude: 115.2292,
    },

    // Denpasar Barat
    {
      id: 17,
      nama_kelurahan: "Dauh Puri",
      kecamatanId: 3,
      latitude: -8.6578,
      longitude: 115.2069,
    },
    {
      id: 18,
      nama_kelurahan: "Dauh Puri Kauh",
      kecamatanId: 3,
      latitude: -8.6525,
      longitude: 115.2008,
    },
    {
      id: 19,
      nama_kelurahan: "Dauh Puri Kangin",
      kecamatanId: 3,
      latitude: -8.6614,
      longitude: 115.2092,
    },
    {
      id: 20,
      nama_kelurahan: "Dauh Puri Kelod",
      kecamatanId: 3,
      latitude: -8.6711,
      longitude: 115.2028,
    },
    {
      id: 21,
      nama_kelurahan: "Padang Sambian",
      kecamatanId: 3,
      latitude: -8.6589,
      longitude: 115.1936,
    },
    {
      id: 22,
      nama_kelurahan: "Padang Sambian Kaja",
      kecamatanId: 3,
      latitude: -8.6508,
      longitude: 115.1919,
    },
    {
      id: 23,
      nama_kelurahan: "Padang Sambian Kelod",
      kecamatanId: 3,
      latitude: -8.6686,
      longitude: 115.1944,
    },
    {
      id: 24,
      nama_kelurahan: "Tegal Harum",
      kecamatanId: 3,
      latitude: -8.6542,
      longitude: 115.1842,
    },
    {
      id: 25,
      nama_kelurahan: "Tegal Kerta",
      kecamatanId: 3,
      latitude: -8.6625,
      longitude: 115.1889,
    },
    {
      id: 26,
      nama_kelurahan: "Pemecutan",
      kecamatanId: 3,
      latitude: -8.6503,
      longitude: 115.2056,
    },
    {
      id: 27,
      nama_kelurahan: "Pemecutan Kaja",
      kecamatanId: 3,
      latitude: -8.6444,
      longitude: 115.2042,
    },
    {
      id: 28,
      nama_kelurahan: "Pemecutan Kelod",
      kecamatanId: 3,
      latitude: -8.6578,
      longitude: 115.2083,
    },

    // Denpasar Utara
    {
      id: 29,
      nama_kelurahan: "Ubung",
      kecamatanId: 4,
      latitude: -8.6244,
      longitude: 115.1981,
    },
    {
      id: 30,
      nama_kelurahan: "Ubung Kaja",
      kecamatanId: 4,
      latitude: -8.6133,
      longitude: 115.1958,
    },
    {
      id: 31,
      nama_kelurahan: "Peguyangan",
      kecamatanId: 4,
      latitude: -8.6308,
      longitude: 115.2056,
    },
    {
      id: 32,
      nama_kelurahan: "Peguyangan Kaja",
      kecamatanId: 4,
      latitude: -8.6206,
      longitude: 115.2028,
    },
    {
      id: 33,
      nama_kelurahan: "Peguyangan Kangin",
      kecamatanId: 4,
      latitude: -8.6283,
      longitude: 115.2139,
    },
    {
      id: 34,
      nama_kelurahan: "Tonja",
      kecamatanId: 4,
      latitude: -8.6347,
      longitude: 115.2181,
    },
    {
      id: 35,
      nama_kelurahan: "Dangin Puri",
      kecamatanId: 4,
      latitude: -8.6419,
      longitude: 115.2208,
    },
    {
      id: 36,
      nama_kelurahan: "Dangin Puri Kauh",
      kecamatanId: 4,
      latitude: -8.6392,
      longitude: 115.2139,
    },
    {
      id: 37,
      nama_kelurahan: "Dangin Puri Kaja",
      kecamatanId: 4,
      latitude: -8.6333,
      longitude: 115.2194,
    },
    {
      id: 38,
      nama_kelurahan: "Dangin Puri Kangin",
      kecamatanId: 4,
      latitude: -8.6453,
      longitude: 115.225,
    },
  ];

  for (const kel of kelurahanData) {
    await prisma.kelurahan.upsert({
      where: { id: kel.id },
      update: {},
      create: kel,
    });
  }
  console.log("Kelurahan seeded");

  // Seed Sumber Prospek
  const sumberProspekData = [
    { id: 1, nama_sumber: "Walk In", status: "ACTIVE" },
    { id: 2, nama_sumber: "Referral", status: "ACTIVE" },
    { id: 3, nama_sumber: "Online", status: "ACTIVE" },
    { id: 4, nama_sumber: "Event", status: "ACTIVE" },
    { id: 5, nama_sumber: "Telemarketing", status: "ACTIVE" },
    { id: 6, nama_sumber: "Media Sosial", status: "ACTIVE" },
  ];

  for (const sumber of sumberProspekData) {
    await prisma.sumberProspek.upsert({
      where: { id: sumber.id },
      update: {},
      create: sumber,
    });
  }
  console.log("Sumber Prospek seeded");

  // Seed Sub Sumber Prospek
  const subSumberProspekData = [
    // Walk In
    { id: 1, nama_subsumber: "Showroom", sumberProspekId: 1, status: "ACTIVE" },
    { id: 2, nama_subsumber: "Dealer", sumberProspekId: 1, status: "ACTIVE" },
    {
      id: 3,
      nama_subsumber: "Service Center",
      sumberProspekId: 1,
      status: "ACTIVE",
    },

    // Referral
    { id: 4, nama_subsumber: "Teman", sumberProspekId: 2, status: "ACTIVE" },
    { id: 5, nama_subsumber: "Keluarga", sumberProspekId: 2, status: "ACTIVE" },
    {
      id: 6,
      nama_subsumber: "Pelanggan Lama",
      sumberProspekId: 2,
      status: "ACTIVE",
    },
    {
      id: 7,
      nama_subsumber: "Rekan Kerja",
      sumberProspekId: 2,
      status: "ACTIVE",
    },

    // Online
    { id: 8, nama_subsumber: "Website", sumberProspekId: 3, status: "ACTIVE" },
    {
      id: 9,
      nama_subsumber: "Google Search",
      sumberProspekId: 3,
      status: "ACTIVE",
    },
    {
      id: 10,
      nama_subsumber: "E-commerce",
      sumberProspekId: 3,
      status: "ACTIVE",
    },
    {
      id: 11,
      nama_subsumber: "Marketplace",
      sumberProspekId: 3,
      status: "ACTIVE",
    },

    // Event
    { id: 12, nama_subsumber: "Pameran", sumberProspekId: 4, status: "ACTIVE" },
    {
      id: 13,
      nama_subsumber: "Festival",
      sumberProspekId: 4,
      status: "ACTIVE",
    },
    {
      id: 14,
      nama_subsumber: "Sponsorship",
      sumberProspekId: 4,
      status: "ACTIVE",
    },
    {
      id: 15,
      nama_subsumber: "Test Ride",
      sumberProspekId: 4,
      status: "ACTIVE",
    },

    // Telemarketing
    {
      id: 16,
      nama_subsumber: "Outbound Call",
      sumberProspekId: 5,
      status: "ACTIVE",
    },
    {
      id: 17,
      nama_subsumber: "SMS Blast",
      sumberProspekId: 5,
      status: "ACTIVE",
    },
    {
      id: 18,
      nama_subsumber: "WhatsApp Blast",
      sumberProspekId: 5,
      status: "ACTIVE",
    },

    // Media Sosial
    {
      id: 19,
      nama_subsumber: "Facebook",
      sumberProspekId: 6,
      status: "ACTIVE",
    },
    {
      id: 20,
      nama_subsumber: "Instagram",
      sumberProspekId: 6,
      status: "ACTIVE",
    },
    { id: 21, nama_subsumber: "TikTok", sumberProspekId: 6, status: "ACTIVE" },
    { id: 22, nama_subsumber: "YouTube", sumberProspekId: 6, status: "ACTIVE" },
  ];

  for (const subSumber of subSumberProspekData) {
    await prisma.subSumberProspek.upsert({
      where: { id: subSumber.id },
      update: {},
      create: subSumber,
    });
  }
  console.log("Sub Sumber Prospek seeded");

  // Seed Master Model (Honda Motorcycles)
  const masterModelData = [
    // Matic
    {
      id: 1,
      nama_model: "Honda Beat Street",
      kategori: "Matic",
      subkategori: "Fun Matic",
      cc: 110,
      series: "Beat",
      harga_otr: 17500000,
    },
    {
      id: 2,
      nama_model: "Honda Beat CBS",
      kategori: "Matic",
      subkategori: "Fun Matic",
      cc: 110,
      series: "Beat",
      harga_otr: 17000000,
    },
    {
      id: 3,
      nama_model: "Honda Vario 125",
      kategori: "Matic",
      subkategori: "Stylish Matic",
      cc: 125,
      series: "Vario",
      harga_otr: 22500000,
    },
    {
      id: 4,
      nama_model: "Honda Vario 160",
      kategori: "Matic",
      subkategori: "Stylish Matic",
      cc: 160,
      series: "Vario",
      harga_otr: 28500000,
    },
    {
      id: 5,
      nama_model: "Honda Scoopy",
      kategori: "Matic",
      subkategori: "Retro Matic",
      cc: 110,
      series: "Scoopy",
      harga_otr: 21500000,
    },
    {
      id: 6,
      nama_model: "Honda Scoopy Prestige",
      kategori: "Matic",
      subkategori: "Retro Matic",
      cc: 110,
      series: "Scoopy",
      harga_otr: 23000000,
    },
    {
      id: 7,
      nama_model: "Honda PCX 160",
      kategori: "Matic",
      subkategori: "Premium Matic",
      cc: 160,
      series: "PCX",
      harga_otr: 32500000,
    },
    {
      id: 8,
      nama_model: "Honda ADV 160",
      kategori: "Matic",
      subkategori: "Adventure Matic",
      cc: 160,
      series: "ADV",
      harga_otr: 35000000,
    },
    {
      id: 9,
      nama_model: "Honda Genio",
      kategori: "Matic",
      subkategori: "Fun Matic",
      cc: 110,
      series: "Genio",
      harga_otr: 18500000,
    },

    // Sport
    {
      id: 10,
      nama_model: "Honda CBR150R",
      kategori: "Sport",
      subkategori: "Super Sport",
      cc: 150,
      series: "CBR",
      harga_otr: 38500000,
    },
    {
      id: 11,
      nama_model: "Honda CBR250RR",
      kategori: "Sport",
      subkategori: "Super Sport",
      cc: 250,
      series: "CBR",
      harga_otr: 73000000,
    },
    {
      id: 12,
      nama_model: "Honda CB150R Streetfire",
      kategori: "Sport",
      subkategori: "Street Fighter",
      cc: 150,
      series: "CB",
      harga_otr: 33500000,
    },
    {
      id: 13,
      nama_model: "Honda CB150X",
      kategori: "Sport",
      subkategori: "Adventure Sport",
      cc: 150,
      series: "CB",
      harga_otr: 35000000,
    },
    {
      id: 14,
      nama_model: "Honda CRF150L",
      kategori: "Sport",
      subkategori: "Enduro",
      cc: 150,
      series: "CRF",
      harga_otr: 35500000,
    },
    {
      id: 15,
      nama_model: "Honda CB500X",
      kategori: "Sport",
      subkategori: "Big Bike",
      cc: 500,
      series: "CB",
      harga_otr: 140000000,
    },

    // Cub
    {
      id: 16,
      nama_model: "Honda Revo",
      kategori: "Cub",
      subkategori: "Underbone",
      cc: 110,
      series: "Revo",
      harga_otr: 16000000,
    },
    {
      id: 17,
      nama_model: "Honda Revo FIT",
      kategori: "Cub",
      subkategori: "Underbone",
      cc: 110,
      series: "Revo",
      harga_otr: 15500000,
    },
    {
      id: 18,
      nama_model: "Honda Supra GTR 150",
      kategori: "Cub",
      subkategori: "Sport Cub",
      cc: 150,
      series: "Supra",
      harga_otr: 24000000,
    },
    {
      id: 19,
      nama_model: "Honda Supra X 125",
      kategori: "Cub",
      subkategori: "Underbone",
      cc: 125,
      series: "Supra",
      harga_otr: 19500000,
    },

    // Listrik
    {
      id: 20,
      nama_model: "Honda EM1 e",
      kategori: "Listrik",
      subkategori: "Electric Scooter",
      cc: null,
      series: "EM1",
      harga_otr: 29000000,
    },
  ];

  for (const model of masterModelData) {
    await prisma.masterModel.upsert({
      where: { id: model.id },
      update: {},
      create: { ...model, cc: model.cc ?? 125 },
    });
  }
  console.log("Master Model seeded");

  // Seed Master Warna
  const masterWarnaData = [
    { id: 1, warna: "Hitam" },
    { id: 2, warna: "Putih" },
    { id: 3, warna: "Merah" },
    { id: 4, warna: "Biru" },
    { id: 5, warna: "Silver" },
    { id: 6, warna: "Abu-abu" },
    { id: 7, warna: "Kuning" },
    { id: 8, warna: "Hijau" },
    { id: 9, warna: "Coklat" },
    { id: 10, warna: "Orange" },
    { id: 11, warna: "Ungu" },
    { id: 12, warna: "Hitam Metalik" },
    { id: 13, warna: "Putih Metalik" },
    { id: 14, warna: "Merah Metalik" },
    { id: 15, warna: "Biru Metalik" },
    { id: 16, warna: "Hijau Metalik" },
    { id: 17, warna: "Gold" },
    { id: 18, warna: "Merah Marun" },
    { id: 19, warna: "Biru Navy" },
    { id: 20, warna: "Hitam Doff" },
  ];

  for (const warna of masterWarnaData) {
    await prisma.masterWarna.upsert({
      where: { id: warna.id },
      update: {},
      create: warna,
    });
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
