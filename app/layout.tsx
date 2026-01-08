import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import { NavigationProvider } from "@/context/NavigationContext";
import { NavigationProgress } from "@/components/ui/NavigationProgress";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maqal - Audiobook App",
  description: "Modern audiobook web app focused on meaningful listening",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cairo.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NavigationProvider>
          <NavigationProgress />
          <AudioPlayerProvider>
            {children}
          </AudioPlayerProvider>
        </NavigationProvider>
      </body>
    </html>
  );
}

