"use client";

import { RequestCard } from "@/components/b2b/RequestCard";
import { useB2B } from "@/lib/store";
import { FileText, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MyRequestsPage() {
  const { requests, quotes, currentUserId } = useB2B();

  const myRequests = requests.filter((r) => r.ownerId === currentUserId);
  const openCount = myRequests.filter(
    (r) => r.status === "open" || r.status === "receiving_quotes"
  ).length;

  return (
    <div className="px-6 py-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground">My Requests</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {openCount} open · {myRequests.length} total
          </p>
        </div>
        <Button className="gap-2 shrink-0 bg-blue-600 hover:bg-blue-700 text-white">
          <PlusCircle className="h-4 w-4" />
          Post Request
        </Button>
      </div>

      {myRequests.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center space-y-2">
          <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto" />
          <p className="text-muted-foreground text-sm font-medium">No requests posted</p>
          <p className="text-muted-foreground text-xs">
            Post a request to receive quotes from suppliers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {myRequests.map((request, idx) => {
            const requestQuotes = quotes.filter((q) => q.requestId === request.id);
            const newQuoteCount = requestQuotes.filter((q) => q.status === "submitted").length;
            return (
              <div key={request.id} className="relative">
                {newQuoteCount > 0 && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <Badge className="rounded-full bg-blue-600 text-white text-xs px-2 shadow-md">
                      {newQuoteCount} new
                    </Badge>
                  </div>
                )}
                <RequestCard
                  request={request}
                  index={idx}
                  isOwner
                  quoteCount={requestQuotes.length}
                  newQuoteCount={newQuoteCount}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
