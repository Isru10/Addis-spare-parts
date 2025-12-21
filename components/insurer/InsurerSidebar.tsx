// "use client";

// import React from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { signOut, useSession } from "next-auth/react";
// import { 
//   LayoutDashboard, 
//   FileText, 
//   FileCheck2, 
//   History, 
//   Settings, 
//   LogOut, 
//   ChevronUp, 
//   Briefcase
// } from "lucide-react";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarSeparator,
// } from "@/components/ui/sidebar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// const items = [
//   {
//     title: "Overview",
//     url: "/insurer/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     title: "New Request",
//     url: "/insurer/requests/new",
//     icon: FileText,
//   },
//   {
//     title: "Active Claims",
//     url: "/insurer/requests",
//     icon: FileCheck2,
//   },
//   {
//     title: "History",
//     url: "/insurer/history",
//     icon: History,
//   },
// ];

// export function InsurerSidebar() {
//   const pathname = usePathname();
//   const { data: session } = useSession();

//   return (
//     <Sidebar collapsible="icon">
//       {/* HEADER: Corporate Identity */}
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton size="lg" asChild>
//               <Link href="/insurer/dashboard">
//                 <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-900 text-white">
//                   <Briefcase className="size-4" />
//                 </div>
//                 <div className="grid flex-1 text-left text-sm leading-tight">
//                   <span className="truncate font-semibold">Insurance Portal</span>
//                   <span className="truncate text-xs">Partner Access</span>
//                 </div>
//               </Link>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>

//       <SidebarSeparator />

//       {/* CONTENT: Workflow Links */}
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>Claims Management</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {items.map((item) => {
//                 const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);
//                 return (
//                   <SidebarMenuItem key={item.title}>
//                     <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
//                       <Link href={item.url}>
//                         <item.icon />
//                         <span>{item.title}</span>
//                       </Link>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                 );
//               })}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         <SidebarGroup className="mt-auto">
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <SidebarMenuItem>
//                 <SidebarMenuButton asChild tooltip="Settings">
//                   <Link href="/insurer/settings">
//                     <Settings />
//                     <span>Company Profile</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>

//       {/* FOOTER: Agent Profile */}
//       <SidebarFooter>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <SidebarMenuButton
//                   size="lg"
//                   className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
//                 >
//                   <Avatar className="h-8 w-8 rounded-lg bg-blue-100 text-blue-900">
//                     <AvatarFallback>
//                         {session?.user?.name?.substring(0, 2).toUpperCase() || "AG"}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="grid flex-1 text-left text-sm leading-tight">
//                     <span className="truncate font-semibold">{session?.user?.name || "Agent"}</span>
//                     <span className="truncate text-xs">Authorized Officer</span>
//                   </div>
//                   <ChevronUp className="ml-auto size-4" />
//                 </SidebarMenuButton>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent
//                 side="top"
//                 className="w-[--radix-popper-anchor-width]"
//               >
//                 <DropdownMenuItem asChild>
//                     <Link href="/profile">My Account</Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onSelect={() => signOut({ callbackUrl: '/' })} className="text-red-600 focus:text-red-600">
//                   <LogOut className="mr-2 h-4 w-4" /> Sign out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarFooter>
//     </Sidebar>
//   );
// }
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  LayoutDashboard, FileText, FileCheck2, History, Settings, LogOut, ChevronUp, Briefcase
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const items = [
  { title: "Overview", url: "/insurer/dashboard", icon: LayoutDashboard },
  { title: "New Request", url: "/insurer/requests/new", icon: FileText },
  { title: "Active Claims", url: "/insurer/requests", icon: FileCheck2 },
  // { title: "History", url: "/insurer/history", icon: History },
];

export function InsurerSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/insurer/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-900 text-white">
                  <Briefcase className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Insurance Portal</span>
                  <span className="truncate text-xs">Partner Access</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Claims Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                // FIXED LOGIC: Strict separation
                let isActive = false;
                
                if (item.url === "/insurer/requests/new") {
                   // Exact match only for "New"
                   isActive = pathname === "/insurer/requests/new";
                } else if (item.url === "/insurer/requests") {
                   // Match "Active Claims" BUT exclude "New"
                   isActive = pathname.startsWith("/insurer/requests") && pathname !== "/insurer/requests/new";
                } else {
                   // Exact match for Dashboard/History
                   isActive = pathname === item.url;
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Group */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/insurer/settings"} tooltip="Settings">
                  <Link href="/insurer/settings">
                    <Settings />
                    <span>Company Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <Avatar className="h-8 w-8 rounded-lg bg-blue-100 text-blue-900">
                    <AvatarFallback>{session?.user?.name?.substring(0, 2).toUpperCase() || "AG"}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{session?.user?.name || "Agent"}</span>
                    <span className="truncate text-xs">Authorized Officer</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem asChild><Link href="/profile">My Account</Link></DropdownMenuItem>
                <DropdownMenuItem onSelect={() => signOut({ callbackUrl: '/' })} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}