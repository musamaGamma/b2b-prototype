"use client";

import { use, useState } from "react";
import { useB2B } from "@/lib/store";
import { getUserById } from "@/lib/mockData";
import { getCategoryPalette } from "@/lib/categoryPalette";
import { SubmitQuoteDrawer } from "@/components/b2b/SubmitQuoteDrawer";
import { QuoteRow } from "@/components/b2b/QuoteRow";
import { ChatDrawer } from "@/components/b2b/ChatDrawer";
import { REQUEST_STATUS_CONFIG } from "@/components/b2b/RequestCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  MapPin,
  Package,
  DollarSign,
  ArrowLeft,
  SendHorizonal,
  Tag,
  Users,
  BadgeCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Quote, QuoteStatus } from "@/lib/types";

const QUOTE_FILTER_TABS: { label: string; value: QuoteStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "submitted" },
  { label: "Reviewed", value: "viewed" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
];

export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    requests,
    quotes,
    currentUserId,
    openChat,
    threads,
    activeChatThreadId,
    closeChat,
    closeRequest,
  } = useB2B();
  const [showQuoteDrawer, setShowQuoteDrawer] = useState(false);
  const [quoteFilter, setQuoteFilter] = useState<QuoteStatus | "all">("all");

  const request = requests.find((r) => r.id === id);
  if (!request) {
    return (
      <div className="px-6 py-6 max-w-4xl mx-auto">
        <Link
          href="/dashboard/requests"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to requests
        </Link>
        <p className="text-muted-foreground">Request not found.</p>
      </div>
    );
  }

  const isOwner = request.ownerId === currentUserId;
  const owner = getUserById(request.ownerId);
  const palette = getCategoryPalette(request.category);
  const statusCfg = REQUEST_STATUS_CONFIG[request.status];

  const myQuote = quotes.find(
    (q) => q.requestId === id && q.supplierId === currentUserId
  );
  const canQuote =
    !isOwner &&
    !myQuote &&
    (request.status === "open" || request.status === "receiving_quotes");

  const requestQuotes = quotes.filter((q) => q.requestId === id);
  const filteredQuotes =
    quoteFilter === "all"
      ? requestQuotes
      : requestQuotes.filter((q) => q.status === quoteFilter);

  const quoteCounts = QUOTE_FILTER_TABS.reduce(
    (acc, tab) => {
      acc[tab.value] =
        tab.value === "all"
          ? requestQuotes.length
          : requestQuotes.filter((q) => q.status === tab.value).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const activeThread = threads.find((t) => t.id === activeChatThreadId) ?? null;

  function handleOpenChat(quote: Quote) {
    openChat(quote.id, "quote");
  }

  const acceptedQuote = requestQuotes.find((q) => q.status === "accepted");

  return (
    <div className="px-6 py-6 max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/dashboard/requests"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to requests
      </Link>

      {/* Request detail card */}
      <div className={cn("rounded-2xl border-2 overflow-hidden", palette.cardBorder)}>
        <div className={cn("h-2", palette.topBar)} />
        <div className="p-6 space-y-5">
          {/* Title + status + actions */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2 min-w-0">
              <div className="flex flex-wrap gap-2">
                <Badge className={cn("rounded-full px-3 py-1 text-xs font-semibold", palette.badge)}>
                  {request.category}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn("rounded-full text-xs px-2 py-0.5 border", statusCfg.className)}
                >
                  {statusCfg.label}
                </Badge>
              </div>
              <h1 className="text-xl font-bold text-foreground">{request.title}</h1>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              {canQuote && (
                <Button
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setShowQuoteDrawer(true)}
                >
                  <SendHorizonal className="h-4 w-4" />
                  Submit Quote
                </Button>
              )}
              {myQuote && !isOwner && (
                <Badge className="rounded-lg px-3 py-2 bg-green-50 text-green-700 border border-green-200 text-sm gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Quote Submitted · {myQuote.status}
                </Badge>
              )}
              {/* Owner can mark completed when in_progress */}
              {isOwner && request.status === "in_progress" && (
                <Button
                  variant="outline"
                  className="gap-2 border-green-300 text-green-700 hover:bg-green-50"
                  onClick={() => closeRequest(request.id)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark as Completed
                </Button>
              )}
              {isOwner && request.status === "closed" && (
                <Badge className="rounded-lg px-3 py-2 bg-slate-100 text-slate-500 border text-sm gap-1">
                  <XCircle className="h-3.5 w-3.5" />
                  Closed
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">{request.description}</p>

          {/* Key metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border bg-secondary/30 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Package className={cn("h-3.5 w-3.5", palette.metricIcon)} />
                Quantity Needed
              </div>
              <p className="text-sm font-semibold">{request.quantityNeeded}</p>
            </div>
            {request.budget && (
              <div className="rounded-xl border bg-secondary/30 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <DollarSign className={cn("h-3.5 w-3.5", palette.metricIcon)} />
                  Budget
                </div>
                <p className="text-sm font-semibold text-foreground">{request.budget}</p>
              </div>
            )}
            <div className="rounded-xl border bg-secondary/30 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5 text-rose-500" />
                Deadline
              </div>
              <p className="text-sm font-semibold">{request.deadline}</p>
            </div>
            <div className="rounded-xl border bg-secondary/30 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                Location
              </div>
              <p className="text-sm font-semibold">{request.location}</p>
            </div>
          </div>

          {/* Tags */}
          {request.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <Tag className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              {request.tags.map((tag) => (
                <span
                  key={tag}
                  className={cn("rounded-md px-2 py-0.5 text-xs border", palette.tagChip)}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Accepted supplier highlight */}
          {acceptedQuote && isOwner && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800">Quote accepted</p>
                <p className="text-xs text-green-600">
                  Working with {getUserById(acceptedQuote.supplierId)?.company} ·{" "}
                  {acceptedQuote.price} · {acceptedQuote.timeline}
                </p>
              </div>
              <Button
                size="sm"
                className="ml-auto gap-1.5 text-xs"
                onClick={() => handleOpenChat(acceptedQuote)}
              >
                Open Chat
              </Button>
            </div>
          )}

          {/* Poster info */}
          {owner && (
            <div className="flex items-center gap-2 pt-2 border-t border-border/60">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">{owner.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">
                  {owner.name}
                  {owner.verified && (
                    <BadgeCheck className="inline h-3 w-3 ml-1 text-green-500" />
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{owner.company}</p>
              </div>
              <p className="text-xs text-muted-foreground ml-auto">
                Posted {request.createdAt}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quotes section — owner only */}
      {isOwner && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Quotes Received</h2>
              <Badge className="rounded-full bg-blue-600 text-white text-xs px-2">
                {requestQuotes.length}
              </Badge>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-1.5">
            {QUOTE_FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setQuoteFilter(tab.value)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border",
                  quoteFilter === tab.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:bg-muted"
                )}
              >
                {tab.label}
                {quoteCounts[tab.value] > 0 && (
                  <span className="ml-1.5 opacity-70">({quoteCounts[tab.value]})</span>
                )}
              </button>
            ))}
          </div>

          {filteredQuotes.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <p className="text-muted-foreground text-sm">
                {requestQuotes.length === 0
                  ? "No quotes received yet. Share your request to attract suppliers."
                  : "No quotes in this status."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuotes.map((quote) => (
                <QuoteRow key={quote.id} quote={quote} onOpenChat={handleOpenChat} />
              ))}
            </div>
          )}
        </div>
      )}

      {showQuoteDrawer && (
        <SubmitQuoteDrawer
          open={showQuoteDrawer}
          onClose={() => setShowQuoteDrawer(false)}
          demand={request}
        />
      )}

      <ChatDrawer thread={activeThread} onClose={closeChat} />
    </div>
  );
}
