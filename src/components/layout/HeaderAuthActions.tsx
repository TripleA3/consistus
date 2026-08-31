"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchNotifications } from "@/lib/api/notifications";

export function HeaderAuthActions() {
  const { user, status } = useAuth();
  const pathname = usePathname();
  const scope = pathname.startsWith("/talent") ? "talent" : "fan";
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    fetchNotifications(user.id, scope).then((notifications) => {
      setUnreadCount(notifications.filter((n) => !n.read).length);
    });
  }, [user, scope]);

  if (status === "loading") {
    return <div className="h-10 w-24" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        {pathname !== "/sign-in" ? (
          <ButtonLink href="/sign-in" variant="neutral" size="sm">
            Sign in
          </ButtonLink>
        ) : null}
        {pathname !== "/sign-up" ? (
          <ButtonLink href="/sign-up" variant="primary" size="sm">
            Sign up
          </ButtonLink>
        ) : null}
      </div>
    );
  }

  const notificationsHref = scope === "talent" ? "/talent/notifications" : "/notifications";

  return (
    <>
      <button
        type="button"
        aria-label="Messages"
        className="hidden size-10 items-center justify-center rounded-md border-[3px] border-[#f6f6f6] bg-[#ededed] text-ink sm:inline-flex"
      >
        <Icon name="mail" className="size-5" />
      </button>
      <Link
        href={notificationsHref}
        aria-label="Notifications"
        className="relative hidden size-10 items-center justify-center rounded-md border-[3px] border-[#f6f6f6] bg-[#ededed] text-ink sm:inline-flex"
      >
        <Icon name="bell" className="size-5" />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full border border-lime-100 bg-lime-200 text-[10px] font-black text-ink">
            {unreadCount}
          </span>
        ) : null}
      </Link>
      <Link
        href="/account"
        aria-label="Your account"
        className="flex size-10 items-center justify-center rounded-full bg-[#ededed] text-ink"
      >
        <Icon name="user" className="size-5" />
      </Link>
      <button
        type="button"
        aria-label="Settings"
        className="hidden size-10 items-center justify-center rounded-md border-[3px] border-[#f6f6f6] bg-[#ededed] text-ink sm:inline-flex"
      >
        <Icon name="settings" className="size-5" />
      </button>
    </>
  );
}
