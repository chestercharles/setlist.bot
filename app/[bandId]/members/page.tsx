import { cn } from "@/lib/utils";
import { InviteMemberButton } from "./InviteMemberButton";
import { MembersList } from "./MembersList";

export default function MembersPage({
  params,
}: {
  params: { bandId: string };
}) {
  return (
    <main className="p-8">
      <div className={cn("py-4", "flex", "justify-between")}>
        <h1 className={cn("text-xl", "font-bold", "mb-4")}>Members</h1>
        <div className={cn("flex", "justify-end")}>
          <InviteMemberButton bandId={params.bandId} />
        </div>
      </div>
      <MembersList />
    </main>
  );
}
