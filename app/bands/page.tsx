"use client";

import { cn } from "@/lib/utils";
import { AddBandButton } from "./AddBandButton";
import { BandsList } from "./BandsList";
import { useEffect } from "react";
import { mixpanel } from "@/lib/mixpanel";

export default function BandsPage() {
  useEffect(() => {
    mixpanel.track("Bands Page Viewed");
  }, []);
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
