import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/header';
import { CartProvider } from '@/components/cart-provider';
import { AuthProvider } from '@/components/auth-provider';
import { ApolloWrapper } from '@/components/apollo-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Modern Store - Your Premium Shopping Destination',
  description: 'Discover our curated collection of premium products',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ApolloWrapper>
            <AuthProvider>
              <CartProvider>
                <div className="min-h-screen bg-background">
                  <Header />
                  <main>{children}</main>
                  <Toaster />
                </div>
              </CartProvider>
            </AuthProvider>
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}