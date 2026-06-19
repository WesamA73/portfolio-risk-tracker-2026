import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio Risk Tracker",
  description: "Analyze your portfolio diversification and get instant insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        {children}
        <footer className="mt-12 py-6 px-4 border-t border-gray-200 bg-white text-center text-sm text-gray-600">
          <p>
            Portfolio Risk Tracker © 2026 | Secure • Private • Real-time Analysis
          </p>
        </footer>
      </body>
    </html>
  );
}
