"use client";

import { useState } from "react";
import { SupplierCard } from "@/components/b2b/SupplierCard";
import { CategoryChips, CATEGORY_ALL_VALUE } from "@/components/b2b/CategoryChips";
import { ChatDrawer } from "@/components/b2b/ChatDrawer";
import { useB2B } from "@/lib/store";
import { Search, Store } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SuppliersPage() {
  const {
    listings,
    inquiries,
    sendInquiry,
    openChat,
    threads,
    currentUserId,
    activeChatThreadId,
    closeChat,
  } = useB2B();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(CATEGORY_ALL_VALUE);

  const inquiredListingIds = new Set(
    inquiries.filter((i) => i.requesterId === currentUserId).map((i) => i.listingId)
  );

  const filtered = listings.filter((l) => {
    if (!l.isActive) return false;
    if (category !== CATEGORY_ALL_VALUE && l.category !== category) return false;
    if (
      search &&
      !l.title.toLowerCase().includes(search.toLowerCase()) &&
      !l.description.toLowerCase().includes(search.toLowerCase()) &&
      !l.category.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const activeThread = threads.find((t) => t.id === activeChatThreadId) ?? null;

  function handleSendInquiry(listingId: string) {
    sendInquiry(listingId);
    openChat(listingId, "inquiry");
  }

  return (
    <div className="px-6 py-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Browse Listings</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Discover suppliers and send an inquiry to start a conversation directly.
        </p>
      </div>

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search listings…"
            className={cn(
              "w-full rounded-xl border border-input bg-background pl-9 pr-4 py-2.5 text-sm",
              "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            )}
          />
        </div>
        <CategoryChips activeCategory={category} onCategoryChange={setCategory} />
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        {filtered.length} listing{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <p className="text-muted-foreground text-sm">No listings match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((listing, idx) => {
            const hasInquiry = inquiredListingIds.has(listing.id);
            const isOwner = listing.ownerId === currentUserId;
            return (
              <SupplierCard
                key={listing.id}
                listing={listing}
                index={idx}
                isOwner={isOwner}
                hasInquiry={hasInquiry}
                onSendInquiry={() => handleSendInquiry(listing.id)}
              />
            );
          })}
        </div>
      )}

      <ChatDrawer thread={activeThread} onClose={closeChat} />
    </div>
  );
}
