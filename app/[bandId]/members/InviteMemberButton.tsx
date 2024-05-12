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
import { db, inviteBandMember } from "@/lib/db";
import { cn } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";

export function InviteMemberButton({ bandId }: { bandId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const band = useLiveQuery(() => db.bands.get(bandId));

  if (!band) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button type="button" onClick={() => setOpen(true)}>
        Invite
      </Button>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Invite Member to {band?.name}</SheetTitle>
        </SheetHeader>
        <div className={cn("py-4")}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await inviteBandMember(band, {
                name,
                email,
              });
              setName("");
              setEmail("");
              setOpen(false);
            }}
          >
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Name</Label>
                <Input
                  id="title"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Key</Label>
                <Input
                  id="key"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Button
                  disabled={!name || !email}
                  className="shrink-0"
                  type="submit"
                >
                  Send
                </Button>
              </div>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
