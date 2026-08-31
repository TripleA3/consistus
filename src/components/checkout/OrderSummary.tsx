import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { useCheckout } from "@/lib/checkout/CheckoutContext";

const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 });

export function OrderSummary() {
  const { event, lines, totals } = useCheckout();
  const currency = event.ticketTiers[0]?.currency ?? "NGN";
  const format = currencyFormatter(currency);

  return (
    <aside className="flex w-full flex-col gap-4 rounded-2xl border border-card-border bg-white p-5 sm:w-72">
      <ImagePlaceholder id={event.coverImage} className="h-28 w-full rounded-xl" />
      <div>
        <p className="text-sm font-semibold text-slate-500">Order Summary</p>
        <p className="text-base font-semibold text-text">{event.title}</p>
      </div>
      {lines.length === 0 ? (
        <p className="text-sm text-slate-400">No tickets selected yet.</p>
      ) : (
        <ul className="flex flex-col gap-2 text-sm text-text/80">
          {lines.map((line) => (
            <li key={line.tier.id} className="flex items-center justify-between gap-2">
              <span>
                {line.tier.name} x{line.quantity}
              </span>
              <span>{format.format(line.tier.price * line.quantity)}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-col gap-1 border-t border-card-border pt-3 text-sm">
        <div className="flex items-center justify-between text-slate-500">
          <span>Subtotal</span>
          <span>{format.format(totals.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-500">
          <span>Service fee</span>
          <span>{format.format(totals.fees)}</span>
        </div>
        <div className="flex items-center justify-between pt-2 text-base font-bold text-text">
          <span>Total</span>
          <span>{format.format(totals.total)}</span>
        </div>
      </div>
    </aside>
  );
}
