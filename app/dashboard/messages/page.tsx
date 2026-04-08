"use client";

import { useState } from "react";
import { useB2B } from "@/lib/store";
import { ChatDrawer } from "@/components/b2b/ChatDrawer";
import { getUserById } from "@/lib/mockData";
import { MessageSquare, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ChatThread } from "@/lib/types";

function formatRelativeTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function ThreadRow({
  thread,
  isActive,
  onClick,
}: {
  thread: ChatThread;
  isActive: boolean;
  onClick: () => void;
}) {
  const { currentUserId, quotes, requests, listings } = useB2B();
  const otherId = thread.participantIds.find((id) => id !== currentUserId);
  const otherUser = otherId ? getUserById(otherId) : null;

  function getTitle() {
    if (thread.type === "quote") {
      const quote = quotes.find((q) => q.id === thread.refId);
      if (quote) {
        const demand = requests.find((r) => r.id === quote.requestId);
        return demand?.title ?? "Quote Negotiation";
      }
    } else {
      const listing = listings.find((l) => l.id === thread.refId);
      return listing?.title ?? "Contact Chat";
    }
    return "Chat";
  }

  return (
    <button
      className={cn(
        "w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors rounded-xl",
        isActive ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/50 border border-transparent"
      )}
      onClick={onClick}
    >
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-sm font-bold text-primary">
          {otherUser?.name.charAt(0) ?? "?"}
        </span>
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-foreground truncate">{getTitle()}</p>
          {thread.lastMessageAt && (
            <p className="text-xs text-muted-foreground shrink-0">
              {formatRelativeTime(thread.lastMessageAt)}
            </p>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {otherUser?.name} · {otherUser?.company}
        </p>
        {thread.lastMessage && (
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {thread.lastMessage}
          </p>
        )}
      </div>
      {thread.unreadCount > 0 && (
        <Badge className="shrink-0 rounded-full bg-primary text-primary-foreground text-xs min-w-5 h-5 flex items-center justify-center px-1.5">
          {thread.unreadCount}
        </Badge>
      )}
    </button>
  );
}

export default function MessagesPage() {
  const { threads, openChat, closeChat, activeChatThreadId } = useB2B();
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);

  const activeThread = threads.find((t) => t.id === activeChatThreadId) ?? selectedThread ?? null;
  const totalUnread = threads.reduce((acc, t) => acc + t.unreadCount, 0);

  function handleSelectThread(thread: ChatThread) {
    setSelectedThread(thread);
    openChat(thread.refId, thread.type);
  }

  return (
    <div className="px-6 py-6 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        {totalUnread > 0 && (
          <Badge className="rounded-full bg-primary text-primary-foreground text-xs px-2">
            {totalUnread} unread
          </Badge>
        )}
      </div>

      {threads.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center space-y-2">
          <MessageCircle className="h-10 w-10 text-muted-foreground/30 mx-auto" />
          <p className="text-muted-foreground text-sm font-medium">No conversations yet</p>
          <p className="text-muted-foreground text-xs">
            Accept a quote or submit one to unlock a private chat thread.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {threads.map((thread) => (
            <ThreadRow
              key={thread.id}
              thread={thread}
              isActive={activeThread?.id === thread.id}
              onClick={() => handleSelectThread(thread)}
            />
          ))}
        </div>
      )}

      <ChatDrawer
        thread={activeThread}
        onClose={() => {
          setSelectedThread(null);
          closeChat();
        }}
      />
    </div>
  );
}
