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
import { Song, deleteSong, editSong } from "@/lib/db";
import { cn } from "@/lib/utils";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

export function EditSongSheet({
  song,
  onRequestClose,
}: {
  song: Song;
  onRequestClose: () => void;
}) {
  const [open, setOpen] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [title, setTitle] = useState(song.title);
  const [key, setKey] = useState(song.key ?? "");
  const [description, setDescription] = useState(song.description ?? "");
  const close = () => {
    setTitle("");
    setKey("");
    setDescription("");
    setOpen(false);
    wait().then(() => onRequestClose());
  };
  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          close();
        }
      }}
    >
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Edit Song</SheetTitle>
        </SheetHeader>
        <div className={cn("py-4")}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await editSong({
                id: song.id,
                title,
                key,
                description,
              });
              close();
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
              <div className="grid gap-2">
                <DeleteSongConfirmation
                  open={showConfirmDelete}
                  onConfirm={() => {
                    deleteSong(song.id);
                    setShowConfirmDelete(false);
                    close();
                  }}
                  onCancel={() => setShowConfirmDelete(false)}
                />
                <Button
                  variant={"destructive"}
                  className="shrink-0"
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                >
                  Delete Song
                </Button>
              </div>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function DeleteSongConfirmation({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your song
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
