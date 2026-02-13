"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { Organization } from "@/lib/generated/prisma/browser";

interface CabangSwitcherProps {
  organizations: Organization[];
}

export function CabangSwitcher({ organizations }: CabangSwitcherProps) {
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const handleChangeCabang = async (organizationId: string) => {
    await authClient.organization.setActive({
      organizationId,
    });
  };

  return (
    <Select
      onValueChange={handleChangeCabang}
      value={activeOrganization?.id ?? ""}
    >
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Pilih Cabang" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {organizations.map((org) => (
            <SelectItem key={org.id} value={org.id}>
              {org.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
