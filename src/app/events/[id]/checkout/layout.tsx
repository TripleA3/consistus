import { notFound } from "next/navigation";
import { PageHeader } from "@/components/kit";
import { AppShell } from "@/components/shell/AppShell";
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
    <AppShell>
      <PageHeader title="Checkout" subtitle={event.title} back={`/events/${event.id}`} />
      <StepIndicator />
      <CheckoutProvider event={event}>{children}</CheckoutProvider>
    </AppShell>
  );
}
