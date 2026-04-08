"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useB2B } from "@/lib/store";
import { getUserById } from "@/lib/mockData";
import type { ChatThread } from "@/lib/types";

interface ChatDrawerProps {
  thread: ChatThread | null;
  onClose: () => void;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function ChatDrawer({ thread, onClose }: ChatDrawerProps) {
  const { messages, sendMessage, currentUserId, quotes, requests, listings } = useB2B();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const threadMessages = thread
    ? messages.filter((m) => m.threadId === thread.id)
    : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages.length]);

  function getThreadTitle() {
    if (!thread) return "Chat";
    if (thread.type === "quote") {
      const quote = quotes.find((q) => q.id === thread.refId);
      if (quote) {
        const request = requests.find((r) => r.id === quote.requestId);
        return request?.title ?? "Quote Negotiation";
      }
    } else {
      const listing = listings.find((l) => l.id === thread.refId);
      return listing?.title ?? "Inquiry Chat";
    }
    return "Chat";
  }

  function getOtherParticipant() {
    if (!thread) return null;
    const otherId = thread.participantIds.find((id) => id !== currentUserId);
    return otherId ? getUserById(otherId) : null;
  }

  const otherUser = getOtherParticipant();

  function handleSend() {
    if (!thread || !input.trim()) return;
    sendMessage(thread.id, input.trim());
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const canSend = threadMessages.length > 0 || thread?.participantIds.includes(currentUserId);

  return (
    <Sheet open={!!thread} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        <SheetHeader className="px-4 pt-4 pb-3 border-b flex-row items-start justify-between space-y-0">
          <div className="flex flex-col gap-0.5 min-w-0 pr-2">
            <SheetTitle className="text-sm font-semibold line-clamp-1">
              {getThreadTitle()}
            </SheetTitle>
            {otherUser && (
              <p className="text-xs text-muted-foreground">
                {otherUser.name} · {otherUser.company}
              </p>
            )}
            <span className="text-xs text-blue-600 font-medium">
              {thread?.type === "quote" ? "Quote negotiation" : "Listing inquiry"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {threadMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 py-12">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Send className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                No messages yet.
                <br />
                Start the conversation below.
              </p>
            </div>
          ) : (
            threadMessages.map((msg, idx) => {
              const isMe = msg.senderId === currentUserId;
              const showDate =
                idx === 0 ||
                formatDate(msg.timestamp) !==
                  formatDate(threadMessages[idx - 1].timestamp);

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex items-center gap-2 my-2">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground px-1">
                        {formatDate(msg.timestamp)}
                      </span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "flex",
                      isMe ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted text-foreground rounded-bl-sm"
                      )}
                    >
                      {msg.content}
                      <p
                        className={cn(
                          "text-xs mt-1",
                          isMe ? "text-primary-foreground/60" : "text-muted-foreground"
                        )}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t bg-background">
          {canSend ? (
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder="Type a message… (Enter to send)"
                className={cn(
                  "flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none",
                  "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                )}
              />
              <Button
                size="icon"
                className="shrink-0 rounded-xl h-10 w-10 bg-primary hover:bg-primary/90"
                onClick={handleSend}
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-1">
              The other party must initiate the conversation first.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
