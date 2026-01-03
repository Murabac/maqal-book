import type { Metadata } from "next";
import "./globals.css";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import { Header } from "@/components/layout/Header";
import { AudioPlayer } from "@/components/audiobook/AudioPlayer";

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
    <html lang="en">
      <body>
        <AudioPlayerProvider>
          <Header />
          <main className="min-h-screen pb-24">
            {children}
          </main>
          <AudioPlayer />
        </AudioPlayerProvider>
      </body>
    </html>
  );
}

