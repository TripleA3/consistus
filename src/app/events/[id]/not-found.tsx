import { AppShell } from "@/components/layout/AppShell";
import { ButtonLink } from "@/components/ui/Button";

export default function EventNotFound() {
  return (
    <AppShell activePath="/events">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-text">Event not found</h1>
        <p className="text-base text-slate-500">
          This event may have been removed or the link is incorrect.
        </p>
        <ButtonLink href="/events" variant="primary">
          Browse events
        </ButtonLink>
      </div>
    </AppShell>
  );
}
