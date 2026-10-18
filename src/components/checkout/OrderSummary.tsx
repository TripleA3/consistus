import { CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import { Card, CoverPlaceholder } from "@/components/kit";
import { useCheckout } from "@/lib/checkout/CheckoutContext";
import { money } from "@/lib/format";

export function OrderSummary() {
  const { event, lines, totals } = useCheckout();

  return (
    <Card flush className="w-full lg:sticky lg:top-20 lg:w-[300px] lg:shrink-0">
      <CoverPlaceholder className="aspect-[16/7]">
        <CalendarBlank size={26} />
      </CoverPlaceholder>

      <div className="p-4">
        <p className="text-label-md uppercase tracking-wide text-muted-foreground">
          Order summary
        </p>
        <p className="mt-0.5 text-title-md">{event.title}</p>

        {lines.length === 0 ? (
          <p className="mt-3 text-body-md text-muted-foreground">No tickets selected yet.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-1.5">
            {lines.map((line) => (
              <li key={line.tier.id} className="flex items-center justify-between gap-2 text-body-md">
                <span className="truncate">
                  {line.tier.name} × {line.quantity}
                </span>
                <span className="shrink-0 tabular-nums">
                  {money(line.tier.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <dl className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3 text-body-md">
          <div className="flex items-center justify-between text-muted-foreground">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{money(totals.subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <dt>Service fee</dt>
            <dd className="tabular-nums">{money(totals.fees)}</dd>
          </div>
          <div className="flex items-center justify-between pt-1.5 text-title-md">
            <dt>Total</dt>
            <dd className="tabular-nums">{money(totals.total)}</dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}
