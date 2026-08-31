import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { StepIndicator } from "@/components/checkout/StepIndicator";
import { CheckoutProvider } from "@/lib/checkout/CheckoutContext";
import { fetchEventById } from "@/lib/api/events";

export default async function CheckoutLayout({
  children,
  params,
}: LayoutProps<"/events/[id]/checkout">) {
  const { id } = await params;
  const event = await fetchEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <AppShell activePath="/events">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-10 sm:px-8">
        <StepIndicator />
        <CheckoutProvider event={event}>{children}</CheckoutProvider>
      </div>
    </AppShell>
  );
}
