import { getProspekData, getDropdownData } from "@/server/prospek";
import { ProspekClientComponent } from "./prosek-client";

export default async function ProspekPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string; q?: string }>;
}) {
  const { page, pageSize, q } = await searchParams;
  const currentPage = Number(page) || 1;
  const currentPageSize = Number(pageSize) || 10;
  const query = q || "";

  const [prospekResponse, dropdownData] = await Promise.all([
    getProspekData(currentPage, currentPageSize, query),
    getDropdownData(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-1 text-3xl font-bold">Manajemen Prospek</h1>
        <p className="text-gray-500">Kelola prospek penjualan dan aktivitas tindak lanjut</p>
      </div>
      <div>
        <ProspekClientComponent
          data={prospekResponse.data}
          totalCount={prospekResponse.totalCount}
          pageCount={prospekResponse.pageCount}
          currentPage={currentPage}
          pageSize={currentPageSize}
          dropdownData={dropdownData}
          initialQuery={query}
        />
      </div>
    </div>
  );
}
