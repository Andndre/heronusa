import { getProspekData, getDropdownData } from "@/server/prospek";
import { ProspekClientComponent } from "./prosek-client";

export default async function ProspekPage() {
  const [data, dropdownData] = await Promise.all([
    getProspekData(),
    getDropdownData(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Manajemen Prospek</h1>
        <p className="text-gray-500">
          Kelola prospek penjualan dan aktivitas tindak lanjut
        </p>
      </div>
      <div>
        <ProspekClientComponent data={data} dropdownData={dropdownData} />
      </div>
    </div>
  );
}
