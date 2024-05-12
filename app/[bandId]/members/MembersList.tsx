"use client";

import { DataTable } from "@/components/layout/DataTable";
import { db, Member } from "@/lib/db";
import { ColumnDef } from "@tanstack/react-table";
import { DBRealmMember } from "dexie-cloud-addon";
import { useLiveQuery, useObservable } from "dexie-react-hooks";

const columns: ColumnDef<Pick<Member, "name" | "email">>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

export function MembersList({ bandId }: { bandId: string }) {
  const members =
    useLiveQuery(() => db.members.where("bandId").equals(bandId).toArray()) ??
    [];

  const user = useObservable(db.cloud.currentUser);

  if (!user) {
    return null;
  }

  return <DataTable columns={columns} data={[user, ...members]} />;
}
