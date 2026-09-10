import type { Metadata, Viewport } from "next";
import { Playfair_Display, Great_Vibes, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Jéssica & Willian | 24 de abril de 2027",
  description:
    "Confirme presença e acompanhe todos os detalhes do casamento de Jéssica Andrioli e Willian Meirelles, 24 de abril de 2027.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5efe4",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${greatVibes.variable} ${inter.variable}`}
    >
      <body>
        <div id="site-content">{children}</div>
      </body>
    </html>
  );
}
