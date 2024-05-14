"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { addSong } from "@/lib/db";
import { mixpanel } from "@/lib/mixpanel";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function AddSongButton({ bandId }: { bandId: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button type="button" onClick={() => setOpen(true)}>
        New
      </Button>
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Add Song</SheetTitle>
        </SheetHeader>
        <div className={cn("py-4")}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const songId = await addSong({
                title,
                bandId,
                key,
                description,
              });
              setTitle("");
              setKey("");
              setDescription("");
              setOpen(false);
              mixpanel.track("Song Created", {
                bandId,
                songId,
              });
            }}
          >
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Title</Label>
                <Input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Key</Label>
                <Input
                  id="key"
                  type="text"
                  required
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Description</Label>
                <Textarea
                  id="key"
                  required
                  className="h-[250px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Button
                  disabled={!title || !key || !description}
                  className="shrink-0"
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
