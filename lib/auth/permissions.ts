import { createAccessControl } from "better-auth/plugins";

/**
 * Roles:
 * * SUPER_ADMIN - bertugas membuat dan mengelola seluruh cabang (organizations kalau di better-auth) dan juga master data
 * * SALES - akses penuh ke prospek dan spk
 * * SPV - mengawasi kinerja SALES di team sale nya, serta meng-ACC diskon kecil pada SPK
 * * KASIR - akses penuh ke pembayaran dan laporan keuangan
 * * ADMIN_GUDANG - input nota debet dan mutasi unit dari gudang ke pdc
 * * ADMIN_PDC - memindahkan unit dari PDC ke SHOWROOM
 * * KOORDINATOR_SUPIR - mengupdate informasi pengiriman unit ke customer, termasuk siapa supirnya
 * * ADMIN_STNK - yang mengurus proses pengajuan ke samsat, input stnk dan bpkb
 * * ADMIN_FAKTUR - yang mengubah SPK menjadi Faktur, dan mengurus segala urusan Faktur
 * * MANAGER_MARKETING - melakukan ACC diskon pada SPK
 * * MANAGER_FINANCE - yang melakukan ACC surat jalan & menentukan rentang diskon dari SALES dan SPV
 */

/**
enum Role {
  SUPER_ADMIN
  SALES
  SPV
  KASIR
  ADMIN_GUDANG // input pembelian nota debet, mutasi ke pdc
  ADMIN_PDC // pdc ke showroom
  KOORDINATOR_SUPIR // yang mengupdate informasi pengiriman (info supir)
  ADMIN_STNK
  ADMIN_FAKTUR
  // MANAGER MARKETING -> yang acc diskon
  // MANAGER FINANCE -> yang acc surat jalan & yang menentukan rentang 
  // diskon dari sales
}
 */

const statement = {} as const;

const ac = createAccessControl(statement);

const owner = ac.newRole({});

export { ac, owner };
