export type UserRole = "supplier" | "project_owner" | "both";

export interface User {
  id: string;
  name: string;
  company: string;
  avatar?: string;
  role: UserRole;
  verified: boolean;
  plan: "free" | "starter" | "pro";
  remainingAds: number;
  remainingRequests: number;
}

export type SupplierCategory =
  | "Construction Materials"
  | "Electrical & Lighting"
  | "HVAC & Plumbing"
  | "IT & Technology"
  | "Furniture & Fixtures"
  | "Safety & PPE"
  | "Logistics & Transport"
  | "Industrial Equipment"
  | "Cleaning & Facilities"
  | "Food & Catering";

export interface SupplierListing {
  id: string;
  ownerId: string;
  category: SupplierCategory;
  title: string;
  description: string;
  quantity: string;
  deliveryTime: string;
  minOrderValue?: string;
  verified: boolean;
  featured: boolean;
  isActive: boolean;
  createdAt: string;
  /** Optional direct-contact fields; shown as icon buttons on the card */
  contactPhone?: string;
  contactWhatsApp?: string;
  contactEmail?: string;
  contactWebsite?: string;
}

/** Primary flow: Project Owner posts what they need, receives quotes from suppliers */
export type RequestStatus =
  | "open"
  | "receiving_quotes"
  | "in_progress"
  | "closed";

export interface ProjectRequest {
  id: string;
  ownerId: string;
  category: SupplierCategory;
  title: string;
  description: string;
  quantityNeeded: string;
  budget?: string;
  deadline: string;
  location: string;
  status: RequestStatus;
  tags: string[];
  createdAt: string;
}

export type QuoteStatus =
  | "submitted"
  | "viewed"
  | "shortlisted"
  | "accepted"
  | "rejected";

/** Supplier's structured bid on a ProjectRequest */
export interface Quote {
  id: string;
  requestId: string;
  supplierId: string;
  price: string;
  timeline: string;
  message: string;
  status: QuoteStatus;
  submittedAt: string;
}

/** Secondary flow: quick-reach-out on a supplier listing */
export interface Inquiry {
  id: string;
  listingId: string;
  requesterId: string;
  sentAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface ChatThread {
  id: string;
  /** "quote" = request-based negotiation, "inquiry" = listing-based chat */
  type: "quote" | "inquiry";
  /** quote_id or listing_id */
  refId: string;
  participantIds: string[];
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}
