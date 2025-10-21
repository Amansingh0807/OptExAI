import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { LoadingProvider } from "@/components/loading-provider";
import { CurrencyProvider } from "@/components/currency-provider";
import { getUserCurrency } from "@/actions/currency";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OptEx",
  description: "One stop Finance Platform",
};

export default async function RootLayout({ children }) {
  // Get user's currency preference
  const userCurrencyData = await getUserCurrency();
  const userCurrency = userCurrencyData?.currency || "USD";

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
            <CurrencyProvider currency={userCurrency}>
              <LoadingProvider>
                <Header />
                <main className="min-h-screen">{children}</main>
                <Toaster richColors />
                <Footer />
              </LoadingProvider>
            </CurrencyProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
