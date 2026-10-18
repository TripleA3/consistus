import { Minus, Plus } from "@phosphor-icons/react/dist/ssr";
import { StatusPill } from "@/components/kit";
import { availableQuantity } from "@/lib/pricing";
import { dayLabel, money } from "@/lib/format";
import type { TicketTier } from "@/lib/types";

type TicketTierRowProps = {
  tier: TicketTier;
  quantity: number;
  onChange: (quantity: number) => void;
  saleEndsAt: string;
};

export function TicketTierRow({ tier, quantity, onChange, saleEndsAt }: TicketTierRowProps) {
  const remaining = availableQuantity(tier);
  const soldOut = remaining === 0;
  const atLimit = soldOut || quantity >= remaining;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-4 last:border-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-title-md">{tier.name}</p>
        <p className="text-title-lg text-link">{money(tier.price)}</p>

        {soldOut ? (
          <StatusPill tone="danger" className="mt-1">
            Sold out
          </StatusPill>
        ) : (
          <p className="mt-0.5 text-body-md text-muted-foreground">
            Sales end {dayLabel(saleEndsAt)} · {remaining} left
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-label={`Remove one ${tier.name} ticket`}
          disabled={quantity === 0}
          onClick={() => onChange(quantity - 1)}
          className="flex size-9 items-center justify-center rounded-pill border border-border text-foreground disabled:pointer-events-none"
        >
          <Minus size={16} weight="bold" />
        </button>

        <span className="w-7 text-center text-title-md tabular-nums" aria-live="polite">
          {quantity}
        </span>

        <button
          type="button"
          aria-label={`Add one ${tier.name} ticket`}
          disabled={atLimit}
          onClick={() => onChange(quantity + 1)}
          className="flex size-9 items-center justify-center rounded-pill bg-cta text-cta-foreground disabled:pointer-events-none"
        >
          <Plus size={16} weight="bold" />
        </button>
      </div>
    </div>
  );
}
