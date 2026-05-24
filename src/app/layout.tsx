import type { Metadata } from "next";
import { Inter, Playfair_Display, Cinzel, Cormorant_Garamond, Roboto } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "VibhavReddy Birthday",
  description: "A cinematic journey through Vibhav Reddy's first 12 months.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${cinzel.variable} ${cormorant.variable} ${roboto.variable} scroll-smooth`}
    >
      <body className="antialiased selection:bg-pink-100">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
