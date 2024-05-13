"use client";

import { DataTable } from "@/components/layout/DataTable";
import { db } from "@/lib/db";
import { ColumnDef } from "@tanstack/react-table";
import { useLiveQuery, useObservable } from "dexie-react-hooks";

const columns: ColumnDef<{
  name?: string;
  email?: string;
  details: string;
}>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "details",
    header: "",
  },
];

export function MembersList() {
  const members = useLiveQuery(() => db.members.toArray()) ?? [];
  const user = useObservable(db.cloud.currentUser);
  return (
    <DataTable
      columns={columns}
      data={members.map((m) => ({
        name: m.name ?? m.userId,
        email: m.email ?? m.userId,
        details: m.userId === user?.userId ? "(You)" : "",
      }))}
    />
  );
}
