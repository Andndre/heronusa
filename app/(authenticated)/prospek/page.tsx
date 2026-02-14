import { getProspekData, getDropdownData } from "@/server/prospek";
import { ProspekClientComponent } from "./prosek-client";

export default async function ProspekPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}) {
  const { page, pageSize } = await searchParams;
  const currentPage = Number(page) || 1;
  const currentPageSize = Number(pageSize) || 10;

  const [prospekResponse, dropdownData] = await Promise.all([
    getProspekData(currentPage, currentPageSize),
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
        <ProspekClientComponent
          data={prospekResponse.data}
          totalCount={prospekResponse.totalCount}
          pageCount={prospekResponse.pageCount}
          currentPage={currentPage}
          pageSize={currentPageSize}
          dropdownData={dropdownData}
        />
      </div>
    </div>
  );
}
