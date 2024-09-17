import type { Metadata } from "next";
import localFont from "next/font/local";
import { ConvexClientProvider } from "./ConvexClientProvider";
import "./globals.css";
import Script from "next/script";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Flowchart Manager",
  description: "A context flowchart manager built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} ${geistMono.className} antialiased`}
        style={{ margin: 0, padding: 0, overflow: 'hidden' }}
      >
        <ConvexClientProvider>{children}</ConvexClientProvider>
        <Script id="prevent-zoom" strategy="afterInteractive">
          {`
            document.addEventListener('gesturestart', function(e) {
              e.preventDefault();
              document.body.style.zoom = 1;
            });
          `}
        </Script>
      </body>
    </html>
  );
}
