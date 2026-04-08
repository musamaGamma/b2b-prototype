"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  ClipboardList,
  Store,
  Bell,
} from "lucide-react";
import { useB2B } from "@/lib/store";

export function DashboardHeader() {
  const { quotes, threads, currentUserId, requests } = useB2B();

  const myRequestIds = requests
    .filter((r) => r.ownerId === currentUserId)
    .map((r) => r.id);
  const newQuotesCount = quotes.filter(
    (q) => myRequestIds.includes(q.requestId) && q.status === "submitted"
  ).length;
  const unreadCount = threads.reduce((acc, t) => acc + t.unreadCount, 0);
  const totalNotifications = newQuotesCount + unreadCount;

  return (
    <header className="h-14 shrink-0 border-b border-border bg-background/95 backdrop-blur-sm flex items-center px-6 gap-4">
      {/* Primary CTAs */}
      <div className="flex items-center gap-2">
        <Link href="/dashboard/requests">
          <Button
            size="sm"
            className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            <PlusCircle className="h-4 w-4" />
            Post Request
          </Button>
        </Link>
        <Link href="/dashboard/my-listings">
          <Button size="sm" variant="outline" className="gap-1.5">
            <PlusCircle className="h-4 w-4" />
            Create Listing
          </Button>
        </Link>
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-border mx-1" />

      {/* Browse quick links */}
      <div className="flex items-center gap-1">
        <Link href="/dashboard/requests">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground text-xs"
          >
            <ClipboardList className="h-3.5 w-3.5" />
            Browse Requests
          </Button>
        </Link>
        <Link href="/dashboard/suppliers">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground text-xs"
          >
            <Store className="h-3.5 w-3.5" />
            Browse Suppliers
          </Button>
        </Link>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Notification bell */}
      <Link href="/dashboard/quotes-received">
        <Button variant="ghost" size="sm" className="relative gap-1.5 text-muted-foreground">
          <Bell className="h-4 w-4" />
          {totalNotifications > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full px-1 text-xs bg-blue-600 text-white border-0">
              {totalNotifications}
            </Badge>
          )}
        </Button>
      </Link>

      {/* Flow hint */}
      <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-1.5">
        <span className="text-blue-600 font-medium">Request → Quote → Accept → Chat</span>
        <span className="opacity-50">is the primary flow</span>
      </div>
    </header>
  );
}
