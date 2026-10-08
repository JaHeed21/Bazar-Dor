import type { Metadata } from "next";
import { Tiro_Bangla } from "next/font/google";
import "./globals.css";

const tiroBangla = Tiro_Bangla({
  weight: "400",
  subsets: ["bengali"],
  variable: "--font-tiro-bangla",
});

export const metadata: Metadata = {
  title: "Bazar Dor",
  description: "Bazar Dor Application",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bn"
      className={`${tiroBangla.variable} h-full antialiased`}
    >
      <body className={`${tiroBangla.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}

