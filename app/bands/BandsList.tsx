"use client";

import { DataTable } from "@/components/layout/DataTable";
import { Band, db } from "@/lib/db";
import { ColumnDef } from "@tanstack/react-table";
import { useLiveQuery } from "dexie-react-hooks";
import { useRouter } from "next/navigation";

const columns: ColumnDef<Band>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
];

export function BandsList() {
  const bands = useLiveQuery(() => db.bands.toArray()) ?? [];
  const router = useRouter();
  return (
    <DataTable
      columns={columns}
      data={bands}
      onRowClick={(band) => {
        router.push(`/${band.id}`);
      }}
    />
  );
}
