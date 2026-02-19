import { getProspekData, getDropdownData } from "@/server/prospek";
import { ProspekClientComponent } from "./prospek-client";

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
  );
}
