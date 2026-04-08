"use client";

import { SupplierCard } from "@/components/b2b/SupplierCard";
import { useB2B } from "@/lib/store";
import { Package, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MyListingsPage() {
  const { listings, currentUserId, toggleListingActive, deleteListing } = useB2B();

  const myListings = listings.filter((l) => l.ownerId === currentUserId);
  const activeCount = myListings.filter((l) => l.isActive).length;

  return (
    <div className="px-6 py-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground">My Listings</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {activeCount} active · {myListings.length - activeCount} disabled
          </p>
        </div>
        <Button className="gap-2 shrink-0">
          <PlusCircle className="h-4 w-4" />
          Create Listing
        </Button>
      </div>

      {myListings.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center space-y-2">
          <Package className="h-10 w-10 text-muted-foreground/30 mx-auto" />
          <p className="text-muted-foreground text-sm font-medium">No listings yet</p>
          <p className="text-muted-foreground text-xs">Create your first supplier listing to attract project owners.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {myListings.map((listing, idx) => (
            <div key={listing.id} className="relative">
              {!listing.isActive && (
                <div className="absolute inset-0 z-10 rounded-2xl bg-background/50 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                  <Badge className="bg-slate-700 text-white text-xs rounded-full px-3">
                    Disabled
                  </Badge>
                </div>
              )}
              <SupplierCard
                listing={listing}
                index={idx}
                isOwner
                onEdit={() => {}}
                onToggleActive={() => toggleListingActive(listing.id)}
                onDelete={() => deleteListing(listing.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
