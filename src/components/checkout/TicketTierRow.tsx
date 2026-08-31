import { Icon } from "@/components/ui/Icon";
import { availableQuantity } from "@/lib/pricing";
import type { TicketTier } from "@/lib/types";

const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });
const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 });

type TicketTierRowProps = {
  tier: TicketTier;
  quantity: number;
  onChange: (quantity: number) => void;
  saleEndsAt: string;
};

export function TicketTierRow({ tier, quantity, onChange, saleEndsAt }: TicketTierRowProps) {
  const remaining = availableQuantity(tier);
  const soldOut = remaining === 0;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-card-border py-5 last:border-0">
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold text-text">
          {tier.name} · {currencyFormatter(tier.currency).format(tier.price)}
        </p>
        <p className="text-sm text-slate-500">
          {soldOut ? "Sold out" : `Sales end on ${dateFormatter.format(new Date(saleEndsAt))}`}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Remove one ${tier.name} ticket`}
          disabled={quantity === 0}
          onClick={() => onChange(quantity - 1)}
          className="flex size-8 items-center justify-center rounded-md bg-lime-100 text-lime-500 disabled:opacity-40"
        >
          <Icon name="minus" className="size-4" />
        </button>
        <span className="w-6 text-center text-base font-semibold text-text" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          aria-label={`Add one ${tier.name} ticket`}
          disabled={soldOut || quantity >= remaining}
          onClick={() => onChange(quantity + 1)}
          className="flex size-8 items-center justify-center rounded-md bg-lime-500 text-white disabled:opacity-40"
        >
          <Icon name="plus" className="size-4" />
        </button>
      </div>
    </div>
  );
}
