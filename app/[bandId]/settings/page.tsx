"use client";

import { useEffect } from "react";
import Band from "./band/Band";
import Members from "./members/Members";
import { mixpanel } from "@/lib/mixpanel";

export default function SettingsPage({
  params,
}: {
  params: { bandId: string };
}) {
  useEffect(() => {
    mixpanel.track("Band Settings Page Viewed", {
      bandId: params.bandId,
    });
  }, [params.bandId]);
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
