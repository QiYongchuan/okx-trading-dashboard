import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OKX Trading Dashboard",
  description: "AI 模拟盘交易监控",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}
