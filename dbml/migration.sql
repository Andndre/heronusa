-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `image` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `batas_diskon` DECIMAL(65, 30) NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `id` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `ipAddress` TEXT NULL,
    `userAgent` TEXT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `activeOrganizationId` TEXT NULL,
    `activeTeamId` TEXT NULL,

    INDEX `session_userId_idx`(`userId`),
    UNIQUE INDEX `session_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account` (
    `id` VARCHAR(191) NOT NULL,
    `accountId` TEXT NOT NULL,
    `providerId` TEXT NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `accessToken` TEXT NULL,
    `refreshToken` TEXT NULL,
    `idToken` TEXT NULL,
    `accessTokenExpiresAt` DATETIME(3) NULL,
    `refreshTokenExpiresAt` DATETIME(3) NULL,
    `scope` TEXT NULL,
    `password` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `account_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification` (
    `id` VARCHAR(191) NOT NULL,
    `identifier` TEXT NOT NULL,
    `value` TEXT NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization` (
    `id` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `logo` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `metadata` TEXT NULL,

    UNIQUE INDEX `organization_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team` (
    `id` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_member` (
    `id` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `team_member_teamId_idx`(`teamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `role` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invitation` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `email` TEXT NOT NULL,
    `role` TEXT NULL,
    `teamId` TEXT NULL,
    `status` TEXT NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `inviterId` VARCHAR(191) NOT NULL,

    INDEX `invitation_email_idx`(`email`(191)),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kabupaten` (
    `id` VARCHAR(36) NOT NULL,
    `nama_kabupaten` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kecamatan` (
    `id` VARCHAR(36) NOT NULL,
    `nama_kecamatan` VARCHAR(191) NOT NULL,
    `kabupatenId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `kecamatan_kabupatenId_idx`(`kabupatenId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kelurahan` (
    `id` VARCHAR(36) NOT NULL,
    `nama_kelurahan` VARCHAR(191) NOT NULL,
    `kecamatanId` VARCHAR(36) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `kelurahan_kecamatanId_idx`(`kecamatanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_model` (
    `id` VARCHAR(36) NOT NULL,
    `nama_model` VARCHAR(191) NOT NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `subkategori` VARCHAR(191) NOT NULL,
    `cc` INTEGER NOT NULL,
    `series` VARCHAR(191) NOT NULL,
    `harga_otr` DECIMAL(65, 30) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `master_model_kategori_idx`(`kategori`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_warna` (
    `id` VARCHAR(36) NOT NULL,
    `warna` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sumber_prospek` (
    `id` VARCHAR(36) NOT NULL,
    `nama_sumber` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sub_sumber_prospek` (
    `id` VARCHAR(36) NOT NULL,
    `nama_subsumber` VARCHAR(191) NOT NULL,
    `sumberProspekId` VARCHAR(36) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `sub_sumber_prospek_sumberProspekId_idx`(`sumberProspekId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prospek` (
    `id` VARCHAR(36) NOT NULL,
    `nama_konsumen` VARCHAR(191) NOT NULL,
    `alamat_konsumen` VARCHAR(191) NULL,
    `hp1` VARCHAR(191) NOT NULL,
    `hp2` VARCHAR(191) NULL,
    `kategori_prospek` ENUM('HOT', 'WARM', 'COLD') NOT NULL,
    `status` ENUM('BARU', 'FOLLOW_UP', 'PENGAJUAN_LEASING', 'DEAL', 'SPK', 'GUGUR') NOT NULL DEFAULT 'BARU',
    `tipe_pembayaran` ENUM('CASH', 'CREDIT') NOT NULL,
    `tgl_perkiraan_beli` DATETIME(3) NULL,
    `salesId` VARCHAR(191) NOT NULL,
    `subSumberId` VARCHAR(36) NOT NULL,
    `modelId` VARCHAR(36) NOT NULL,
    `warnaId` VARCHAR(36) NOT NULL,
    `kelurahanId` VARCHAR(36) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `cabangId` VARCHAR(191) NOT NULL,
    `pelangganId` VARCHAR(36) NULL,

    INDEX `prospek_deletedAt_idx`(`deletedAt`),
    INDEX `prospek_salesId_idx`(`salesId`),
    INDEX `prospek_status_idx`(`status`),
    INDEX `prospek_kelurahanId_idx`(`kelurahanId`),
    INDEX `prospek_subSumberId_idx`(`subSumberId`),
    INDEX `prospek_modelId_idx`(`modelId`),
    INDEX `prospek_warnaId_idx`(`warnaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `spk` (
    `id` VARCHAR(36) NOT NULL,
    `nomorSPK` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `totalTagihan` DECIMAL(65, 30) NOT NULL,
    `totalDibayar` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `alamatPengiriman` VARCHAR(191) NOT NULL,
    `idKelurahanPengiriman` VARCHAR(36) NOT NULL,
    `diskonPengajuan` DECIMAL(65, 30) NULL,
    `diskonDisetujui` DECIMAL(65, 30) NULL,
    `spv_approval_status` ENUM('AUTO_APPROVED', 'PENDING_SPV', 'PENDING_MANAGER', 'APPROVED', 'REJECTED') NULL,
    `spv_approval_by` VARCHAR(191) NULL,
    `spv_approval_date` DATETIME(3) NULL,
    `manager_approval_status` ENUM('AUTO_APPROVED', 'PENDING_SPV', 'PENDING_MANAGER', 'APPROVED', 'REJECTED') NULL,
    `manager_approval_by` VARCHAR(191) NULL,
    `manager_approval_date` DATETIME(3) NULL,
    `pelangganId` VARCHAR(36) NOT NULL,
    `unitId` VARCHAR(36) NOT NULL,
    `prospekId` VARCHAR(36) NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `spk_nomorSPK_key`(`nomorSPK`),
    UNIQUE INDEX `spk_unitId_key`(`unitId`),
    UNIQUE INDEX `spk_prospekId_key`(`prospekId`),
    INDEX `spk_deletedAt_idx`(`deletedAt`),
    INDEX `spk_pelangganId_idx`(`pelangganId`),
    INDEX `spk_unitId_idx`(`unitId`),
    INDEX `spk_idKelurahanPengiriman_idx`(`idKelurahanPengiriman`),
    INDEX `spk_prospekId_idx`(`prospekId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `follow_up` (
    `id` VARCHAR(36) NOT NULL,
    `prospekId` VARCHAR(36) NOT NULL,
    `salesId` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `catatan` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('BARU', 'FOLLOW_UP', 'PENGAJUAN_LEASING', 'DEAL', 'SPK', 'GUGUR') NOT NULL,

    INDEX `follow_up_prospekId_idx`(`prospekId`),
    INDEX `follow_up_salesId_idx`(`salesId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pelanggan` (
    `id` VARCHAR(36) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(191) NOT NULL,
    `noHp` VARCHAR(191) NOT NULL,
    `alamatLengkap` VARCHAR(191) NULL,
    `kelurahanId` VARCHAR(36) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pelanggan_nik_key`(`nik`),
    INDEX `pelanggan_deletedAt_idx`(`deletedAt`),
    INDEX `pelanggan_nik_idx`(`nik`),
    INDEX `pelanggan_kelurahanId_idx`(`kelurahanId`),
    INDEX `pelanggan_createdById_idx`(`createdById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pembelian_unit` (
    `id` VARCHAR(36) NOT NULL,
    `nomorNotaDebet` VARCHAR(191) NOT NULL,
    `nomorFaktur` VARCHAR(191) NOT NULL,
    `tanggalNota` DATETIME(3) NOT NULL,
    `cabangId` VARCHAR(191) NOT NULL,
    `totalUnit` INTEGER NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fakturId` VARCHAR(36) NULL,

    UNIQUE INDEX `pembelian_unit_nomorNotaDebet_key`(`nomorNotaDebet`),
    UNIQUE INDEX `pembelian_unit_nomorFaktur_key`(`nomorFaktur`),
    UNIQUE INDEX `pembelian_unit_fakturId_key`(`fakturId`),
    INDEX `pembelian_unit_deletedAt_idx`(`deletedAt`),
    INDEX `pembelian_unit_cabangId_idx`(`cabangId`),
    INDEX `pembelian_unit_createdById_idx`(`createdById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pembelian_unit_detail` (
    `id` VARCHAR(36) NOT NULL,
    `pembelianUnitId` VARCHAR(36) NOT NULL,
    `modelId` VARCHAR(36) NOT NULL,
    `warnaId` VARCHAR(36) NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `pembelian_unit_detail_deletedAt_idx`(`deletedAt`),
    INDEX `pembelian_unit_detail_pembelianUnitId_idx`(`pembelianUnitId`),
    INDEX `pembelian_unit_detail_modelId_idx`(`modelId`),
    INDEX `pembelian_unit_detail_warnaId_idx`(`warnaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_persetujuan` (
    `id` VARCHAR(36) NOT NULL,
    `spkId` VARCHAR(36) NOT NULL,
    `approverId` VARCHAR(191) NOT NULL,
    `approval_role` VARCHAR(191) NOT NULL,
    `status` ENUM('AUTO_APPROVED', 'PENDING_SPV', 'PENDING_MANAGER', 'APPROVED', 'REJECTED') NOT NULL,
    `catatan` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `log_persetujuan_spkId_idx`(`spkId`),
    INDEX `log_persetujuan_approverId_idx`(`approverId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faktur` (
    `id` VARCHAR(36) NOT NULL,
    `nomorFaktur` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `validatedById` VARCHAR(191) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `jenisFaktur` ENUM('SPK', 'PEMBELIAN_UNIT', 'DOKUMEN_KENDARAAN') NOT NULL,
    `cabangId` VARCHAR(191) NOT NULL,
    `spkId` VARCHAR(36) NULL,

    UNIQUE INDEX `faktur_nomorFaktur_key`(`nomorFaktur`),
    UNIQUE INDEX `faktur_spkId_key`(`spkId`),
    INDEX `faktur_deletedAt_idx`(`deletedAt`),
    INDEX `faktur_validatedById_idx`(`validatedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leasing` (
    `id` VARCHAR(36) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `kontak` VARCHAR(191) NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `leasing_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leasing_order` (
    `id` VARCHAR(36) NOT NULL,
    `leasingId` VARCHAR(36) NOT NULL,
    `nomorPO` VARCHAR(191) NULL,
    `jumlahPiutang` DECIMAL(65, 30) NOT NULL,
    `statusCair` ENUM('PENDING', 'CAIR', 'DITOLAK') NOT NULL DEFAULT 'PENDING',
    `tanggalCair` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `cabangId` VARCHAR(191) NOT NULL,
    `pembayaranId` VARCHAR(36) NULL,
    `prospekId` VARCHAR(36) NULL,

    UNIQUE INDEX `leasing_order_pembayaranId_key`(`pembayaranId`),
    UNIQUE INDEX `leasing_order_prospekId_key`(`prospekId`),
    INDEX `leasing_order_prospekId_idx`(`prospekId`),
    INDEX `leasing_order_leasingId_idx`(`leasingId`),
    INDEX `leasing_order_cabangId_idx`(`cabangId`),
    INDEX `leasing_order_pembayaranId_idx`(`pembayaranId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `unit` (
    `id` VARCHAR(36) NOT NULL,
    `nomorRangka` VARCHAR(191) NOT NULL,
    `nomorMesin` VARCHAR(191) NOT NULL,
    `tahun` INTEGER NOT NULL,
    `status` ENUM('GUDANG', 'PDC', 'NRFS', 'SHOWROOM', 'BOOKED', 'SOLD') NOT NULL,
    `modelId` VARCHAR(36) NOT NULL,
    `warnaId` VARCHAR(36) NOT NULL,
    `pembelianUnitId` VARCHAR(36) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `cabangId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `unit_nomorRangka_key`(`nomorRangka`),
    UNIQUE INDEX `unit_nomorMesin_key`(`nomorMesin`),
    INDEX `unit_deletedAt_idx`(`deletedAt`),
    INDEX `unit_status_idx`(`status`),
    INDEX `unit_nomorRangka_idx`(`nomorRangka`),
    INDEX `unit_nomorMesin_idx`(`nomorMesin`),
    INDEX `unit_modelId_idx`(`modelId`),
    INDEX `unit_warnaId_idx`(`warnaId`),
    INDEX `unit_cabangId_idx`(`cabangId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `surat_jalan` (
    `id` VARCHAR(36) NOT NULL,
    `nomorSuratJalan` VARCHAR(191) NOT NULL,
    `fakturId` VARCHAR(36) NOT NULL,
    `isOverridden` BOOLEAN NOT NULL DEFAULT false,
    `overrideById` VARCHAR(191) NULL,
    `overrideReason` VARCHAR(191) NULL,
    `status` ENUM('DIPROSES', 'DIKIRIM', 'DITERIMA') NOT NULL DEFAULT 'DIPROSES',
    `tanggalKirim` DATETIME(3) NULL,
    `tanggalTerima` DATETIME(3) NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `cabangId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `surat_jalan_nomorSuratJalan_key`(`nomorSuratJalan`),
    UNIQUE INDEX `surat_jalan_fakturId_key`(`fakturId`),
    INDEX `surat_jalan_overrideById_idx`(`overrideById`),
    INDEX `surat_jalan_deletedAt_idx`(`deletedAt`),
    INDEX `surat_jalan_fakturId_idx`(`fakturId`),
    INDEX `surat_jalan_cabangId_idx`(`cabangId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pembayaran` (
    `id` VARCHAR(36) NOT NULL,
    `prospekId` VARCHAR(36) NULL,
    `fakturId` VARCHAR(36) NULL,
    `leasingId` VARCHAR(36) NULL,
    `jumlah` DECIMAL(65, 30) NOT NULL,
    `jenis` ENUM('UANG_TITIPAN', 'DP', 'PELUNASAN') NOT NULL,
    `metode` ENUM('CASH', 'TRANSFER') NOT NULL,
    `buktiBayar` VARCHAR(191) NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `cabangId` VARCHAR(191) NOT NULL,
    `spkId` VARCHAR(36) NULL,

    INDEX `pembayaran_deletedAt_idx`(`deletedAt`),
    INDEX `pembayaran_prospekId_idx`(`prospekId`),
    INDEX `pembayaran_fakturId_idx`(`fakturId`),
    INDEX `pembayaran_createdById_idx`(`createdById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dokumen_kendaraan` (
    `id` VARCHAR(36) NOT NULL,
    `unitId` VARCHAR(36) NOT NULL,
    `tglFakturMainDealer` DATETIME(3) NULL,
    `tglFakturMainDealerDiterima` DATETIME(3) NULL,
    `tglPengajuanSamsat` DATETIME(3) NULL,
    `tglStnkDiterima` DATETIME(3) NULL,
    `tglStnkDiserahkan` DATETIME(3) NULL,
    `tglBpkbDiterima` DATETIME(3) NULL,
    `tglBpkbDiserahkan` DATETIME(3) NULL,
    `noPolisi` VARCHAR(191) NULL,
    `nomorBpkb` VARCHAR(191) NULL,
    `status` ENUM('PENDING_FAKTUR', 'PROSES_SAMSAT', 'STNK_DITERIMA', 'STNK_DISERAHKAN', 'BPKB_DITERIMA', 'BPKB_DISERAHKAN') NOT NULL DEFAULT 'PENDING_FAKTUR',
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedById` VARCHAR(191) NULL,
    `fakturId` VARCHAR(36) NULL,

    UNIQUE INDEX `dokumen_kendaraan_unitId_key`(`unitId`),
    UNIQUE INDEX `dokumen_kendaraan_fakturId_key`(`fakturId`),
    INDEX `dokumen_kendaraan_deletedAt_idx`(`deletedAt`),
    INDEX `dokumen_kendaraan_unitId_idx`(`unitId`),
    INDEX `dokumen_kendaraan_updatedById_idx`(`updatedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `analitik` (
    `id` VARCHAR(36) NOT NULL,
    `pelangganId` VARCHAR(36) NOT NULL,
    `rfts_recency` INTEGER NOT NULL,
    `rfts_frequency` INTEGER NOT NULL,
    `rfts_tenure` INTEGER NOT NULL,
    `rfts_segment` ENUM('Matic', 'Sport', 'Cub', 'Listrik') NOT NULL,
    `clusterLabel` ENUM('LOYAL', 'POTENTIAL', 'STANDARD', 'AT_RISK', 'DORMANT') NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `analitik_pelangganId_key`(`pelangganId`),
    INDEX `analitik_deletedAt_idx`(`deletedAt`),
    INDEX `analitik_pelangganId_idx`(`pelangganId`),
    INDEX `analitik_clusterLabel_idx`(`clusterLabel`),
    INDEX `analitik_rfts_segment_idx`(`rfts_segment`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team` ADD CONSTRAINT `team_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_member` ADD CONSTRAINT `team_member_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_member` ADD CONSTRAINT `team_member_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member` ADD CONSTRAINT `member_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member` ADD CONSTRAINT `member_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_inviterId_fkey` FOREIGN KEY (`inviterId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kecamatan` ADD CONSTRAINT `kecamatan_kabupatenId_fkey` FOREIGN KEY (`kabupatenId`) REFERENCES `kabupaten`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelurahan` ADD CONSTRAINT `kelurahan_kecamatanId_fkey` FOREIGN KEY (`kecamatanId`) REFERENCES `kecamatan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sub_sumber_prospek` ADD CONSTRAINT `sub_sumber_prospek_sumberProspekId_fkey` FOREIGN KEY (`sumberProspekId`) REFERENCES `sumber_prospek`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prospek` ADD CONSTRAINT `prospek_pelangganId_fkey` FOREIGN KEY (`pelangganId`) REFERENCES `pelanggan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prospek` ADD CONSTRAINT `prospek_cabangId_fkey` FOREIGN KEY (`cabangId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prospek` ADD CONSTRAINT `prospek_salesId_fkey` FOREIGN KEY (`salesId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prospek` ADD CONSTRAINT `prospek_subSumberId_fkey` FOREIGN KEY (`subSumberId`) REFERENCES `sub_sumber_prospek`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prospek` ADD CONSTRAINT `prospek_modelId_fkey` FOREIGN KEY (`modelId`) REFERENCES `master_model`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prospek` ADD CONSTRAINT `prospek_warnaId_fkey` FOREIGN KEY (`warnaId`) REFERENCES `master_warna`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prospek` ADD CONSTRAINT `prospek_kelurahanId_fkey` FOREIGN KEY (`kelurahanId`) REFERENCES `kelurahan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `spk` ADD CONSTRAINT `spk_prospekId_fkey` FOREIGN KEY (`prospekId`) REFERENCES `prospek`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `spk` ADD CONSTRAINT `spk_idKelurahanPengiriman_fkey` FOREIGN KEY (`idKelurahanPengiriman`) REFERENCES `kelurahan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `spk` ADD CONSTRAINT `spk_pelangganId_fkey` FOREIGN KEY (`pelangganId`) REFERENCES `pelanggan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `spk` ADD CONSTRAINT `spk_spv_approval_by_fkey` FOREIGN KEY (`spv_approval_by`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `spk` ADD CONSTRAINT `spk_manager_approval_by_fkey` FOREIGN KEY (`manager_approval_by`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `spk` ADD CONSTRAINT `spk_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `follow_up` ADD CONSTRAINT `follow_up_prospekId_fkey` FOREIGN KEY (`prospekId`) REFERENCES `prospek`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `follow_up` ADD CONSTRAINT `follow_up_salesId_fkey` FOREIGN KEY (`salesId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pelanggan` ADD CONSTRAINT `pelanggan_kelurahanId_fkey` FOREIGN KEY (`kelurahanId`) REFERENCES `kelurahan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pelanggan` ADD CONSTRAINT `pelanggan_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembelian_unit` ADD CONSTRAINT `pembelian_unit_fakturId_fkey` FOREIGN KEY (`fakturId`) REFERENCES `faktur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembelian_unit` ADD CONSTRAINT `pembelian_unit_cabangId_fkey` FOREIGN KEY (`cabangId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembelian_unit` ADD CONSTRAINT `pembelian_unit_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembelian_unit_detail` ADD CONSTRAINT `pembelian_unit_detail_pembelianUnitId_fkey` FOREIGN KEY (`pembelianUnitId`) REFERENCES `pembelian_unit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembelian_unit_detail` ADD CONSTRAINT `pembelian_unit_detail_modelId_fkey` FOREIGN KEY (`modelId`) REFERENCES `master_model`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembelian_unit_detail` ADD CONSTRAINT `pembelian_unit_detail_warnaId_fkey` FOREIGN KEY (`warnaId`) REFERENCES `master_warna`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_persetujuan` ADD CONSTRAINT `log_persetujuan_spkId_fkey` FOREIGN KEY (`spkId`) REFERENCES `spk`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_persetujuan` ADD CONSTRAINT `log_persetujuan_approverId_fkey` FOREIGN KEY (`approverId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `faktur` ADD CONSTRAINT `faktur_cabangId_fkey` FOREIGN KEY (`cabangId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `faktur` ADD CONSTRAINT `faktur_validatedById_fkey` FOREIGN KEY (`validatedById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `faktur` ADD CONSTRAINT `faktur_spkId_fkey` FOREIGN KEY (`spkId`) REFERENCES `spk`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leasing_order` ADD CONSTRAINT `leasing_order_prospekId_fkey` FOREIGN KEY (`prospekId`) REFERENCES `prospek`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leasing_order` ADD CONSTRAINT `leasing_order_cabangId_fkey` FOREIGN KEY (`cabangId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leasing_order` ADD CONSTRAINT `leasing_order_leasingId_fkey` FOREIGN KEY (`leasingId`) REFERENCES `leasing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leasing_order` ADD CONSTRAINT `leasing_order_pembayaranId_fkey` FOREIGN KEY (`pembayaranId`) REFERENCES `pembayaran`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `unit` ADD CONSTRAINT `unit_cabangId_fkey` FOREIGN KEY (`cabangId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `unit` ADD CONSTRAINT `unit_modelId_fkey` FOREIGN KEY (`modelId`) REFERENCES `master_model`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `unit` ADD CONSTRAINT `unit_warnaId_fkey` FOREIGN KEY (`warnaId`) REFERENCES `master_warna`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `unit` ADD CONSTRAINT `unit_pembelianUnitId_fkey` FOREIGN KEY (`pembelianUnitId`) REFERENCES `pembelian_unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `surat_jalan` ADD CONSTRAINT `surat_jalan_fakturId_fkey` FOREIGN KEY (`fakturId`) REFERENCES `faktur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `surat_jalan` ADD CONSTRAINT `surat_jalan_overrideById_fkey` FOREIGN KEY (`overrideById`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `surat_jalan` ADD CONSTRAINT `surat_jalan_cabangId_fkey` FOREIGN KEY (`cabangId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembayaran` ADD CONSTRAINT `pembayaran_cabangId_fkey` FOREIGN KEY (`cabangId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembayaran` ADD CONSTRAINT `pembayaran_prospekId_fkey` FOREIGN KEY (`prospekId`) REFERENCES `prospek`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembayaran` ADD CONSTRAINT `pembayaran_fakturId_fkey` FOREIGN KEY (`fakturId`) REFERENCES `faktur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembayaran` ADD CONSTRAINT `pembayaran_leasingId_fkey` FOREIGN KEY (`leasingId`) REFERENCES `leasing`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembayaran` ADD CONSTRAINT `pembayaran_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembayaran` ADD CONSTRAINT `pembayaran_spkId_fkey` FOREIGN KEY (`spkId`) REFERENCES `spk`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dokumen_kendaraan` ADD CONSTRAINT `dokumen_kendaraan_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `unit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dokumen_kendaraan` ADD CONSTRAINT `dokumen_kendaraan_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dokumen_kendaraan` ADD CONSTRAINT `dokumen_kendaraan_fakturId_fkey` FOREIGN KEY (`fakturId`) REFERENCES `faktur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `analitik` ADD CONSTRAINT `analitik_pelangganId_fkey` FOREIGN KEY (`pelangganId`) REFERENCES `pelanggan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

