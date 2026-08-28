import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Icon } from "@/components/ui/Icon";
import type { User } from "@/lib/types";

type VideoRequestCardProps = {
  talent: User;
  label?: string;
};

export function VideoRequestCard({ talent, label = "Promote a business" }: VideoRequestCardProps) {
  return (
    <Link
      href={`/talent/${talent.id}/request/video`}
      className="block w-full max-w-[289px] shrink-0"
    >
      <Card className="relative h-[226px]">
        <ImagePlaceholder id={`${talent.id}-video`} label={talent.name} className="h-full w-full" />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 bg-gradient-to-r from-black to-[#666] py-2.5">
          <Icon name="video" className="size-4 text-background" />
          <span className="text-sm font-semibold text-background">{label}</span>
        </div>
      </Card>
    </Link>
  );
}
