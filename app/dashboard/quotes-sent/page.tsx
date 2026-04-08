"use client";

import { useState } from "react";
import { useB2B } from "@/lib/store";
import { QuoteSentCard } from "@/components/b2b/QuoteRow";
import { ChatDrawer } from "@/components/b2b/ChatDrawer";
import { Badge } from "@/components/ui/badge";
import { SendHorizonal } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Quote, QuoteStatus } from "@/lib/types";

const FILTER_TABS: { label: string; value: QuoteStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Submitted", value: "submitted" },
  { label: "Reviewed", value: "viewed" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
];

export default function QuotesSentPage() {
  const { quotes, currentUserId, openChat, threads, activeChatThreadId, closeChat } = useB2B();
  const [activeTab, setActiveTab] = useState<QuoteStatus | "all">("all");

  const myQuotes = quotes.filter((q) => q.supplierId === currentUserId);
  const filteredQuotes = activeTab === "all"
    ? myQuotes
    : myQuotes.filter((q) => q.status === activeTab);

  const activeThread = threads.find((t) => t.id === activeChatThreadId) ?? null;

  function handleOpenChat(quote: Quote) {
    openChat(quote.id, "quote");
  }

  const acceptedCount = myQuotes.filter((q) => q.status === "accepted").length;
  const shortlistedCount = myQuotes.filter((q) => q.status === "shortlisted").length;

  return (
    <div className="px-6 py-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <SendHorizonal className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Quotes Sent</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Track all your submitted quotes and their current status.
        </p>
      </div>

      {/* Summary cards */}
      {myQuotes.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border bg-card px-4 py-3 text-center">
            <p className="text-2xl font-bold text-foreground">{myQuotes.length}</p>
            <p className="text-xs text-muted-foreground">Total Submitted</p>
          </div>
          <div className="rounded-xl border bg-amber-50 border-amber-200 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-amber-700">{shortlistedCount}</p>
            <p className="text-xs text-amber-600">Shortlisted</p>
          </div>
          <div className="rounded-xl border bg-green-50 border-green-200 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-green-700">{acceptedCount}</p>
            <p className="text-xs text-green-600">Accepted</p>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        {FILTER_TABS.map((tab) => {
          const count = tab.value === "all"
            ? myQuotes.length
            : myQuotes.filter((q) => q.status === tab.value).length;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border",
                activeTab === tab.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:bg-muted"
              )}
            >
              {tab.label}
              {count > 0 && <span className="ml-1.5 opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      {myQuotes.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center space-y-2">
          <SendHorizonal className="h-10 w-10 text-muted-foreground/30 mx-auto" />
          <p className="text-muted-foreground text-sm font-medium">No quotes submitted yet</p>
          <p className="text-muted-foreground text-xs">
            Browse open requests and submit your first quote.
          </p>
          <Link href="/dashboard/requests" className="text-xs text-primary hover:underline">
            Browse requests →
          </Link>
        </div>
      ) : filteredQuotes.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="text-muted-foreground text-sm">No quotes in this status.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuotes.map((quote) => (
            <QuoteSentCard
              key={quote.id}
              quote={quote}
              onOpenChat={handleOpenChat}
            />
          ))}
        </div>
      )}

      <ChatDrawer thread={activeThread} onClose={closeChat} />
    </div>
  );
}
