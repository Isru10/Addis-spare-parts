// // src/components/layout/Navbar.tsx

// "use client";

// import Link from "next/link";
// import { Menu, Search, ShoppingCart, User } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger
// } from "@/components/ui/sheet";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "../ui/input";
// import { useSession, signOut } from "next-auth/react";
// import { useAppSelector } from "@/redux/hooks";
// import { Badge } from "../ui/badge";

// export default function Navbar() {
//   const { data: session, status } = useSession();
//   const isAuthenticated = status === "authenticated";
//   const cartItemCount = useAppSelector((state) => 
//     state.cart.items.reduce((total, item) => total + item.quantity, 0)
//   );

//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container flex h-16 items-center justify-between">
//         {/* Mobile Menu */}
//         <div className="md:hidden">
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="ghost" size="icon">
//                 <Menu className="h-6 w-6" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="left">
//               <SheetHeader>
//                 <SheetTitle>Main Menu</SheetTitle>
//               </SheetHeader>
//               <nav className="grid gap-4 text-lg font-medium mt-6">
//                 <Link href="/" className="hover:text-foreground/80">Home</Link>
//                 <Link href="/products" className="hover:text-foreground/80">All Parts</Link>
//                 <Link href="/about" className="hover:text-foreground/80">About Us</Link>
//               </nav>
//             </SheetContent>
//           </Sheet>
//         </div>

//         {/* Logo */}
//         <Link href="/" className="hidden md:flex items-center gap-2">
//           <span className="text-xl font-bold">Addis Parts</span>
//         </Link>

//         {/* Desktop Navigation & Search */}
//         <div className="hidden md:flex flex-1 items-center justify-center gap-6">
//           <nav className="flex items-center gap-6 text-sm font-medium">
//             <Link href="/" className="hover:text-foreground/80 transition-colors">Home</Link>
//             <Link href="/products" className="hover:text-foreground/80 transition-colors">All Parts</Link>
//           </nav>
//           <div className="relative w-full max-w-sm">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               type="search"
//               placeholder="Search products..."
//               className="pl-8 sm:w-full"
//             />
//           </div>
//         </div>

//         {/* Actions: Cart and Profile */}
//         <div className="flex items-center gap-4">
//           <Link href="/cart" className="relative">
//             <Button variant="ghost" size="icon">
//               <ShoppingCart className="h-6 w-6" />
//               <span className="sr-only">Cart</span>
//             </Button>
//             {cartItemCount > 0 && (
//               <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-1">
//                 {cartItemCount}
//               </Badge>
//             )}
//           </Link>
          
//           {isAuthenticated ? (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon">
//                    <User className="h-6 w-6" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem asChild>
//                   <Link href="/profile">Profile</Link>
//                 </DropdownMenuItem>
                
//                 {/* Conditionally render admin links based on user role */}
//                 {(session.user.role === 'admin' || session.user.role === 'superadmin') && (
//                   <DropdownMenuItem asChild>
//                     <Link href="/admin">Admin Dashboard</Link>
//                   </DropdownMenuItem>
//                 )}
//                 {session.user.role === 'superadmin' && (
//                    <DropdownMenuItem asChild>
//                     <Link href="/superadmin">Super Admin</Link>
//                   </DropdownMenuItem>
//                 )}

//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onSelect={() => signOut({ callbackUrl: '/' })}>
//                   Logout
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           ) : (
//              <Link href="/login">
//                 <Button>Login</Button>
//              </Link>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }





"use client";

import Link from "next/link";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "../ui/input";
import { useSession, signOut } from "next-auth/react";
import { useAppSelector } from "@/redux/hooks";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  
  // 1. Add a state to track if we are on the client
  const [isMounted, setIsMounted] = useState(false);

  const cartItemCount = useAppSelector((state) => 
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  // 2. Set isMounted to true only after the component mounts (client-side)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Main Menu</SheetTitle>
              </SheetHeader>
              <nav className="grid gap-4 text-lg font-medium mt-6">
                <Link href="/" className="hover:text-foreground/80">Home</Link>
                <Link href="/products" className="hover:text-foreground/80">All Parts</Link>
                <Link href="/about" className="hover:text-foreground/80">About Us</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link href="/" className="hidden md:flex items-center gap-2">
          <span className="text-xl font-bold">Addis Parts</span>
        </Link>

        {/* Desktop Navigation & Search */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-foreground/80 transition-colors">Home</Link>
            <Link href="/products" className="hover:text-foreground/80 transition-colors">All Parts</Link>
          </nav>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-full"
            />
          </div>
        </div>

        {/* Actions: Cart and Profile */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-6 w-6" />
              <span className="sr-only">Cart</span>
            </Button>
            {/* 3. Only render the Badge if mounted AND count > 0 */}
            {isMounted && cartItemCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-1">
                {cartItemCount}
              </Badge>
            )}
          </Link>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                   <User className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                
                {/* Conditionally render admin links based on user role */}
                {(session.user.role === 'admin' || session.user.role === 'superadmin') && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                {session.user.role === 'superadmin' && (
                   <DropdownMenuItem asChild>
                    <Link href="/superadmin">Super Admin</Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => signOut({ callbackUrl: '/' })}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Link href="/login">
                <Button>Login</Button>
             </Link>
          )}
        </div>
      </div>
    </header>
  );
}