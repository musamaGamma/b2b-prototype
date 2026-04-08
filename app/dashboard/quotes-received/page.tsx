"use client";

import { useState } from "react";
import { useB2B } from "@/lib/store";
import { QuoteRow } from "@/components/b2b/QuoteRow";
import { ChatDrawer } from "@/components/b2b/ChatDrawer";
import { Badge } from "@/components/ui/badge";
import { Inbox, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Quote, QuoteStatus } from "@/lib/types";

const FILTER_TABS: { label: string; value: QuoteStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "submitted" },
  { label: "Reviewed", value: "viewed" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
];

export default function QuotesReceivedPage() {
  const { requests, quotes, currentUserId, openChat, threads, activeChatThreadId, closeChat } =
    useB2B();
  const [activeTab, setActiveTab] = useState<QuoteStatus | "all">("all");
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  const myRequests = requests.filter((r) => r.ownerId === currentUserId);

  const activeThread = threads.find((t) => t.id === activeChatThreadId) ?? null;

  function handleOpenChat(quote: Quote) {
    openChat(quote.id, "quote");
  }

  const totalNewQuotes = quotes.filter(
    (q) => myRequests.some((r) => r.id === q.requestId) && q.status === "submitted"
  ).length;

  return (
    <div className="px-6 py-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Inbox className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Quotes Received</h1>
          {totalNewQuotes > 0 && (
            <Badge className="rounded-full bg-blue-600 text-white text-xs px-2">
              {totalNewQuotes} new
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Review quotes from suppliers for your requests. Accept to move to negotiation chat.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        {FILTER_TABS.map((tab) => {
          const count =
            tab.value === "all"
              ? quotes.filter((q) => myRequests.some((r) => r.id === q.requestId)).length
              : quotes.filter(
                  (q) =>
                    myRequests.some((r) => r.id === q.requestId) && q.status === tab.value
                ).length;

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

      {myRequests.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center space-y-2">
          <Inbox className="h-10 w-10 text-muted-foreground/30 mx-auto" />
          <p className="text-muted-foreground text-sm font-medium">No requests posted yet</p>
          <p className="text-muted-foreground text-xs">
            Post a request to start receiving quotes from suppliers.
          </p>
          <Link href="/dashboard/my-requests" className="text-xs text-primary hover:underline">
            Post your first request →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myRequests.map((request) => {
            const requestQuotes = quotes.filter((q) => q.requestId === request.id);
            const filteredQuotes =
              activeTab === "all"
                ? requestQuotes
                : requestQuotes.filter((q) => q.status === activeTab);
            const newCount = requestQuotes.filter((q) => q.status === "submitted").length;
            const isExpanded =
              expandedRequestId === request.id || expandedRequestId === null;

            if (filteredQuotes.length === 0 && activeTab !== "all") return null;

            return (
              <div key={request.id} className="rounded-xl border bg-card overflow-hidden">
                {/* Request header */}
                <button
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/30 transition-colors"
                  onClick={() =>
                    setExpandedRequestId(
                      expandedRequestId === request.id ? null : request.id
                    )
                  }
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {request.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {request.category} · {request.location} · Due {request.deadline}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {newCount > 0 && (
                      <Badge className="rounded-full bg-blue-600 text-white text-xs px-1.5 py-0">
                        {newCount} new
                      </Badge>
                    )}
                    <Badge variant="outline" className="rounded-full text-xs px-1.5">
                      {requestQuotes.length} quotes
                    </Badge>
                  </div>
                </button>

                {/* Quotes list */}
                {isExpanded && (
                  <div className="px-5 pb-5 space-y-3 border-t border-border/50 pt-4">
                    {filteredQuotes.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-3 text-center">
                        No quotes in this status.
                      </p>
                    ) : (
                      filteredQuotes.map((quote) => (
                        <QuoteRow key={quote.id} quote={quote} onOpenChat={handleOpenChat} />
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ChatDrawer thread={activeThread} onClose={closeChat} />
    </div>
  );
}
