"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SendHorizonal, DollarSign, Clock, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useB2B } from "@/lib/store";
import type { ProjectRequest } from "@/lib/types";

interface SubmitQuoteDrawerProps {
  open: boolean;
  onClose: () => void;
  demand: ProjectRequest;
}

export function SubmitQuoteDrawer({ open, onClose, demand }: SubmitQuoteDrawerProps) {
  const { submitQuote } = useB2B();
  const [price, setPrice] = useState("");
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValid = price.trim() && timeline.trim() && message.trim().length >= 20;

  function handleSubmit() {
    if (!isValid) return;
    setSubmitting(true);
    setTimeout(() => {
      submitQuote(demand.id, { price: price.trim(), timeline: timeline.trim(), message: message.trim() });
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setPrice("");
        setTimeline("");
        setMessage("");
        onClose();
      }, 1800);
    }, 800);
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
              Submit Quote
            </Badge>
          </div>
          <SheetTitle className="text-base font-semibold line-clamp-2 leading-snug">
            {demand.title}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            {demand.category} · Due {demand.deadline} · {demand.location}
            {demand.budget && ` · Budget: ${demand.budget}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Price */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              Your Price / Total Quote Value
              <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. SAR 250,000 or $45/unit"
              className={cn(
                "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm",
                "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              )}
            />
          </div>

          {/* Timeline */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-blue-600" />
              Delivery / Completion Timeline
              <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="e.g. 6 weeks, or phased: 30 days per batch"
              className={cn(
                "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm",
                "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              )}
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-violet-600" />
              Cover Message
              <span className="text-destructive">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Introduce yourself and your offering. Explain why you're the best fit, include relevant experience, certifications, and any questions for the buyer..."
              className={cn(
                "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm resize-none",
                "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              )}
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length} / min 20 characters
            </p>
          </div>

          {/* Info callout */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700 space-y-1">
            <p className="font-medium">How it works</p>
            <ul className="list-disc list-inside space-y-0.5 text-blue-600">
              <li>The buyer will review all submitted quotes</li>
              <li>They may shortlist you for further discussion</li>
              <li>If accepted, you both get access to a private chat</li>
              <li>You can track your quote status in Quotes Sent</li>
            </ul>
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-background">
          {submitted ? (
            <div className="w-full rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium py-2.5 text-center flex items-center justify-center gap-2">
              <span>Quote submitted successfully!</span>
            </div>
          ) : (
            <Button
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSubmit}
              disabled={!isValid || submitting}
            >
              <SendHorizonal className="h-4 w-4" />
              {submitting ? "Submitting..." : "Submit Quote"}
            </Button>
          )}
          <p className="text-xs text-muted-foreground text-center mt-2">
            Your quote will be visible only to the demand poster
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
