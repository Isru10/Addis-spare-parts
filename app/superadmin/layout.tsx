// src/app/superadmin/layout.tsx
import Link from "next/link";
import { BaggageClaim, BarChart4, ChevronRight, LayoutDashboard, ShoppingBag, UserCircle, Users } from "lucide-react";
import { ReactNode } from "react";

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 flex-shrink-0 border-r bg-muted/40 hidden md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/superadmin" className="flex items-center gap-2 font-semibold">
              <UserCircle className="h-6 w-6" />
              <span>Super Admin</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-auto py-4 px-4 text-sm font-medium">
            <ul className="flex flex-col gap-2">
              <li><SuperAdminNavLink href="/superadmin"><BarChart4 className="h-4 w-4" /> Site Analytics</SuperAdminNavLink></li>
              <li><SuperAdminNavLink href="/superadmin/users"><Users className="h-4 w-4" /> User Management</SuperAdminNavLink></li>
              <li className="mt-4 border-t pt-4"><SuperAdminNavLink href="/admin"><LayoutDashboard className="h-4 w-4" /> Back to Admin</SuperAdminNavLink></li>
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

function SuperAdminNavLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
      {children}
    </Link>
  );
}