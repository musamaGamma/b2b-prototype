"use client";

import { useState } from "react";
import { RequestCard } from "@/components/b2b/RequestCard";
import { CategoryChips, CATEGORY_ALL_VALUE } from "@/components/b2b/CategoryChips";
import { SubmitQuoteDrawer } from "@/components/b2b/SubmitQuoteDrawer";
import { useB2B } from "@/lib/store";
import { Search, PlusCircle, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProjectRequest } from "@/lib/types";

export default function RequestsPage() {
  const { requests, quotes, currentUserId } = useB2B();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(CATEGORY_ALL_VALUE);
  const [quotingRequest, setQuotingRequest] = useState<ProjectRequest | null>(null);

  const myQuotedRequestIds = new Set(
    quotes.filter((q) => q.supplierId === currentUserId).map((q) => q.requestId)
  );

  const filtered = requests.filter((r) => {
    if (r.status === "closed") return false;
    if (category !== CATEGORY_ALL_VALUE && r.category !== category) return false;
    if (
      search &&
      !r.title.toLowerCase().includes(search.toLowerCase()) &&
      !r.description.toLowerCase().includes(search.toLowerCase()) &&
      !r.category.toLowerCase().includes(search.toLowerCase()) &&
      !r.location.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="px-6 py-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground">Browse Requests</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Project owners are looking for suppliers. Submit a competitive quote to win the work.
          </p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shrink-0">
          <PlusCircle className="h-4 w-4" />
          Post Request
        </Button>
      </div>

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, category, or location…"
            className={cn(
              "w-full rounded-xl border border-input bg-background pl-9 pr-4 py-2.5 text-sm",
              "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            )}
          />
        </div>
        <CategoryChips activeCategory={category} onCategoryChange={setCategory} />
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} open request{filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <p className="text-muted-foreground text-sm">No requests match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((request, idx) => (
            <RequestCard
              key={request.id}
              request={request}
              index={idx}
              isOwner={request.ownerId === currentUserId}
              hasSubmittedQuote={myQuotedRequestIds.has(request.id)}
              onSubmitQuote={() => setQuotingRequest(request)}
            />
          ))}
        </div>
      )}

      {quotingRequest && (
        <SubmitQuoteDrawer
          open={!!quotingRequest}
          onClose={() => setQuotingRequest(null)}
          demand={quotingRequest}
        />
      )}
    </div>
  );
}
