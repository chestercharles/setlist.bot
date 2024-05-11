"use client";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/7qhdbgF1sTo
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/app/db";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

export default function Home() {
  const songs = useLiveQuery(() => db.songs.toArray());
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-950">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 overflow-scroll">
        <h1 className="text-2xl font-bold mb-4">Songs</h1>
        <div className=" space-y-4">
          <div className="space-y-2" />
          {songs?.map((song) => (
            <SongCard key={song.name} song={song} />
          ))}
          <div className="space-y-2" />
          <AddSongForm />
        </div>
      </div>
    </main>
  );
}

function AddSongForm() {
  const [name, setName] = useState("");

  async function addSong() {
    await db.songs.add({
      name,
    });
    setName("");
  }

  return (
    <form
      className="flex justify-between space-x-2"
      onSubmit={(e) => {
        e.preventDefault();
        addSong();
      }}
    >
      <Input
        className="max-w-xs w-full"
        placeholder="Enter new item"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button disabled={!name} className="shrink-0" type="submit">
        Add New Item
      </Button>
    </form>
  );
}

function SongCard({ song }: { song: { name: string } }) {
  return (
    <Card>
      <div className="flex justify-between space-x-2">
        <span className="px-4 py-2">{song.name}</span>
        <Button
          onClick={async () => {
            await db.songs.delete(song.name);
          }}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
}
