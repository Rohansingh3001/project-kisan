import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agrosaathi - AI-Powered Farming Assistant",
  description: "Your personal agricultural companion powered by AI. Get instant crop disease diagnosis, real-time market prices, government schemes, and voice assistance in your native language.",
  keywords: ["farming", "agriculture", "AI", "crop disease", "market prices", "government schemes", "Agrosaathi", "farming assistant"],
  authors: [{ name: "Agrosaathi Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
