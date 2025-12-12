// // src/app/admin/layout.tsx
// import Link from "next/link";
// import { BaggageClaim, BarChart4, ChevronRight, LayoutDashboard, ShoppingBag, UserCircle } from "lucide-react";
// import { ReactNode } from "react";

// // This is a Server Component, protected by the middleware we already built.
// export default function AdminLayout({ children }: { children: ReactNode }) {
//   return (
//     <div className="flex min-h-screen">
//       <aside className="w-64 flex-shrink-0 border-r bg-muted/40 hidden md:block">
//         <div className="flex h-full max-h-screen flex-col gap-2">
//           <div className="flex h-16 items-center border-b px-6">
//             <Link href="/admin" className="flex items-center gap-2 font-semibold">
//               <BaggageClaim className="h-6 w-6" />
//               <span>Admin Panel</span>
//             </Link>
//           </div>
//           <nav className="flex-1 overflow-auto py-4 px-4 text-sm font-medium">
//             <ul className="flex flex-col gap-2">
//               <li><AdminNavLink href="/admin"><LayoutDashboard className="h-4 w-4" /> Dashboard</AdminNavLink></li>
//               <li><AdminNavLink href="/admin/products"><ShoppingBag className="h-4 w-4" /> Products</AdminNavLink></li>
//               <li><AdminNavLink href="/admin/orders"><BaggageClaim className="h-4 w-4" /> Orders</AdminNavLink></li>
//               <li><AdminNavLink href="/admin/categories"><ChevronRight className="h-4 w-4" /> Categories</AdminNavLink></li>
//               <li><AdminNavLink href="/superadmin"><UserCircle className="h-4 w-4" /> Super Admin</AdminNavLink></li>
//             </ul>
//           </nav>
//         </div>
//       </aside>
//       <main className="flex-1 p-6 bg-muted/20">
//         {children}
//       </main>
//     </div>
//   );
// }

// // A simple helper component for navigation links
// function AdminNavLink({ children, href }: { children: ReactNode; href: string }) {
//   return (
//     <Link href={href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
//       {children}
//     </Link>
//   );
// }


import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        {/* Header Strip with Trigger */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-background sticky top-0 z-10">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 bg-muted/10 h-full overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}