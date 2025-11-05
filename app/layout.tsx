import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalHeader } from "@/src/components/layout/conditional-header";
import { ConditionalFooter } from "@/src/components/layout/conditional-footer";
import { CartProvider } from "@/src/hooks/use-cart";
import { ToastProvider } from "@/src/components/ui/toast";
import SessionProvider from "@/src/components/providers/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MeuSite - Vaquejada",
  description: "Produtos de vaquejada de alta qualidade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <SessionProvider>
          <CartProvider>
            <ToastProvider>
              <ConditionalHeader />
              <main className="flex-1">
                {children}
              </main>
              <ConditionalFooter />
            </ToastProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
