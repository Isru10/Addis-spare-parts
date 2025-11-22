// src/app/admin/layout.tsx
import Link from "next/link";
import { BaggageClaim, BarChart4, ChevronRight, LayoutDashboard, ShoppingBag, UserCircle } from "lucide-react";
import { ReactNode } from "react";

// This is a Server Component, protected by the middleware we already built.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 flex-shrink-0 border-r bg-muted/40 hidden md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <BaggageClaim className="h-6 w-6" />
              <span>Admin Panel</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-auto py-4 px-4 text-sm font-medium">
            <ul className="flex flex-col gap-2">
              <li><AdminNavLink href="/admin"><LayoutDashboard className="h-4 w-4" /> Dashboard</AdminNavLink></li>
              <li><AdminNavLink href="/admin/products"><ShoppingBag className="h-4 w-4" /> Products</AdminNavLink></li>
              <li><AdminNavLink href="/admin/orders"><BaggageClaim className="h-4 w-4" /> Orders</AdminNavLink></li>
              <li><AdminNavLink href="/admin/categories"><ChevronRight className="h-4 w-4" /> Categories</AdminNavLink></li>
              <li><AdminNavLink href="/superadmin"><UserCircle className="h-4 w-4" /> Super Admin</AdminNavLink></li>
            </ul>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-6 bg-muted/20">
        {children}
      </main>
    </div>
  );
}

// A simple helper component for navigation links
function AdminNavLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
      {children}
    </Link>
  );
}