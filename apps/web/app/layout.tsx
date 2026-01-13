import type { Metadata } from "next";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plant Recognizer",
  description: "Upload photos of plants and identify them using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ConvexClientProvider>
          <Navigation />
          <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            {children}
          </main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
