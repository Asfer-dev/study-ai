import type { Metadata } from "next";
import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import Providers from "@/components/Providers";
import MainSidebar from "@/components/MainSidebar";
import PageContainer from "@/components/PageContainer";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "study.ai - Learn and fun together",
  description: "A Collaborative Learning Educational Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <main className="relative flex roboto-regular">
            <MainSidebar />
            <PageContainer>{children}</PageContainer>
          </main>
        </Providers>
      </body>
    </html>
  );
}
