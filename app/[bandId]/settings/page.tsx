"use client";

import Band from "./band/Band";
import Members from "./members/Members";

export default function SettingsPage({
  params,
}: {
  params: { bandId: string };
}) {
  return (
    <main className="p-8">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold mb-4">Settings</h1>
      </div>
      <Band bandId={params.bandId} />
      <Members bandId={params.bandId} />
    </main>
  );
}
