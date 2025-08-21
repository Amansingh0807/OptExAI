import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { LoadingProvider } from "@/components/loading-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OptEx",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.png" sizes="150x150" />
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <LoadingProvider>
              <Header />
              <main className="min-h-screen">{children}</main>
              <Toaster richColors />
              <footer className="bg-black py-6">
                <div className="container mx-auto px-4 text-center text-white">
                  <p>© 2025 OptEx | All Rights Reserved.</p>
                </div>
              </footer>
            </LoadingProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
