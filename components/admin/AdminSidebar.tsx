"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Users, 
  Settings, 
  ChevronUp, 
  ChevronDown,
  LogOut,
  Store,
  Plane,
  MessageSquare
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Sidebar collapsible="icon">
      {/* HEADER: Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Store className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Addis Parts</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        
        {/* GROUP 1: Overview */}
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin"}>
                  <Link href="/admin">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/requests/orders"}>
                  <Link href="/admin/requests/orders">
                    <Plane />
                    <span>Special Preorders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>




              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/requests"}>
                  <Link href="/admin/requests">
                    <Plane />
                    <span>Special Requests</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

            

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/orders"}>
                  <Link href="/admin/orders">
                    <ShoppingCart />
                    <span>Orders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        {/* My group for orders and preorders */}

         <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Orders and Preorders
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  

                  {/* pre requests */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/requests")}>
                      <Link href="/admin/requests">
                        <MessageSquare />
                        <span>Special Requests</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>



                  
                  {/* preorders */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/requests/orders")}>
                      <Link href="/admin/requests/orders">
                        <Plane />
                        <span>Preorders</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>



                    {/* orders */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/orders")}>
                      <Link href="/admin/orders">
                      <ShoppingCart />

                        <span>Orders</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* GROUP 2: Inventory (Collapsible) */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Inventory
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  
                  {/* Products */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/products")}>
                      <Link href="/admin/products">
                        <Package />
                        <span>Products</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Categories */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/categories")}>
                      <Link href="/admin/categories">
                        <Tags />
                        <span>Categories</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* GROUP 3: Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/superadmin")}>
                  <Link href="/admin/users"> 
                    <Users />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/profile"}>
                  <Link href="/profile">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* FOOTER: User Profile & Logout */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                        {session?.user?.name?.substring(0, 2).toUpperCase() || "AD"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{session?.user?.name || "Admin"}</span>
                    <span className="truncate text-xs">{session?.user?.email || ""}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem asChild>
                    <Link href="/profile">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => signOut({ callbackUrl: '/' })} className="text-red-500">
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