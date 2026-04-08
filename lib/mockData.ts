import type {
  User,
  SupplierListing,
  ProjectRequest,
  Quote,
  Inquiry,
  Message,
  ChatThread,
} from "./types";

// ─── Users ────────────────────────────────────────────────────────────────────

export const CURRENT_USER_ID = "u1";

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "Ahmed Al-Rashid",
    company: "Al-Rashid Contracting",
    role: "both",
    verified: true,
    plan: "pro",
    remainingAds: 8,
    remainingRequests: 12,
  },
  {
    id: "u2",
    name: "Sara Mohammed",
    company: "TechBuild Solutions",
    role: "supplier",
    verified: true,
    plan: "starter",
    remainingAds: 3,
    remainingRequests: 5,
  },
  {
    id: "u3",
    name: "Khalid Ibrahim",
    company: "Gulf Steel Works",
    role: "supplier",
    verified: false,
    plan: "free",
    remainingAds: 1,
    remainingRequests: 2,
  },
  {
    id: "u4",
    name: "Nora Al-Sayed",
    company: "Riyadh Infra Projects",
    role: "project_owner",
    verified: true,
    plan: "pro",
    remainingAds: 10,
    remainingRequests: 15,
  },
  {
    id: "u5",
    name: "Omar Hassan",
    company: "Hassan Electric Co.",
    role: "supplier",
    verified: true,
    plan: "starter",
    remainingAds: 4,
    remainingRequests: 6,
  },
  {
    id: "u6",
    name: "Fatima Al-Zahra",
    company: "SafeGuard Arabia",
    role: "supplier",
    verified: false,
    plan: "free",
    remainingAds: 2,
    remainingRequests: 3,
  },
];

export function getUserById(id: string): User | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}

// ─── Supplier Listings ─────────────────────────────────────────────────────────

export const MOCK_SUPPLIER_LISTINGS: SupplierListing[] = [
  {
    id: "sl1",
    ownerId: "u2",
    category: "Construction Materials",
    title: "Premium Grade Steel Rebars — Bulk Supply",
    description:
      "High-tensile steel rebars (Grade 60) available in bulk quantities. Certified to ASTM A615. Direct from manufacturer with competitive pricing and flexible payment terms. Serving the GCC region with 15+ years of experience.",
    quantity: "50–5,000 tons",
    deliveryTime: "7–14 days",
    minOrderValue: "SAR 50,000",
    verified: true,
    featured: true,
    isActive: true,
    createdAt: "2026-03-10",
    contactPhone: "+966501234001",
    contactWhatsApp: "+966501234001",
    contactEmail: "sales@techbuildsolutions.sa",
    contactWebsite: "https://techbuildsolutions.sa",
  },
  {
    id: "sl2",
    ownerId: "u3",
    category: "Electrical & Lighting",
    title: "LED Industrial Lighting Solutions",
    description:
      "Energy-efficient LED fixtures for warehouses, factories, and commercial spaces. Full installation support available. Up to 70% energy savings vs traditional lighting. 5-year warranty on all products.",
    quantity: "10–10,000 units",
    deliveryTime: "3–7 days",
    verified: true,
    featured: false,
    isActive: true,
    createdAt: "2026-03-15",
    contactPhone: "+966502234002",
    contactWhatsApp: "+966502234002",
    contactEmail: "info@gulfsteel.sa",
  },
  {
    id: "sl3",
    ownerId: "u5",
    category: "HVAC & Plumbing",
    title: "Commercial HVAC Systems & Installation",
    description:
      "Supply and installation of central air conditioning systems for commercial and industrial buildings. Brands: Carrier, Trane, Daikin. Maintenance contracts available. ISO 9001 certified team.",
    quantity: "1–50 units",
    deliveryTime: "14–21 days",
    verified: true,
    featured: true,
    isActive: true,
    createdAt: "2026-02-28",
    contactPhone: "+966503234003",
    contactWhatsApp: "+966503234003",
    contactEmail: "hvac@hassanelectric.sa",
    contactWebsite: "https://hassanelectric.sa",
  },
  {
    id: "sl4",
    ownerId: "u6",
    category: "Safety & PPE",
    title: "Certified Personal Protective Equipment",
    description:
      "Full range of CE-certified PPE: hard hats, safety vests, gloves, goggles, and boots. Ideal for construction and industrial sites. Bulk discounts available. Quick nationwide delivery.",
    quantity: "100–50,000 units",
    deliveryTime: "2–5 days",
    minOrderValue: "SAR 5,000",
    verified: false,
    featured: false,
    isActive: true,
    createdAt: "2026-03-20",
    contactEmail: "orders@safeguard.sa",
  },
  {
    id: "sl5",
    ownerId: "u2",
    category: "IT & Technology",
    title: "Enterprise Networking & Cabling Solutions",
    description:
      "Structured cabling, fiber optic networks, Wi-Fi infrastructure, and server room setups. Cisco/HP certified engineers. Nationwide project capability with 48-hour support SLA.",
    quantity: "Project-based",
    deliveryTime: "5–30 days",
    verified: true,
    featured: false,
    isActive: true,
    createdAt: "2026-03-05",
    contactPhone: "+966505234005",
    contactWhatsApp: "+966505234005",
    contactEmail: "it@techbuildsolutions.sa",
    contactWebsite: "https://techbuildsolutions.sa",
  },
  {
    id: "sl6",
    ownerId: "u3",
    category: "Logistics & Transport",
    title: "Heavy Equipment Transport & Logistics",
    description:
      "Specialized in moving heavy machinery, steel, and construction materials across the Kingdom. Fleet of 20+ trucks including lowboys and flatbeds. Fully insured and licensed.",
    quantity: "Per trip / contract",
    deliveryTime: "1–3 days",
    verified: false,
    featured: false,
    isActive: true,
    createdAt: "2026-03-18",
    contactPhone: "+966506234006",
    contactWhatsApp: "+966506234006",
  },
  {
    id: "sl7",
    ownerId: "u5",
    category: "Industrial Equipment",
    title: "Construction Machinery Rental & Sales",
    description:
      "Excavators, bulldozers, cranes, and forklifts available for rent or purchase. Maintenance included in rental. Operators available upon request. Modern fleet, GPS-tracked.",
    quantity: "1–20 units",
    deliveryTime: "1–5 days",
    verified: true,
    featured: true,
    isActive: true,
    createdAt: "2026-02-20",
    contactPhone: "+966507234007",
    contactWhatsApp: "+966507234007",
    contactEmail: "rental@hassanelectric.sa",
    contactWebsite: "https://hassanelectric.sa",
  },
  {
    id: "sl8",
    ownerId: "u6",
    category: "Furniture & Fixtures",
    title: "Commercial & Office Furniture — Custom & Standard",
    description:
      "Office, hotel, and commercial furniture. Custom manufacturing available within 3 weeks. Eco-certified materials. Full installation service across GCC. Minimum order 10 units.",
    quantity: "10–500 units",
    deliveryTime: "7–21 days",
    verified: false,
    featured: false,
    isActive: false,
    createdAt: "2026-01-30",
    contactEmail: "sales@safeguard.sa",
  },
];

// ─── Project Requests ──────────────────────────────────────────────────────────

export const MOCK_PROJECT_REQUESTS: ProjectRequest[] = [
  {
    id: "pr1",
    ownerId: "u1",
    category: "Construction Materials",
    title: "Structural Steel for Residential Tower — Phase 2",
    description:
      "Seeking a reliable supplier for structural steel (H-beams, I-beams, hollow sections) for a 24-floor residential tower in Riyadh. Total quantity approx 800 tons. Delivery in phases over 4 months. SASO certification required.",
    quantityNeeded: "800 tons",
    budget: "SAR 3,200,000",
    deadline: "2026-05-15",
    location: "Riyadh",
    status: "receiving_quotes",
    tags: ["structural steel", "tower", "certified"],
    createdAt: "2026-03-25",
  },
  {
    id: "pr2",
    ownerId: "u4",
    category: "Electrical & Lighting",
    title: "Complete Electrical Works for Office Complex",
    description:
      "Full electrical installation for a 6-floor commercial office building in Jeddah. Includes main switchboard, cabling, lighting, emergency systems, and BMS integration. Looking for licensed electrical contractor with Saudi Council of Engineers certification.",
    quantityNeeded: "Full project scope",
    budget: "SAR 750,000",
    deadline: "2026-06-01",
    location: "Jeddah",
    status: "open",
    tags: ["electrical", "BMS", "commercial", "licensed"],
    createdAt: "2026-04-01",
  },
  {
    id: "pr3",
    ownerId: "u1",
    category: "HVAC & Plumbing",
    title: "Central AC System for 5-Star Hotel Project",
    description:
      "Central HVAC system supply and installation for a 200-room hotel in Makkah. Must include VRF systems for guestrooms, central AHUs for lobbies and conference areas, and full commissioning. Project completion: Q3 2026.",
    quantityNeeded: "200 VRF units + AHU system",
    budget: "SAR 4,500,000",
    deadline: "2026-08-30",
    location: "Makkah",
    status: "in_progress",
    tags: ["VRF", "hotel", "5-star", "commissioning"],
    createdAt: "2026-02-10",
  },
  {
    id: "pr4",
    ownerId: "u4",
    category: "Safety & PPE",
    title: "Safety Equipment for 300-Worker Construction Site",
    description:
      "Procuring PPE for a large construction site with 300 workers. Required: hard hats, reflective vests, steel-toe boots, safety gloves, eye protection, and fall arrest harnesses. All items must be CE/ANSI certified. Monthly supply contract preferred.",
    quantityNeeded: "300 full sets + monthly replenishment",
    budget: "SAR 120,000",
    deadline: "2026-04-20",
    location: "Dammam",
    status: "open",
    tags: ["PPE", "certified", "bulk", "monthly contract"],
    createdAt: "2026-04-02",
  },
  {
    id: "pr5",
    ownerId: "u1",
    category: "IT & Technology",
    title: "Smart Building Network Infrastructure",
    description:
      "Design and implementation of a complete network infrastructure for a smart office building. Includes structured cabling (Cat6A), fiber backbone, Wi-Fi 6 access points, server room setup, and integration with building management system.",
    quantityNeeded: "Full turnkey project",
    budget: "SAR 380,000",
    deadline: "2026-07-15",
    location: "Riyadh",
    status: "open",
    tags: ["smart building", "fiber", "Wi-Fi 6", "BMS"],
    createdAt: "2026-03-28",
  },
  {
    id: "pr6",
    ownerId: "u4",
    category: "Logistics & Transport",
    title: "Monthly Materials Transport from Port to Site",
    description:
      "Looking for a reliable logistics partner to transport construction materials from Jeddah Islamic Port to our project site in Rabigh. Estimated 2–4 heavy truck loads per week. 12-month contract with possible extension.",
    quantityNeeded: "2–4 loads/week",
    budget: "SAR 25,000/month",
    deadline: "2026-04-30",
    location: "Rabigh",
    status: "open",
    tags: ["logistics", "recurring", "contract", "port"],
    createdAt: "2026-04-03",
  },
];

// ─── Quotes ────────────────────────────────────────────────────────────────────

export const MOCK_QUOTES: Quote[] = [
  {
    id: "q1",
    requestId: "pr1",
    supplierId: "u2",
    price: "SAR 2,950,000",
    timeline: "4 months (phased delivery)",
    message:
      "We have supplied structural steel for 10+ towers in Riyadh. SASO-certified. Can begin delivery within 2 weeks of contract signing. Price includes delivery to site.",
    status: "shortlisted",
    submittedAt: "2026-03-26",
  },
  {
    id: "q2",
    requestId: "pr1",
    supplierId: "u3",
    price: "SAR 3,100,000",
    timeline: "3.5 months",
    message:
      "Gulf Steel Works offers premium Grade 60 rebars and structural sections. We carry excess inventory for urgent projects. Full SASO documentation provided.",
    status: "viewed",
    submittedAt: "2026-03-27",
  },
  {
    id: "q3",
    requestId: "pr1",
    supplierId: "u5",
    price: "SAR 2,880,000",
    timeline: "4.5 months",
    message:
      "Competitive pricing with flexible payment terms (30/40/30). We have an active partnership with Saudi Steel to guarantee supply continuity.",
    status: "submitted",
    submittedAt: "2026-03-28",
  },
  {
    id: "q4",
    requestId: "pr2",
    supplierId: "u5",
    price: "SAR 680,000",
    timeline: "3 months",
    message:
      "Hassan Electric Co. is fully licensed with Saudi Council of Engineers registration. Completed 15+ commercial projects in Jeddah. Our team of 25 engineers is ready.",
    status: "submitted",
    submittedAt: "2026-04-02",
  },
  {
    id: "q5",
    requestId: "pr4",
    supplierId: "u6",
    price: "SAR 95,000",
    timeline: "Delivery within 5 days, monthly supply",
    message:
      "SafeGuard Arabia stocks all required PPE items with CE/ANSI certifications. We offer custom branding on hard hats and vests. Monthly delivery service across KSA.",
    status: "submitted",
    submittedAt: "2026-04-03",
  },
  {
    id: "q6",
    requestId: "pr5",
    supplierId: "u2",
    price: "SAR 340,000",
    timeline: "6 weeks",
    message:
      "TechBuild Solutions has deployed smart building infrastructure for 8 major projects in Riyadh. Cisco Meraki partner. Full design, supply, install, and 2-year SLA included.",
    status: "submitted",
    submittedAt: "2026-04-04",
  },
];

// ─── Inquiries (listing-based) ────────────────────────────────────────────────

export const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: "inq1",
    listingId: "sl2",
    requesterId: "u1",
    sentAt: "2026-03-22",
  },
  {
    id: "inq2",
    listingId: "sl5",
    requesterId: "u1",
    sentAt: "2026-03-18",
  },
];

// ─── Messages ──────────────────────────────────────────────────────────────────

export const MOCK_MESSAGES: Message[] = [
  {
    id: "m1",
    threadId: "t1",
    senderId: "u1",
    content:
      "Hello, we reviewed your quote and are very interested. Can you share more details about your phased delivery schedule?",
    timestamp: "2026-03-27T09:00:00Z",
    read: true,
  },
  {
    id: "m2",
    threadId: "t1",
    senderId: "u2",
    content:
      "Thank you for reaching out! We propose: Phase 1 (200 tons) in weeks 1–3, Phase 2 (300 tons) in weeks 5–8, Phase 3 (300 tons) in weeks 10–14. Does that work for your schedule?",
    timestamp: "2026-03-27T10:30:00Z",
    read: true,
  },
  {
    id: "m3",
    threadId: "t1",
    senderId: "u1",
    content:
      "That works perfectly. Can you also confirm if the price includes crane offloading at site?",
    timestamp: "2026-03-27T11:00:00Z",
    read: true,
  },
  {
    id: "m4",
    threadId: "t1",
    senderId: "u2",
    content:
      "Yes, crane offloading is included in the quoted price. We have our own mobile crane fleet.",
    timestamp: "2026-03-27T11:45:00Z",
    read: false,
  },
];

export const MOCK_CHAT_THREADS: ChatThread[] = [
  {
    id: "t1",
    type: "quote",
    refId: "q1",
    participantIds: ["u1", "u2"],
    lastMessage: "Yes, crane offloading is included in the quoted price.",
    lastMessageAt: "2026-03-27T11:45:00Z",
    unreadCount: 1,
  },
];

// ─── Category lists ───────────────────────────────────────────────────────────

export const SUPPLIER_CATEGORIES: string[] = [
  "Construction Materials",
  "Electrical & Lighting",
  "HVAC & Plumbing",
  "IT & Technology",
  "Furniture & Fixtures",
  "Safety & PPE",
  "Logistics & Transport",
  "Industrial Equipment",
  "Cleaning & Facilities",
  "Food & Catering",
];
