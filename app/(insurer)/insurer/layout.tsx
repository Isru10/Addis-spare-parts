// src/app/(insurer)/insurer/layout.tsx

import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { InsurerSidebar } from "@/components/insurer/InsurerSidebar";
import { getCurrentUser } from "@/lib/session";
import dbConnect from "@/lib/mongodb";
import InsurerProfile from "@/models/InsurerProfile";

// FIX: Ensure 'export default' is present and it's an async function (server component)
export default async function InsurerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/insurer/dashboard");
  }

  if (user.role !== 'insurer' && user.role !== 'admin' && user.role !== 'superadmin') {
    await dbConnect();
    const profile = await InsurerProfile.findOne({ userId: user.id });
    
    if (!profile) redirect("/insurer/register");
    if (profile.status === 'Pending') redirect("/insurer/pending");
    if (profile.status === 'Rejected') redirect("/"); 

    if (profile.status === 'Suspended') redirect("/insurer/suspended");
    if (profile.status !== 'Approved') redirect("/insurer/suspended");

    
  }

  return (
    <SidebarProvider>
      <InsurerSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/insurer/dashboard" className="font-semibold text-blue-900">
                    Proforma System
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-8 bg-slate-50 h-full overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}