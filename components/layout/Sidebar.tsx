"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Store,
  ClipboardList,
  Package,
  FileText,
  SendHorizonal,
  Inbox,
  MessageSquare,
  Zap,
  BadgeCheck,
  BarChart3,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useB2B } from "@/lib/store";
import { getUserById } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

/** PRIMARY: Request-based flow (structured, high-value) */
const REQUEST_ITEMS: NavItem[] = [
  { label: "Browse Requests", href: "/dashboard/requests", icon: ClipboardList },
  { label: "My Requests", href: "/dashboard/my-requests", icon: FileText },
  { label: "Quotes Received", href: "/dashboard/quotes-received", icon: Inbox },
  { label: "Quotes Sent", href: "/dashboard/quotes-sent", icon: SendHorizonal },
];

/** SECONDARY: Listing-based flow (discovery / inquiry) */
const LISTING_ITEMS: NavItem[] = [
  { label: "Browse Suppliers", href: "/dashboard/suppliers", icon: Store },
  { label: "My Listings", href: "/dashboard/my-listings", icon: Package },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
];

function NavSection({
  title,
  items,
  currentPath,
  badges,
  accent,
}: {
  title: string;
  items: NavItem[];
  currentPath: string;
  badges: Record<string, number>;
  accent?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p
        className={cn(
          "px-3 text-xs font-semibold uppercase tracking-wider mb-2",
          accent
            ? "text-sidebar-foreground/60"
            : "text-sidebar-foreground/35"
        )}
      >
        {title}
      </p>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          currentPath === item.href || currentPath.startsWith(item.href + "/");
        const badgeCount = badges[item.href] ?? 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 truncate">{item.label}</span>
            {badgeCount > 0 && (
              <Badge className="h-5 min-w-5 rounded-full px-1.5 text-xs bg-primary text-primary-foreground">
                {badgeCount}
              </Badge>
            )}
          </Link>
        );
      })}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { quotes, threads, currentUserId, requests } = useB2B();
  const currentUser = getUserById(currentUserId);

  const myRequestIds = requests
    .filter((r) => r.ownerId === currentUserId)
    .map((r) => r.id);
  const newQuotesCount = quotes.filter(
    (q) => myRequestIds.includes(q.requestId) && q.status === "submitted"
  ).length;

  const unreadMessagesCount = threads.reduce((acc, t) => acc + t.unreadCount, 0);

  const badges: Record<string, number> = {
    "/dashboard/quotes-received": newQuotesCount,
    "/dashboard/messages": unreadMessagesCount,
  };

  return (
    <aside className="w-64 shrink-0 flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Brand header */}
      <div className="px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-larajobs-purple/20 flex items-center justify-center">
            <Zap className="h-4 w-4 text-larajobs-purple" />
          </div>
          <div>
            <p className="text-sm font-bold text-sidebar-foreground">Lara B2B</p>
            <p className="text-xs text-sidebar-foreground/40">Marketplace</p>
          </div>
        </div>
      </div>

      {/* Quick action buttons */}
      <div className="px-3 py-3 border-b border-sidebar-border space-y-1.5">
        <Link href="/dashboard/requests" className="block">
          <Button
            size="sm"
            className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white justify-start"
          >
            <PlusCircle className="h-4 w-4 shrink-0" />
            Post a Request
          </Button>
        </Link>
        <Link href="/dashboard/my-listings" className="block">
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-2 justify-start text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent"
          >
            <PlusCircle className="h-4 w-4 shrink-0" />
            Create Listing
          </Button>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        <NavSection
          title="Requests & Quotes"
          items={REQUEST_ITEMS}
          currentPath={pathname}
          badges={badges}
          accent
        />
        <NavSection
          title="Listings & Inquiries"
          items={LISTING_ITEMS}
          currentPath={pathname}
          badges={badges}
        />
      </nav>

      {/* Plan card */}
      {currentUser && (
        <div className="mx-3 mb-3 rounded-xl border border-sidebar-border bg-sidebar-accent/30 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-larajobs-purple" />
              <span className="text-xs font-semibold text-sidebar-foreground capitalize">
                {currentUser.plan} Plan
              </span>
            </div>
            {currentUser.verified && (
              <Badge className="text-xs rounded-full px-1.5 py-0 bg-green-500/15 text-green-400 border-0">
                Verified
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="rounded-lg bg-sidebar-accent/50 px-2 py-1.5 text-center">
              <p className="text-xs font-bold text-sidebar-foreground">
                {currentUser.remainingAds}
              </p>
              <p className="text-xs text-sidebar-foreground/40">Ads left</p>
            </div>
            <div className="rounded-lg bg-sidebar-accent/50 px-2 py-1.5 text-center">
              <p className="text-xs font-bold text-sidebar-foreground">
                {currentUser.remainingRequests}
              </p>
              <p className="text-xs text-sidebar-foreground/40">Quotes left</p>
            </div>
          </div>
          <Link
            href="#"
            className="flex items-center justify-center gap-1 text-xs text-larajobs-purple hover:underline"
          >
            <BarChart3 className="h-3 w-3" />
            Upgrade Plan
          </Link>
        </div>
      )}

      {/* User footer */}
      {currentUser && (
        <div className="px-4 py-3 border-t border-sidebar-border flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-larajobs-purple/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-larajobs-purple">
              {currentUser.name.charAt(0)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-sidebar-foreground truncate">
              {currentUser.name}
            </p>
            <p className="text-xs text-sidebar-foreground/40 truncate">
              {currentUser.company}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
