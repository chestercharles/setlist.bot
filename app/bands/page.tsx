"use client";

import { cn } from "@/lib/utils";
import { AddBandButton } from "./AddBandButton";
import { BandsList } from "./BandsList";

export default function BandsPage() {
  return (
    <main className={cn("p-8")}>
      <div className={cn("flex", "justify-between")}>
        <h1 className={cn("text-2xl", "font-bold", "mb-4")}>Bands</h1>
        <div className={cn("flex", "justify-end")}>
          <AddBandButton />
        </div>
      </div>
      <BandsList />
    </main>
  );
}
