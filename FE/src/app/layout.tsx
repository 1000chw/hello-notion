import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthHashRedirect from "@/components/AuthHashRedirect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hello Notion — 노션을 더 강력하게 만드는 위젯",
  description:
    "링크 하나로 노션에 바로 임베딩. 시계, 달력, 날씨, 포모도로 등 무료 위젯 20개 이상.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthHashRedirect />
        {children}
      </body>
    </html>
  );
}
