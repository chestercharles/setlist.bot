"use client";

import { cn } from "@/lib/utils";
import { InviteMemberButton } from "./InviteMemberButton";
import { MembersList } from "./MembersList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Members({ bandId }: { bandId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("flex", "justify-between")}>
          <div className={cn("text-center")}>Members</div>
          <InviteMemberButton bandId={bandId} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MembersList />
      </CardContent>
    </Card>
  );
}
