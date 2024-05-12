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
import { createBand } from "@/lib/db";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function AddBandButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setName("");
      }}
    >
      <Button type="button" onClick={() => setOpen(true)}>
        New
      </Button>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Band</SheetTitle>
        </SheetHeader>
        <div className={cn("py-4")}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await createBand({
                name,
              });
              setName("");
              setOpen(false);
            }}
          >
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Title</Label>
                <Input
                  id="title"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Button disabled={!name} className="shrink-0" type="submit">
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
