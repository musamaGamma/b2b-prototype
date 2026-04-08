"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle2, XCircle, Star, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useB2B } from "@/lib/store";
import { getUserById } from "@/lib/mockData";
import type { Quote, QuoteStatus } from "@/lib/types";

const STATUS_CONFIG: Record<QuoteStatus, { label: string; className: string }> = {
  submitted: {
    label: "New",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  viewed: {
    label: "Reviewed",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  accepted: {
    label: "Accepted",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-600 border-red-200",
  },
};

interface QuoteRowProps {
  quote: Quote;
  onOpenChat: (quote: Quote) => void;
}

export function QuoteRow({ quote, onOpenChat }: QuoteRowProps) {
  const { updateQuoteStatus, markQuoteViewed, acceptQuote } = useB2B();
  const supplier = getUserById(quote.supplierId);
  const statusCfg = STATUS_CONFIG[quote.status];

  const isTerminal = quote.status === "accepted" || quote.status === "rejected";

  function handleView() {
    markQuoteViewed(quote.id);
  }

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4 space-y-3 transition-colors",
        quote.status === "submitted" && "border-blue-200 bg-blue-50/30",
        quote.status === "shortlisted" && "border-amber-200 bg-amber-50/20",
        quote.status === "accepted" && "border-green-200 bg-green-50/20",
        quote.status === "rejected" && "opacity-60"
      )}
      onClick={handleView}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">
            {supplier?.name ?? "Unknown Supplier"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {supplier?.company}
            {supplier?.verified && (
              <span className="ml-1 text-green-600 font-medium">· Verified</span>
            )}
          </p>
        </div>
        <Badge
          variant="outline"
          className={cn("rounded-full text-xs px-2 shrink-0 border", statusCfg.className)}
        >
          {statusCfg.label}
        </Badge>
      </div>

      {/* Quote details */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-background border px-3 py-2">
          <p className="text-xs text-muted-foreground">Quoted Price</p>
          <p className="text-sm font-bold text-foreground">{quote.price}</p>
        </div>
        <div className="rounded-lg bg-background border px-3 py-2">
          <p className="text-xs text-muted-foreground">Timeline</p>
          <p className="text-sm font-semibold text-foreground">{quote.timeline}</p>
        </div>
      </div>

      {/* Message */}
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
        {quote.message}
      </p>

      <p className="text-xs text-muted-foreground">Submitted {quote.submittedAt}</p>

      {/* Actions */}
      {!isTerminal && (
        <div className="flex flex-wrap gap-2 pt-1 border-t border-border/50">
          {quote.status === "submitted" && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs rounded-lg"
              onClick={(e) => { e.stopPropagation(); updateQuoteStatus(quote.id, "shortlisted"); }}
            >
              <Star className="h-3.5 w-3.5 text-amber-500" />
              Shortlist
            </Button>
          )}
          {(quote.status === "submitted" || quote.status === "viewed" || quote.status === "shortlisted") && (
            <>
              <Button
                size="sm"
                className="gap-1.5 text-xs rounded-lg bg-green-600 hover:bg-green-700 text-white"
                onClick={(e) => { e.stopPropagation(); acceptQuote(quote.id); }}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs rounded-lg text-red-600 border-red-200 hover:bg-red-50"
                onClick={(e) => { e.stopPropagation(); updateQuoteStatus(quote.id, "rejected"); }}
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs rounded-lg ml-auto"
            onClick={(e) => { e.stopPropagation(); onOpenChat(quote); }}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Chat
          </Button>
        </div>
      )}

      {quote.status === "accepted" && (
        <div className="flex gap-2 pt-1 border-t border-green-200">
          <Button
            size="sm"
            className="gap-1.5 text-xs rounded-lg bg-primary hover:bg-primary/90 text-white"
            onClick={(e) => { e.stopPropagation(); onOpenChat(quote); }}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Open Chat
          </Button>
          <Badge className="flex items-center gap-1 bg-green-600 text-white text-xs rounded-lg px-2">
            <CheckCircle2 className="h-3 w-3" />
            Quote Accepted
          </Badge>
        </div>
      )}
    </div>
  );
}

// QuoteSentCard — for the supplier's "quotes sent" view
interface QuoteSentCardProps {
  quote: Quote;
  onOpenChat?: (quote: Quote) => void;
}

export function QuoteSentCard({ quote, onOpenChat }: QuoteSentCardProps) {
  const { requests } = useB2B();
  const demand = requests.find((r) => r.id === quote.requestId);
  const statusCfg = STATUS_CONFIG[quote.status];

  const statusSteps: QuoteStatus[] = ["submitted", "viewed", "shortlisted", "accepted"];

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      {/* Demand title */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">For demand</p>
          <p className="font-semibold text-sm text-foreground line-clamp-1">
            {demand?.title ?? "Unknown Demand"}
          </p>
          {demand && (
            <p className="text-xs text-muted-foreground">
              {demand.category} · {demand.location}
            </p>
          )}
        </div>
        <Badge
          variant="outline"
          className={cn("rounded-full text-xs px-2 shrink-0 border", statusCfg.className)}
        >
          {statusCfg.label}
        </Badge>
      </div>

      {/* Your quote details */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-secondary/50 px-3 py-2">
          <p className="text-xs text-muted-foreground">Your Price</p>
          <p className="text-sm font-bold">{quote.price}</p>
        </div>
        <div className="rounded-lg bg-secondary/50 px-3 py-2">
          <p className="text-xs text-muted-foreground">Timeline</p>
          <p className="text-sm font-semibold">{quote.timeline}</p>
        </div>
      </div>

      {/* Status pipeline */}
      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground font-medium">Status Pipeline</p>
        <div className="flex items-center gap-1">
          {statusSteps.map((step, idx) => {
            const stepIdx = statusSteps.indexOf(quote.status);
            const isActive = step === quote.status;
            const isPast = idx < stepIdx;
            const isRejected = quote.status === "rejected";

            return (
              <div key={step} className="flex items-center gap-1 flex-1">
                <div
                  className={cn(
                    "flex-1 h-1.5 rounded-full transition-colors",
                    isRejected
                      ? "bg-red-200"
                      : isPast || isActive
                      ? "bg-primary"
                      : "bg-muted"
                  )}
                />
                {idx === statusSteps.length - 1 && (
                  <span
                    className={cn(
                      "text-xs font-medium px-1 shrink-0",
                      isActive ? "text-green-700" : "text-muted-foreground"
                    )}
                  >
                    {isRejected ? "Rejected" : isActive ? "Accepted" : "Accepted"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Submitted</span>
          <span>Viewed</span>
          <span>Shortlisted</span>
          <span className={quote.status === "accepted" ? "text-green-700 font-medium" : ""}>
            {quote.status === "rejected" ? "Rejected" : "Accepted"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-border/50">
        <p className="text-xs text-muted-foreground flex-1">
          Submitted {quote.submittedAt}
        </p>
        {quote.status === "accepted" && onOpenChat && (
          <Button
            size="sm"
            className="gap-1.5 text-xs rounded-lg"
            onClick={() => onOpenChat(quote)}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Open Chat
          </Button>
        )}
        {(quote.status === "submitted" || quote.status === "viewed" || quote.status === "shortlisted") && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs rounded-lg"
            onClick={() => onOpenChat?.(quote)}
          >
            <Eye className="h-3.5 w-3.5" />
            View Demand
          </Button>
        )}
      </div>
    </div>
  );
}
