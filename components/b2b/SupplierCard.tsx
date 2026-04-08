"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Layers,
  Clock,
  MessageSquare,
  Star,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryPalette } from "@/lib/categoryPalette";
import type { SupplierListing } from "@/lib/types";

// WhatsApp SVG icon (not in lucide)
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

function MetricBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl p-3 text-center bg-secondary/50">
      {icon}
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

interface SupplierCardProps {
  listing: SupplierListing;
  index?: number;
  isOwner?: boolean;
  /** Whether current user already has an inquiry/chat open for this listing */
  hasInquiry?: boolean;
  /** Send inquiry → opens chat directly */
  onSendInquiry?: () => void;
  onEdit?: () => void;
  onToggleActive?: () => void;
  onDelete?: () => void;
}

export function SupplierCard({
  listing,
  index = 0,
  isOwner = false,
  hasInquiry = false,
  onSendInquiry,
  onEdit,
  onToggleActive,
  onDelete,
}: SupplierCardProps) {
  const palette = getCategoryPalette(listing.category);

  const hasAnyContact =
    listing.contactPhone ||
    listing.contactWhatsApp ||
    listing.contactEmail ||
    listing.contactWebsite;

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
        <CardHeader className="p-6 pb-3 space-y-1.5">
          {listing.featured && (
            <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/30 rounded-full px-3 py-0.5 text-xs font-medium w-fit gap-1 mb-1">
              <Star className="h-3 w-3 fill-amber-500" />
              Featured
            </Badge>
          )}
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <Badge className={cn("rounded-full px-3 py-1 text-xs font-semibold", palette.badge)}>
              {listing.category}
            </Badge>
            {listing.verified && (
              <Badge className="rounded-full px-2 py-0.5 text-xs bg-green-50 text-green-700 border border-green-200">
                Verified
              </Badge>
            )}
          </div>
          <h3 className="font-semibold mt-2 line-clamp-2 text-foreground">
            {listing.title}
          </h3>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-4 flex-grow">
          <p className="text-sm leading-relaxed line-clamp-3 text-muted-foreground">
            {listing.description}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <MetricBlock
              icon={<Layers className={cn("h-5 w-5 mx-auto mb-1", palette.metricIcon)} />}
              label="Quantity"
              value={listing.quantity}
            />
            <MetricBlock
              icon={<Clock className={cn("h-5 w-5 mx-auto mb-1", palette.metricIcon)} />}
              label="Delivery"
              value={listing.deliveryTime}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col p-6 pt-2 gap-3">
          {isOwner ? (
            <div className="w-full border-t border-border/70 pt-4">
              <div className="flex w-full gap-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 rounded-[10px]"
                    onClick={onEdit}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                )}
                {onToggleActive && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 rounded-[10px]"
                    onClick={onToggleActive}
                  >
                    {listing.isActive ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    {listing.isActive ? "Disable" : "Enable"}
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="sm"
                    className="flex-1 gap-1.5 rounded-[10px] bg-[#E5534B] text-white hover:bg-[#c9473f] border-0"
                    onClick={onDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Primary CTA: In-platform chat inquiry */}
              <div className="w-full border-t border-border/70 pt-4">
                {hasInquiry ? (
                  <Button
                    className="w-full rounded-md gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={onSendInquiry}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Open Chat
                  </Button>
                ) : (
                  <Button
                    className="w-full rounded-md gap-2"
                    onClick={onSendInquiry}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Send Inquiry
                  </Button>
                )}
              </div>

              {/* Secondary: direct contact methods */}
              {hasAnyContact && (
                <div className="w-full">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium text-center mb-2">
                    Or contact directly
                  </p>
                  <TooltipProvider>
                    <div className="flex items-center justify-center gap-2">
                      {listing.contactWhatsApp && (
                        <Tooltip>
                          <TooltipTrigger>
                            <button
                              type="button"
                              onClick={() =>
                                window.open(
                                  `https://wa.me/${listing.contactWhatsApp?.replace(/\D/g, "")}`,
                                  "_blank",
                                  "noopener,noreferrer"
                                )
                              }
                              className={cn(
                                "inline-flex items-center justify-center w-9 h-9 rounded-full border",
                                "bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30",
                                "hover:bg-[#25D366]/20 transition-colors"
                              )}
                              aria-label="Contact via WhatsApp"
                            >
                              <WhatsAppIcon className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            WhatsApp: {listing.contactWhatsApp}
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {listing.contactPhone && (
                        <Tooltip>
                          <TooltipTrigger>
                            <button
                              type="button"
                              onClick={() => {
                                window.location.href = `tel:${listing.contactPhone}`;
                              }}
                              className={cn(
                                "inline-flex items-center justify-center w-9 h-9 rounded-full border",
                                "bg-blue-50 text-blue-600 border-blue-200",
                                "hover:bg-blue-100 transition-colors"
                              )}
                              aria-label="Call supplier"
                            >
                              <Phone className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            Call: {listing.contactPhone}
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {listing.contactEmail && (
                        <Tooltip>
                          <TooltipTrigger>
                            <button
                              type="button"
                              onClick={() => {
                                window.location.href = `mailto:${listing.contactEmail}`;
                              }}
                              className={cn(
                                "inline-flex items-center justify-center w-9 h-9 rounded-full border",
                                "bg-orange-50 text-orange-600 border-orange-200",
                                "hover:bg-orange-100 transition-colors"
                              )}
                              aria-label="Email supplier"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            Email: {listing.contactEmail}
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {listing.contactWebsite && (
                        <Tooltip>
                          <TooltipTrigger>
                            <button
                              type="button"
                              onClick={() =>
                                window.open(
                                  listing.contactWebsite,
                                  "_blank",
                                  "noopener,noreferrer"
                                )
                              }
                              className={cn(
                                "inline-flex items-center justify-center w-9 h-9 rounded-full border",
                                "bg-slate-50 text-slate-600 border-slate-200",
                                "hover:bg-slate-100 transition-colors"
                              )}
                              aria-label="Visit website"
                            >
                              <Globe className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            {listing.contactWebsite}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TooltipProvider>
                </div>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
