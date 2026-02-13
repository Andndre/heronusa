import { getProspekData } from "@/server/prospek";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function ProspekPage() {
  const data = await getProspekData();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Manajemen Prospek</h1>
        <p className="text-gray-500">
          Kelola prospek penjualan dan aktivitas tindak lanjut
        </p>
      </div>
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
