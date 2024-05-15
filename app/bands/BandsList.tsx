"use client";

import { Band, db } from "@/lib/db";
import { mixpanel } from "@/lib/mixpanel";
import { useLiveQuery } from "dexie-react-hooks";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AddBandButton } from "./AddBandButton";
import { useState } from "react";
import Image from "next/image";

export function BandsList() {
  let bands = useLiveQuery(() => db.bands.toArray()) ?? [];
  return (
    <div className={cn("flex", "flex-wrap", "m-0")}>
      {bands.map((band) => (
        <BandCard key={band.id} band={band} />
      ))}
      <CreateNewBandCard />
    </div>
  );
}

const bandCardClassNames = cn(
  "max-w-[300px]",
  "min-w-[300px]",
  "cursor-pointer",
  "m-0",
  "mr-4",
  "transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none"
);

function BandCard({ band }: { band: Band }) {
  const router = useRouter();
  return (
    <Card
      className={cn(bandCardClassNames)}
      onClick={() => {
        mixpanel.track("Band Clicked", { bandId: band.id });
        router.push(`/${band.id}`);
      }}
    >
      <CardHeader>
        <CardContent>
          <Image src={"/pine.jpg"} alt="cat" width={300} height={300} />
        </CardContent>
        <CardTitle>{band.name}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function CreateNewBandCard() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <AddBandButton open={open} setOpen={setOpen} />
      <Card
        className={cn(bandCardClassNames, "border-0", "opacity-60")}
        onClick={() => {
          setOpen(true);
        }}
      >
        <CardHeader>
          <CardContent>
            <Image src={"/cactus.jpg"} alt="cat" width={300} height={300} />
          </CardContent>
          <CardTitle className={cn("opacity-100")}>Add a band</CardTitle>
        </CardHeader>
      </Card>
    </>
  );
}
