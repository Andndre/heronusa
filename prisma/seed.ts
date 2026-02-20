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

  async function ensureKelurahan(nama: string, kecamatanId: string, lat?: number, lng?: number) {
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
  const denpasarSelatan = await ensureKecamatan("Denpasar Selatan", denpasar.id);
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
  const sumberData = ["Walk In", "Referral", "Online", "Event", "Telemarketing", "Media Sosial"];
  const sumberMap = new Map<string, string>();

  for (const nama of sumberData) {
    const existing = await prisma.sumberProspek.findFirst({
      where: { nama_sumber: nama },
    });
    if (!existing) {
      const created = await prisma.sumberProspek.create({
        data: { nama_sumber: nama, status: "ACTIVE" },
      });
      sumberMap.set(nama, created.id);
    } else {
      sumberMap.set(nama, existing.id);
    }
  }
  console.log("Sumber Prospek seeded");

  // 5. Seed Sub Sumber Prospek
  const subSumberData: Record<string, string[]> = {
    "Walk In": ["Showroom", "Pameran", "Dealer", "Spontaneous"],
    Referral: ["Keluarga", "Teman", "Kerabat", "Pelanggan Lama"],
    Online: ["Website", "Marketplace", "Google Ads", "Email"],
    Event: ["Event Otomotif", "Roadshow", "Komunitas Motor", "Pameran"],
    Telemarketing: ["Outbound Call", "Inbound Call", "Follow Up"],
    "Media Sosial": ["Instagram", "Facebook", "TikTok", "YouTube", "WhatsApp"],
  };

  for (const [namaSumber, subSumberList] of Object.entries(subSumberData)) {
    const sumberId = sumberMap.get(namaSumber);
    if (!sumberId) {
      console.log(`Warning: Sumber ${namaSumber} not found, skipping sub sumber...`);
      continue;
    }

    for (const namaSubSumber of subSumberList) {
      const existing = await prisma.subSumberProspek.findFirst({
        where: {
          nama_subsumber: namaSubSumber,
          sumberProspekId: sumberId,
        },
      });
      if (!existing) {
        await prisma.subSumberProspek.create({
          data: {
            nama_subsumber: namaSubSumber,
            sumberProspekId: sumberId,
            status: "ACTIVE",
          },
        });
      }
    }
  }
  console.log("Sub Sumber Prospek seeded");

  // 6. Seed Master Warna
  const warnaData = [
    // Warna dasar
    "Hitam",
    "Putih",
    "Merah",
    "Biru",
    "Silver",
    "Abu-abu",
    // Warna dengan variasi doff/glossy
    "Hitam Doff",
    "Hitam Glossy",
    "Putih Doff",
    "Putih Glossy",
    // Warna-warna motor Honda yang umum
    "Merah Matik",
    "Merah Sport",
    "Biru Sport",
    "Biru Matic",
    "Krem",
    "Cream",
    "Coklat",
    "Coklat Kopi",
    "Coklat Mocca",
    "Gold",
    "Emas",
    "Kuning",
    "Kuning Sport",
    "Orange",
    "Hijau",
    // Warna khusus Honda
    "Awesome Black",
    "Matte Black",
    "Pearl White",
    "Star Black",
    "Force Silver",
    "Millennium Red",
    "Champagne Gold",
    "Festival Blue",
    "Dominator Red",
    "Midnight Blue",
    "Pearl Sunrise Yellow",
    "Royal Blue",
    "Sporty Red",
    "Tech White",
    "Thunder Grey",
    "Titanium Grey",
    "Premium Crimson Red",
    "Amazing White",
    "Majestic Gold",
    "Glossy Black",
    "Matte Grey",
    "Metallic Red",
    "Metallic Blue",
    // Warna special edition
    "Replica Edition",
    "Special Edition",
    "Limited Edition",
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

  // 7. Seed Master Model (Motor Honda Only)
  const modelData = [
    // MATIC SERIES
    {
      nama_model: "BeAT",
      kategori: "Matic",
      subkategori: "Entry Level",
      cc: 110,
      series: "BeAT",
      harga_otr: 18500000,
    },
    {
      nama_model: "BeAT Street",
      kategori: "Matic",
      subkategori: "Entry Level",
      cc: 110,
      series: "BeAT",
      harga_otr: 19200000,
    },
    {
      nama_model: "BeAT CBS",
      kategori: "Matic",
      subkategori: "Entry Level",
      cc: 110,
      series: "BeAT",
      harga_otr: 18800000,
    },
    {
      nama_model: "Vario 125",
      kategori: "Matic",
      subkategori: "Mid Level",
      cc: 125,
      series: "Vario",
      harga_otr: 24500000,
    },
    {
      nama_model: "Vario 125 CBS",
      kategori: "Matic",
      subkategori: "Mid Level",
      cc: 125,
      series: "Vario",
      harga_otr: 25500000,
    },
    {
      nama_model: "Vario 160",
      kategori: "Matic",
      subkategori: "High Level",
      cc: 160,
      series: "Vario",
      harga_otr: 27500000,
    },
    {
      nama_model: "Vario 160 ABS",
      kategori: "Matic",
      subkategori: "High Level",
      cc: 160,
      series: "Vario",
      harga_otr: 29000000,
    },
    {
      nama_model: "Scoopy",
      kategori: "Matic",
      subkategori: "Fashion",
      cc: 110,
      series: "Scoopy",
      harga_otr: 22500000,
    },
    {
      nama_model: "Scoopy Stylish",
      kategori: "Matic",
      subkategori: "Fashion",
      cc: 110,
      series: "Scoopy",
      harga_otr: 23500000,
    },
    {
      nama_model: "Scoopy Premium",
      kategori: "Matic",
      subkategori: "Fashion",
      cc: 110,
      series: "Scoopy",
      harga_otr: 24500000,
    },
    {
      nama_model: "Genio",
      kategori: "Matic",
      subkategori: "Fashion",
      cc: 110,
      series: "Genio",
      harga_otr: 19500000,
    },
    {
      nama_model: "Genio CBS",
      kategori: "Matic",
      subkategori: "Fashion",
      cc: 110,
      series: "Genio",
      harga_otr: 20500000,
    },
    {
      nama_model: "Spacy",
      kategori: "Matic",
      subkategori: "Entry Level",
      cc: 110,
      series: "Spacy",
      harga_otr: 19500000,
    },
    {
      nama_model: "Fino",
      kategori: "Matic",
      subkategori: "Fashion",
      cc: 125,
      series: "Fino",
      harga_otr: 22500000,
    },
    {
      nama_model: "Fino Premium",
      kategori: "Matic",
      subkategori: "Fashion",
      cc: 125,
      series: "Fino",
      harga_otr: 23500000,
    },
    {
      nama_model: "Fino Grande",
      kategori: "Matic",
      subkategori: "Fashion",
      cc: 125,
      series: "Fino",
      harga_otr: 23000000,
    },
    {
      nama_model: "Click 125",
      kategori: "Matic",
      subkategori: "Mid Level",
      cc: 125,
      series: "Click",
      harga_otr: 21500000,
    },
    {
      nama_model: "Click 125 ISS",
      kategori: "Matic",
      subkategori: "Mid Level",
      cc: 125,
      series: "Click",
      harga_otr: 22500000,
    },
    {
      nama_model: "PCX 150",
      kategori: "Matic",
      subkategori: "Premium",
      cc: 150,
      series: "PCX",
      harga_otr: 30500000,
    },
    {
      nama_model: "PCX 150 ABS",
      kategori: "Matic",
      subkategori: "Premium",
      cc: 150,
      series: "PCX",
      harga_otr: 33500000,
    },
    {
      nama_model: "PCX 160",
      kategori: "Matic",
      subkategori: "Premium",
      cc: 160,
      series: "PCX",
      harga_otr: 33500000,
    },
    {
      nama_model: "PCX 160 ABS",
      kategori: "Matic",
      subkategori: "Premium",
      cc: 160,
      series: "PCX",
      harga_otr: 36500000,
    },
    {
      nama_model: "PCX 160 e:HEV",
      kategori: "Matic",
      subkategori: "Hybrid",
      cc: 160,
      series: "PCX",
      harga_otr: 43500000,
    },
    {
      nama_model: "ADV 150",
      kategori: "Matic",
      subkategori: "Adventure",
      cc: 150,
      series: "ADV",
      harga_otr: 36500000,
    },
    {
      nama_model: "ADV 150 ABS",
      kategori: "Matic",
      subkategori: "Adventure",
      cc: 150,
      series: "ADV",
      harga_otr: 39500000,
    },
    {
      nama_model: "ADV 160",
      kategori: "Matic",
      subkategori: "Adventure",
      cc: 160,
      series: "ADV",
      harga_otr: 38500000,
    },
    {
      nama_model: "ADV 160 ABS",
      kategori: "Matic",
      subkategori: "Adventure",
      cc: 160,
      series: "ADV",
      harga_otr: 41500000,
    },
    {
      nama_model: "Forza 250",
      kategori: "Matic",
      subkategori: "Premium",
      cc: 250,
      series: "Forza",
      harga_otr: 88500000,
    },
    {
      nama_model: "Forza 350",
      kategori: "Matic",
      subkategori: "Premium",
      cc: 350,
      series: "Forza",
      harga_otr: 135000000,
    },

    // SPORT SERIES - CBR
    {
      nama_model: "CBR150R",
      kategori: "Sport",
      subkategori: "150cc",
      cc: 150,
      series: "CBR",
      harga_otr: 38500000,
    },
    {
      nama_model: "CBR150R SE",
      kategori: "Sport",
      subkategori: "150cc",
      cc: 150,
      series: "CBR",
      harga_otr: 39500000,
    },
    {
      nama_model: "CBR150R ABS",
      kategori: "Sport",
      subkategori: "150cc",
      cc: 150,
      series: "CBR",
      harga_otr: 42500000,
    },
    {
      nama_model: "CBR250RR",
      kategori: "Sport",
      subkategori: "250cc",
      cc: 250,
      series: "CBR",
      harga_otr: 68500000,
    },
    {
      nama_model: "CBR250RR SP",
      kategori: "Sport",
      subkategori: "250cc",
      cc: 250,
      series: "CBR",
      harga_otr: 70500000,
    },
    {
      nama_model: "CBR250RR ABS",
      kategori: "Sport",
      subkategori: "250cc",
      cc: 250,
      series: "CBR",
      harga_otr: 72500000,
    },
    {
      nama_model: "CBR600RR",
      kategori: "Sport",
      subkategori: "600cc",
      cc: 600,
      series: "CBR",
      harga_otr: 285000000,
    },
    {
      nama_model: "CBR1000RR-R",
      kategori: "Sport",
      subkategori: "1000cc",
      cc: 1000,
      series: "CBR",
      harga_otr: 1250000000,
    },
    {
      nama_model: "CBR1000RR-R SP",
      kategori: "Sport",
      subkategori: "1000cc",
      cc: 1000,
      series: "CBR",
      harga_otr: 1450000000,
    },
    {
      nama_model: "CBR1000RR-R Fireblade",
      kategori: "Sport",
      subkategori: "1000cc",
      cc: 1000,
      series: "CBR",
      harga_otr: 1350000000,
    },

    // SPORT SERIES - CRF
    {
      nama_model: "CRF150L",
      kategori: "Sport",
      subkategori: "Trail",
      cc: 150,
      series: "CRF",
      harga_otr: 36500000,
    },
    {
      nama_model: "CRF150L Rally",
      kategori: "Sport",
      subkategori: "Trail",
      cc: 150,
      series: "CRF",
      harga_otr: 37500000,
    },
    {
      nama_model: "CRF250L",
      kategori: "Sport",
      subkategori: "Trail",
      cc: 250,
      series: "CRF",
      harga_otr: 92500000,
    },
    {
      nama_model: "CRF250Rally",
      kategori: "Sport",
      subkategori: "Trail",
      cc: 250,
      series: "CRF",
      harga_otr: 98500000,
    },
    {
      nama_model: "CRF300L",
      kategori: "Sport",
      subkategori: "Trail",
      cc: 300,
      series: "CRF",
      harga_otr: 98500000,
    },
    {
      nama_model: "CRF300Rally",
      kategori: "Sport",
      subkategori: "Trail",
      cc: 300,
      series: "CRF",
      harga_otr: 105000000,
    },
    {
      nama_model: "CRF450L",
      kategori: "Sport",
      subkategori: "Trail",
      cc: 450,
      series: "CRF",
      harga_otr: 165000000,
    },
    {
      nama_model: "CRF450R",
      kategori: "Sport",
      subkategori: "Motocross",
      cc: 450,
      series: "CRF",
      harga_otr: 185000000,
    },
    {
      nama_model: "CRF450RX",
      kategori: "Sport",
      subkategori: "Motocross",
      cc: 450,
      series: "CRF",
      harga_otr: 195000000,
    },
    {
      nama_model: "CRF450RL",
      kategori: "Sport",
      subkategori: "Trail",
      cc: 450,
      series: "CRF",
      harga_otr: 175000000,
    },

    // SPORT SERIES - CB
    {
      nama_model: "CB150 Verza",
      kategori: "Sport",
      subkategori: "150cc",
      cc: 150,
      series: "CB",
      harga_otr: 23500000,
    },
    {
      nama_model: "CB150R",
      kategori: "Sport",
      subkategori: "150cc",
      cc: 150,
      series: "CB",
      harga_otr: 26500000,
    },
    {
      nama_model: "CB150R SE",
      kategori: "Sport",
      subkategori: "150cc",
      cc: 150,
      series: "CB",
      harga_otr: 27500000,
    },
    {
      nama_model: "CBR150R",
      kategori: "Sport",
      subkategori: "150cc",
      cc: 150,
      series: "CBR",
      harga_otr: 38500000,
    },
    {
      nama_model: "CB300R",
      kategori: "Sport",
      subkategori: "300cc",
      cc: 286,
      series: "CB",
      harga_otr: 78500000,
    },
    {
      nama_model: "CB300F",
      kategori: "Sport",
      subkategori: "300cc",
      cc: 286,
      series: "CB",
      harga_otr: 75500000,
    },
    {
      nama_model: "CB650R",
      kategori: "Sport",
      subkategori: "650cc",
      cc: 649,
      series: "CB",
      harga_otr: 285000000,
    },
    {
      nama_model: "CB650R Neo Sports Cafe",
      kategori: "Sport",
      subkategori: "650cc",
      cc: 649,
      series: "CB",
      harga_otr: 295000000,
    },
    {
      nama_model: "CB1000R",
      kategori: "Sport",
      subkategori: "1000cc",
      cc: 998,
      series: "CB",
      harga_otr: 565000000,
    },
    {
      nama_model: "CB1000R Plus",
      kategori: "Sport",
      subkategori: "1000cc",
      cc: 998,
      series: "CB",
      harga_otr: 585000000,
    },

    // SPORT SERIES - CMX
    {
      nama_model: "CMX500 Rebel",
      kategori: "Sport",
      subkategori: "500cc",
      cc: 471,
      series: "CMX",
      harga_otr: 165000000,
    },
    {
      nama_model: "CMX1100 Rebel",
      kategori: "Sport",
      subkategori: "1100cc",
      cc: 1084,
      series: "CMX",
      harga_otr: 465000000,
    },
    {
      nama_model: "CMX1100 Rebel Black Edition",
      kategori: "Sport",
      subkategori: "1100cc",
      cc: 1084,
      series: "CMX",
      harga_otr: 485000000,
    },

    // SPORT SERIES - Africa Twin
    {
      nama_model: "Africa Twin CRF1000L",
      kategori: "Sport",
      subkategori: "Adventure",
      cc: 1000,
      series: "Africa Twin",
      harga_otr: 585000000,
    },
    {
      nama_model: "Africa Twin CRF1000L Adventure Sports",
      kategori: "Sport",
      subkategori: "Adventure",
      cc: 1000,
      series: "Africa Twin",
      harga_otr: 625000000,
    },
    {
      nama_model: "Africa Twin CRF1100L",
      kategori: "Sport",
      subkategori: "Adventure",
      cc: 1084,
      series: "Africa Twin",
      harga_otr: 645000000,
    },
    {
      nama_model: "Africa Twin CRF1100L Adventure Sports",
      kategori: "Sport",
      subkategori: "Adventure",
      cc: 1084,
      series: "Africa Twin",
      harga_otr: 685000000,
    },
    {
      nama_model: "Africa Twin CRF1100L Rally Edition",
      kategori: "Sport",
      subkategori: "Adventure",
      cc: 1084,
      series: "Africa Twin",
      harga_otr: 725000000,
    },

    // SPORT SERIES - VFR
    {
      nama_model: "VFR800F",
      kategori: "Sport",
      subkategori: "800cc",
      cc: 782,
      series: "VFR",
      harga_otr: 385000000,
    },
    {
      nama_model: "VFR800X Crossrunner",
      kategori: "Sport",
      subkategori: "800cc",
      cc: 782,
      series: "VFR",
      harga_otr: 405000000,
    },
    {
      nama_model: "VFR1200F",
      kategori: "Sport",
      subkategori: "1200cc",
      cc: 1237,
      series: "VFR",
      harga_otr: 565000000,
    },
    {
      nama_model: "VFR1200X Crosstourer",
      kategori: "Sport",
      subkategori: "1200cc",
      cc: 1237,
      series: "VFR",
      harga_otr: 585000000,
    },
    {
      nama_model: "VFR1200F DCT",
      kategori: "Sport",
      subkategori: "1200cc",
      cc: 1237,
      series: "VFR",
      harga_otr: 605000000,
    },

    // CUB SERIES
    {
      nama_model: "Supra X 125",
      kategori: "Cub",
      subkategori: "Standard",
      cc: 125,
      series: "Supra",
      harga_otr: 19500000,
    },
    {
      nama_model: "Supra X 125 FI",
      kategori: "Cub",
      subkategori: "Standard",
      cc: 125,
      series: "Supra",
      harga_otr: 20500000,
    },
    {
      nama_model: "Supra X 125 Helm In",
      kategori: "Cub",
      subkategori: "Standard",
      cc: 125,
      series: "Supra",
      harga_otr: 21500000,
    },
    {
      nama_model: "Supra GTR 150",
      kategori: "Cub",
      subkategori: "Sport",
      cc: 150,
      series: "Supra",
      harga_otr: 26500000,
    },
    {
      nama_model: "Supra Fit",
      kategori: "Cub",
      subkategori: "Standard",
      cc: 110,
      series: "Supra",
      harga_otr: 16500000,
    },
    {
      nama_model: "Revo X",
      kategori: "Cub",
      subkategori: "Standard",
      cc: 110,
      series: "Revo",
      harga_otr: 17500000,
    },
    {
      nama_model: "Revo Fit",
      kategori: "Cub",
      subkategori: "Standard",
      cc: 110,
      series: "Revo",
      harga_otr: 16500000,
    },
    {
      nama_model: "Blade",
      kategori: "Cub",
      subkategori: "Standard",
      cc: 110,
      series: "Blade",
      harga_otr: 18500000,
    },
    {
      nama_model: "Blade Repsol",
      kategori: "Cub",
      subkategori: "Standard",
      cc: 110,
      series: "Blade",
      harga_otr: 19500000,
    },
    {
      nama_model: "Blade 125 FI",
      kategori: "Cub",
      subkategori: "Standard",
      cc: 125,
      series: "Blade",
      harga_otr: 20500000,
    },
    {
      nama_model: "Karisma",
      kategori: "Cub",
      subkategori: "Standard",
      cc: 125,
      series: "Karisma",
      harga_otr: 19500000,
    },
    {
      nama_model: "Kirana",
      kategori: "Cub",
      subkategori: "Standard",
      cc: 125,
      series: "Kirana",
      harga_otr: 18500000,
    },
    {
      nama_model: "Prime",
      kategori: "Cub",
      subkategori: "Standard",
      cc: 110,
      series: "Prime",
      harga_otr: 17500000,
    },
    {
      nama_model: "Force",
      kategori: "Cub",
      subkategori: "Standard",
      cc: 110,
      series: "Force",
      harga_otr: 18500000,
    },
    {
      nama_model: "Dash",
      kategori: "Cub",
      subkategori: "Sport",
      cc: 110,
      series: "Dash",
      harga_otr: 19500000,
    },
    {
      nama_model: "Verza",
      kategori: "Cub",
      subkategori: "Standard",
      cc: 150,
      series: "Verza",
      harga_otr: 22500000,
    },
    {
      nama_model: "Verza 150",
      kategori: "Cub",
      subkategori: "Standard",
      cc: 150,
      series: "Verza",
      harga_otr: 23500000,
    },
    {
      nama_model: "Verza ABS",
      kategori: "Cub",
      subkategori: "Standard",
      cc: 150,
      series: "Verza",
      harga_otr: 25500000,
    },

    // LISTRIK SERIES
    {
      nama_model: "PCX Electric",
      kategori: "Listrik",
      subkategori: "Matic",
      cc: 0,
      series: "PCX",
      harga_otr: 65000000,
    },
    {
      nama_model: "EM1 e",
      kategori: "Listrik",
      subkategori: "Scooter",
      cc: 0,
      series: "EM",
      harga_otr: 45000000,
    },
    {
      nama_model: "Benza",
      kategori: "Listrik",
      subkategori: "Matic",
      cc: 0,
      series: "Benza",
      harga_otr: 35000000,
    },
    {
      nama_model: "Momo",
      kategori: "Listrik",
      subkategori: "Matic",
      cc: 0,
      series: "Momo",
      harga_otr: 28000000,
    },
    {
      nama_model: "Selis",
      kategori: "Listrik",
      subkategori: "Matic",
      cc: 0,
      series: "Selis",
      harga_otr: 25000000,
    },
    {
      nama_model: "Volta",
      kategori: "Listrik",
      subkategori: "Matic",
      cc: 0,
      series: "Volta",
      harga_otr: 24000000,
    },
    {
      nama_model: "Smoot",
      kategori: "Listrik",
      subkategori: "Matic",
      cc: 0,
      series: "Smoot",
      harga_otr: 20000000,
    },
    {
      nama_model: "Electromotive",
      kategori: "Listrik",
      subkategori: "Matic",
      cc: 0,
      series: "Electromotive",
      harga_otr: 26000000,
    },
    {
      nama_model: "Weekend",
      kategori: "Listrik",
      subkategori: "Matic",
      cc: 0,
      series: "Weekend",
      harga_otr: 23000000,
    },
  ];

  for (const model of modelData) {
    const existing = await prisma.masterModel.findFirst({
      where: {
        nama_model: model.nama_model,
        series: model.series,
      },
    });
    if (!existing) {
      await prisma.masterModel.create({
        data: model,
      });
    }
  }
  console.log("Master Model seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
