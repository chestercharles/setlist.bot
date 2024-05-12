"use client";

import { SongList } from "./SongList";
import { AddSongButton } from "./AddSongButton";
import { cn } from "@/lib/utils";

export default function BandPage({ params }: { params: { bandId: string } }) {
  const bandId = params.bandId;
  return (
    <main className="p-8">
      <div className={cn("flex", "justify-between")}>
        <h1 className={cn("text-xl", "font-bold", "mb-4")}>Repertoire</h1>
        <div className={cn("flex", "justify-end")}>
          <AddSongButton bandId={bandId} />
        </div>
      </div>
      <SongList bandId={bandId} />
    </main>
  );
}
