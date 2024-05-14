"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import Link from "next/link";
import { mixpanel } from "@/lib/mixpanel";

export default function Members({ bandId }: { bandId: string }) {
  const band = useLiveQuery(() => db.bands.get(bandId));
  return (
    <Card className={cn("my-8")}>
      <CardHeader>
        <CardTitle>Band</CardTitle>
      </CardHeader>
      <CardContent className={cn("flex", "justify-between")}>
        <div>{band?.name}</div>
        <Link
          className={cn("cursor-pointer", "hover:underline")}
          href={"/bands"}
          onClick={() => {
            mixpanel.track("Band Unselected", { bandId });
          }}
        >
          Not the band you&apos;re looking for?
        </Link>
      </CardContent>
    </Card>
  );
}
