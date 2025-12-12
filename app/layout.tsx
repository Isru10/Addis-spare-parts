


// // src/app/layout.tsx

// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { cn } from "@/lib/utils";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import { ReduxProvider } from "@/redux/ReduxProvider"; 
// import CartPersistence from "@/redux/CartPersistence"; 
// import SessionProviderWrapper from "@/lib/SessionProviderWrapper";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Addis Spare Parts",
//   description: "High-performance ecommerce for car spare parts.",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body
//         className={cn(
//           "min-h-screen bg-background font-sans antialiased flex flex-col",
//           // FIX IS HERE:
//           // 1. mx-auto: Centers the body in the viewport
//           // 2. w-full: Ensures it takes up space
//           // 3. max-w-[1920px]: Stops the site from stretching too wide on 4k screens
//           // 4. shadow-xl: Optional, adds a nice shadow on the sides on huge screens to separate it from the browser background
//           "mx-auto w-full max-w-[1920px] shadow-2xl" 
//         )}
//       >
//         <SessionProviderWrapper> 
//         <ReduxProvider> 
//           <CartPersistence/>
//           <Navbar />
//           <main className="flex-grow w-full">{children}</main>
//           <Footer />
//         </ReduxProvider>
//         </SessionProviderWrapper>
//       </body>
//     </html>
//   );
// }




import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ReduxProvider } from "@/redux/ReduxProvider";
import CartPersistence from "@/redux/CartPersistence";
import SessionProviderWrapper from "@/lib/SessionProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Addis Spare Parts",
  description: "High-performance ecommerce for car spare parts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          "mx-auto w-full max-w-[1920px] shadow-2xl" 
        )}
      >
        <SessionProviderWrapper> 
          <ReduxProvider> 
            <CartPersistence/>
            {/* NO NAVBAR HERE */}
            {children}
            {/* NO FOOTER HERE */}
          </ReduxProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}