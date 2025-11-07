import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue, Racing_Sans_One } from "next/font/google";
import "./globals.css";
import { ConditionalHeader } from "@/src/components/layout/conditional-header";
import { ConditionalFooter } from "@/src/components/layout/conditional-footer";
import { CartProvider } from "@/src/hooks/use-cart";
import { ToastProvider } from "@/src/components/ui/toast";
import SessionProvider from "@/src/components/providers/session-provider";
import { PageTransition } from "@/src/components/layout/page-transition";
import { NavigationTracker } from "@/src/components/layout/navigation-tracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

const racingSansOne = Racing_Sans_One({
  variable: "--font-racing-sans-one",
  weight: "400",
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
        className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${racingSansOne.variable} antialiased flex flex-col min-h-screen`}
      >
        <SessionProvider>
          <CartProvider>
            <ToastProvider>
              <NavigationTracker />
              <PageTransition />
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
