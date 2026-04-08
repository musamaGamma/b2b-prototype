import type { Metadata } from "next";
import "./globals.css";
import { B2BProvider } from "@/lib/store";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Lara B2B Marketplace",
  description: "B2B Supply & Demand Matching Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <B2BProvider>
          {children}
          <Toaster richColors position="top-right" />
        </B2BProvider>
      </body>
    </html>
  );
}
