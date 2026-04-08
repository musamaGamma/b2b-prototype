"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import type {
  SupplierListing,
  ProjectRequest,
  Quote,
  QuoteStatus,
  Inquiry,
  Message,
  ChatThread,
} from "./types";
import {
  MOCK_SUPPLIER_LISTINGS,
  MOCK_PROJECT_REQUESTS,
  MOCK_QUOTES,
  MOCK_INQUIRIES,
  MOCK_MESSAGES,
  MOCK_CHAT_THREADS,
  CURRENT_USER_ID,
} from "./mockData";

interface B2BStoreState {
  listings: SupplierListing[];
  requests: ProjectRequest[];
  quotes: Quote[];
  inquiries: Inquiry[];
  messages: Message[];
  threads: ChatThread[];
  currentUserId: string;
  activeChatThreadId: string | null;
}

interface B2BStoreActions {
  /** Submit a quote on a request (supplier → project owner) */
  submitQuote: (
    requestId: string,
    data: { price: string; timeline: string; message: string }
  ) => Quote;
  updateQuoteStatus: (quoteId: string, status: QuoteStatus) => void;
  markQuoteViewed: (quoteId: string) => void;
  /** Accept a quote: sets it accepted, rejects others, moves request to in_progress */
  acceptQuote: (quoteId: string) => void;
  /** Mark a request as completed (closed) */
  closeRequest: (requestId: string) => void;
  /** Send an inquiry on a supplier listing (project owner → supplier) */
  sendInquiry: (listingId: string) => void;
  sendMessage: (threadId: string, content: string) => void;
  openChat: (refId: string, type: "quote" | "inquiry") => ChatThread;
  closeChat: () => void;
  createRequest: (data: Omit<ProjectRequest, "id" | "ownerId" | "createdAt" | "status">) => ProjectRequest;
  createListing: (data: Omit<SupplierListing, "id" | "ownerId" | "createdAt" | "isActive">) => SupplierListing;
  toggleListingActive: (listingId: string) => void;
  deleteListing: (listingId: string) => void;
}

type B2BStore = B2BStoreState & B2BStoreActions;

const B2BContext = createContext<B2BStore | null>(null);

export function B2BProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = useState<SupplierListing[]>(MOCK_SUPPLIER_LISTINGS);
  const [requests, setRequests] = useState<ProjectRequest[]>(MOCK_PROJECT_REQUESTS);
  const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES);
  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [threads, setThreads] = useState<ChatThread[]>(MOCK_CHAT_THREADS);
  const [activeChatThreadId, setActiveChatThreadId] = useState<string | null>(null);

  const submitQuote = useCallback(
    (requestId: string, data: { price: string; timeline: string; message: string }): Quote => {
      const newQuote: Quote = {
        id: `q${Date.now()}`,
        requestId,
        supplierId: CURRENT_USER_ID,
        price: data.price,
        timeline: data.timeline,
        message: data.message,
        status: "submitted",
        submittedAt: new Date().toISOString().split("T")[0],
      };
      setQuotes((prev) => [...prev, newQuote]);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId && r.status === "open"
            ? { ...r, status: "receiving_quotes" }
            : r
        )
      );
      return newQuote;
    },
    []
  );

  const updateQuoteStatus = useCallback((quoteId: string, status: QuoteStatus) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status } : q))
    );
  }, []);

  const markQuoteViewed = useCallback((quoteId: string) => {
    setQuotes((prev) =>
      prev.map((q) =>
        q.id === quoteId && q.status === "submitted" ? { ...q, status: "viewed" } : q
      )
    );
  }, []);

  const acceptQuote = useCallback((quoteId: string) => {
    setQuotes((prev) => {
      const quote = prev.find((q) => q.id === quoteId);
      if (!quote) return prev;
      return prev.map((q) => {
        if (q.id === quoteId) return { ...q, status: "accepted" as QuoteStatus };
        if (q.requestId === quote.requestId && q.status !== "accepted") {
          return { ...q, status: "rejected" as QuoteStatus };
        }
        return q;
      });
    });
    setRequests((prev) => {
      const quote = quotes.find((q) => q.id === quoteId);
      return prev.map((r) =>
        r.id === quote?.requestId ? { ...r, status: "in_progress" } : r
      );
    });
  }, [quotes]);

  const closeRequest = useCallback((requestId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "closed" } : r))
    );
  }, []);

  const sendInquiry = useCallback((listingId: string) => {
    const existing = inquiries.find(
      (i) => i.listingId === listingId && i.requesterId === CURRENT_USER_ID
    );
    if (existing) return;
    const newInquiry: Inquiry = {
      id: `inq${Date.now()}`,
      listingId,
      requesterId: CURRENT_USER_ID,
      sentAt: new Date().toISOString().split("T")[0],
    };
    setInquiries((prev) => [...prev, newInquiry]);
  }, [inquiries]);

  const openChat = useCallback(
    (refId: string, type: "quote" | "inquiry"): ChatThread => {
      const existing = threads.find((t) => t.refId === refId && t.type === type);
      if (existing) {
        setActiveChatThreadId(existing.id);
        return existing;
      }
      let otherUserId = "";
      if (type === "quote") {
        const quote = quotes.find((q) => q.id === refId);
        otherUserId = quote
          ? quote.supplierId === CURRENT_USER_ID
            ? requests.find((r) => r.id === quote.requestId)?.ownerId ?? ""
            : quote.supplierId
          : "";
      } else {
        const listing = listings.find((l) => l.id === refId);
        otherUserId = listing?.ownerId ?? "";
      }
      const newThread: ChatThread = {
        id: `t${Date.now()}`,
        type,
        refId,
        participantIds: [CURRENT_USER_ID, otherUserId].filter(Boolean),
        unreadCount: 0,
      };
      setThreads((prev) => [...prev, newThread]);
      setActiveChatThreadId(newThread.id);
      return newThread;
    },
    [threads, quotes, requests, listings]
  );

  const closeChat = useCallback(() => {
    setActiveChatThreadId(null);
  }, []);

  const sendMessage = useCallback((threadId: string, content: string) => {
    const newMsg: Message = {
      id: `m${Date.now()}`,
      threadId,
      senderId: CURRENT_USER_ID,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? { ...t, lastMessage: content, lastMessageAt: newMsg.timestamp, unreadCount: 0 }
          : t
      )
    );
  }, []);

  const createRequest = useCallback(
    (data: Omit<ProjectRequest, "id" | "ownerId" | "createdAt" | "status">): ProjectRequest => {
      const newRequest: ProjectRequest = {
        ...data,
        id: `pr${Date.now()}`,
        ownerId: CURRENT_USER_ID,
        status: "open",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setRequests((prev) => [newRequest, ...prev]);
      return newRequest;
    },
    []
  );

  const createListing = useCallback(
    (data: Omit<SupplierListing, "id" | "ownerId" | "createdAt" | "isActive">): SupplierListing => {
      const newListing: SupplierListing = {
        ...data,
        id: `sl${Date.now()}`,
        ownerId: CURRENT_USER_ID,
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setListings((prev) => [newListing, ...prev]);
      return newListing;
    },
    []
  );

  const toggleListingActive = useCallback((listingId: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, isActive: !l.isActive } : l))
    );
  }, []);

  const deleteListing = useCallback((listingId: string) => {
    setListings((prev) => prev.filter((l) => l.id !== listingId));
  }, []);

  const value = useMemo<B2BStore>(
    () => ({
      listings,
      requests,
      quotes,
      inquiries,
      messages,
      threads,
      currentUserId: CURRENT_USER_ID,
      activeChatThreadId,
      submitQuote,
      updateQuoteStatus,
      markQuoteViewed,
      acceptQuote,
      closeRequest,
      sendInquiry,
      openChat,
      closeChat,
      sendMessage,
      createRequest,
      createListing,
      toggleListingActive,
      deleteListing,
    }),
    [
      listings,
      requests,
      quotes,
      inquiries,
      messages,
      threads,
      activeChatThreadId,
      submitQuote,
      updateQuoteStatus,
      markQuoteViewed,
      acceptQuote,
      closeRequest,
      sendInquiry,
      openChat,
      closeChat,
      sendMessage,
      createRequest,
      createListing,
      toggleListingActive,
      deleteListing,
    ]
  );

  return <B2BContext.Provider value={value}>{children}</B2BContext.Provider>;
}

export function useB2B(): B2BStore {
  const ctx = useContext(B2BContext);
  if (!ctx) throw new Error("useB2B must be used inside <B2BProvider>");
  return ctx;
}
