import { getProspekData, getDropdownData } from "@/server/prospek";
import { ProspekClientComponent } from "./prospek-client";

export default async function ProspekPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    q?: string;
    [key: string]: string | string[] | undefined;
  }>;
}) {
  const params = await searchParams;
  const { page, pageSize, q } = params;
  const currentPage = Number(page) || 1;
  const currentPageSize = Number(pageSize) || 10;
  const query = q || "";

  // Extract column filters from URL params
  const columnFilters: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    const match = key.match(/^filter\[(.*)\]$/);
    if (match && typeof value === "string") {
      columnFilters[match[1]] = value;
    }
  });

  const [prospekResponse, dropdownData] = await Promise.all([
    getProspekData(currentPage, currentPageSize, query, columnFilters),
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
