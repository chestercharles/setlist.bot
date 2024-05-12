"use client";

import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    db.open();
  });
  return (
    <div className={cn("w-screen flex justify-center items-center")}>
      <div>
        <h1 className={cn("p-12", "font-extrabold", "text-4xl")}>
          Welcome to Setlists
        </h1>
      </div>
    </div>
  );
}
