"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  MapPin,
  Package,
  DollarSign,
  SendHorizonal,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryPalette } from "@/lib/categoryPalette";
import type { ProjectRequest, RequestStatus } from "@/lib/types";
import Link from "next/link";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export const REQUEST_STATUS_CONFIG: Record<RequestStatus, { label: string; className: string }> = {
  open: {
    label: "Open for Quotes",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  receiving_quotes: {
    label: "Receiving Quotes",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  closed: {
    label: "Closed",
    className: "bg-slate-100 text-slate-500 border-slate-200",
  },
};

interface RequestCardProps {
  request: ProjectRequest;
  index?: number;
  isOwner?: boolean;
  hasSubmittedQuote?: boolean;
  quoteCount?: number;
  newQuoteCount?: number;
  onSubmitQuote?: () => void;
}

export function RequestCard({
  request,
  index = 0,
  isOwner = false,
  hasSubmittedQuote = false,
  quoteCount = 0,
  newQuoteCount = 0,
  onSubmitQuote,
}: RequestCardProps) {
  const palette = getCategoryPalette(request.category);
  const statusCfg = REQUEST_STATUS_CONFIG[request.status];
  const canQuote =
    !isOwner &&
    !hasSubmittedQuote &&
    (request.status === "open" || request.status === "receiving_quotes");

  return (
    <motion.div
      className="h-full"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <Card
        className={cn(
          "border-2 rounded-2xl overflow-hidden hover:scale-[1.02] hover:shadow-lg transition-all h-full flex flex-col",
          "text-card-foreground bg-card shadow-sm ring-1",
          palette.cardBorder,
          palette.cardRing
        )}
      >
        <div className={cn("h-2 shrink-0", palette.topBar)} />
        <CardHeader className="p-6 pb-3 space-y-2">
          <div className="flex items-start justify-between gap-2 flex-wrap">
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
          <h3 className="font-semibold line-clamp-2 text-foreground">{request.title}</h3>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-4 flex-grow">
          <p className="text-sm leading-relaxed line-clamp-3 text-muted-foreground">
            {request.description}
          </p>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Package className={cn("h-3.5 w-3.5 shrink-0", palette.metricIcon)} />
              <span className="truncate">{request.quantityNeeded}</span>
            </div>
            {request.budget && (
              <div className="flex items-center gap-1.5 text-xs">
                <DollarSign className={cn("h-3.5 w-3.5 shrink-0", palette.metricIcon)} />
                <span className="truncate font-semibold text-foreground">{request.budget}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-rose-500" />
              <span>Due {request.deadline}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{request.location}</span>
            </div>
          </div>

          {request.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {request.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={cn("rounded-md px-2 py-0.5 text-xs border", palette.tagChip)}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {isOwner && quoteCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {quoteCount} quote{quoteCount !== 1 ? "s" : ""} received
              </span>
              {newQuoteCount > 0 && (
                <Badge className="rounded-full bg-blue-600 text-white text-xs px-1.5 py-0">
                  {newQuoteCount} new
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-6 pt-2 flex gap-2">
          <Link href={`/dashboard/requests/${request.id}`} className="flex-1">
            <Button variant="outline" className="w-full rounded-md gap-1.5">
              <Eye className="h-4 w-4" />
              {isOwner ? "View Quotes" : "View Details"}
            </Button>
          </Link>
          {canQuote && (
            <Button
              className="flex-1 rounded-md gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onSubmitQuote}
            >
              <SendHorizonal className="h-4 w-4" />
              Submit Quote
            </Button>
          )}
          {hasSubmittedQuote && (
            <div className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-md bg-green-50 text-green-700 border border-green-200 text-xs font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Quoted
            </div>
          )}
          {isOwner && (
            <Badge className="flex-1 h-9 flex items-center justify-center rounded-md bg-primary/5 text-primary border border-primary/20 text-xs cursor-default">
              Your Request
            </Badge>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
