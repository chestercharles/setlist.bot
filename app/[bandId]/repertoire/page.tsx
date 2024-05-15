"use client";

import { cn } from "@/lib/utils";
import { AddSongButton } from "./AddSongButton";
import { SongList } from "./SongList";
import { useEffect } from "react";
import { mixpanel } from "@/lib/mixpanel";

export default function RepertoirePage({
  params,
}: {
  params: { bandId: string };
}) {
  useEffect(() => {
    mixpanel.track("Band Repertoire Page Viewed", {
      bandId: params.bandId,
    });
  }, [params.bandId]);
  return (
    <main className="p-8">
      <div className={cn("flex", "justify-between")}>
        <h1 className={cn("text-xl", "font-bold", "mb-4")}>Repertoire</h1>
        <div className={cn("flex", "justify-end")}>
          <AddSongButton bandId={params.bandId} />
        </div>
      </div>
      <SongList bandId={params.bandId} />
    </main>
  );
}
