"use client";

import { authClient } from "@/lib/auth-client";
import { Organization } from "@/lib/generated/prisma/browser";
import { useRouter } from "next/navigation";
import { SearchableSelect } from "./ui/searchable-select";

interface CabangSwitcherProps {
  organizations: Organization[];
}

export function CabangSwitcher({ organizations }: CabangSwitcherProps) {
  const router = useRouter();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const handleChangeCabang = async (organizationId: string) => {
    await authClient.organization.setActive({
      organizationId,
    });
    router.refresh();
  };

  return (
    <SearchableSelect
      value={activeOrganization?.id ?? ""}
      className="max-w-56"
      onValueChange={handleChangeCabang}
      emptyText="Cabang Tidak Ditemukan"
      options={organizations.map((v) => {
        return {
          label: v.name,
          value: v.id,
        };
      })}
    />
  );
}
