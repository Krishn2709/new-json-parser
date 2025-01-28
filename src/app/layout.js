"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { store } from "@/lib/store/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Toaster position="top-right" />
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
