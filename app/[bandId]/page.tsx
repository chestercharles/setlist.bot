"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { generate, SetlistResponse } from "./generate";
import { db } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { mixpanel } from "@/lib/mixpanel";

export const maxDuration = 60;

export default function GeneratePage({
  params,
}: {
  params: { bandId: string };
}) {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [setlistResponse, setSetlistResponse] =
    useState<SetlistResponse | null>(null);

  async function generateSetlist() {
    mixpanel.track("Generate Setlist Clicked", {
      bandId: params.bandId,
      prompt,
    });
    setGenerating(true);
    setError(null);
    const repertoire = await db.songs
      .where("bandId")
      .equals(params.bandId)
      .toArray();
    const result = await generate({ prompt, repertoire })
      .then((result) => {
        if (result) {
          mixpanel.track("Setlist Generated", {
            bandId: params.bandId,
            prompt,
            result,
          });
        }
        return result;
      })
      .catch((e) => {
        mixpanel.track("Setlist Generation Failed", {
          bandId: params.bandId,
          prompt,
          error: e.message,
        });
        setError(e.message);
        return null;
      });
    setSetlistResponse(result);
    setGenerating(false);
  }

  return (
    <main className="p-8">
      <div className={cn("flex", "justify-between")}>
        <h1 className={cn("text-xl", "font-bold", "mb-4")}>Generate Setlist</h1>
      </div>
      <div className={cn("py-4")}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await generateSetlist();
          }}
        >
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">
                Describe the setlist you wish to generate
              </Label>
              <Textarea
                id="title"
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Button disabled={!prompt} className="shrink-0" type="submit">
                Generate Setlist
              </Button>
            </div>
          </div>
        </form>
      </div>
      {error && (
        <div className={cn("py-4")}>
          <p className={cn("py-4")}>
            Something went wrong when trying to generate your setlist.
            We&apos;ll work on fixing this. In the meantime, give it another
            try!{" "}
          </p>
        </div>
      )}
      {generating && (
        <div className="flex items-center space-x-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        </div>
      )}
      {setlistResponse && !generating && (
        <div className={cn("py-4")}>
          <p className={cn("py-4")}>{setlistResponse.assistantMessage}</p>
          <h2 className={cn("text-xl", "font-bold", "mb-4")}>Setlist</h2>
          <ul>
            {setlistResponse.setlist.map((song) => (
              <li key={song.title}>
                {song.title} ({song.key})
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
