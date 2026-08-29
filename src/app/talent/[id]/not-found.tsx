import { AppShell } from "@/components/layout/AppShell";
import { ButtonLink } from "@/components/ui/Button";

export default function TalentNotFound() {
  return (
    <AppShell activePath="/">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-text">Talent not found</h1>
        <p className="text-base text-slate-500">
          This profile may have been removed or the link is incorrect.
        </p>
        <ButtonLink href="/" variant="primary">
          Back to home
        </ButtonLink>
      </div>
    </AppShell>
  );
}
