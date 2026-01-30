import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { cn } from "@/utils";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Confort Prestige | Expert HVAC & Windows",
  description: "Heat Pumps, Furnaces, and Windows. Book your free quote with Isabelle today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          "flex flex-col min-h-screen"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />

          {children}
          <Toaster position="top-center" richColors={true} />
        </ThemeProvider>
      </body>
    </html>
  );
}
