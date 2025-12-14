import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/session";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AdminSearch from "@/components/admin/AdminSearch";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import UserActions from "@/components/admin/users/UserActions"; // We'll build this

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 10;

async function getUsers(page: number, query: string) {
  await dbConnect();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: any = {};
  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ];
  }

  const skip = (page - 1) * ITEMS_PER_PAGE;

  const usersPromise = User.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(ITEMS_PER_PAGE)
    .select("-password") // Exclude password hash
    .lean();

  const countPromise = User.countDocuments(filter);

  const [users, count] = await Promise.all([usersPromise, countPromise]);
  
  return {
    users: JSON.parse(JSON.stringify(users)),
    totalPages: Math.ceil(count / ITEMS_PER_PAGE)
  };
}

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const query = params.q || "";

  const { users, totalPages } = await getUsers(page, query);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage customers and staff access.</p>
        </div>
        <AdminSearch placeholder="Search name or email..." />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {users.map((user: any) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant={user.role === 'customer' ? 'secondary' : 'default'}>
                      {user.role}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right">
                    {/* Only show actions if NOT self */}
                    {user._id !== currentUser.id && (
                      <UserActions targetUser={user} currentUserRole={currentUser.role} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              {page > 1 ? (
                <PaginationItem>
                  <PaginationPrevious href={`?page=${page - 1}&q=${query}`} />
                </PaginationItem>
              ) : null}
              <PaginationItem>
                <span className="px-4 text-sm font-medium">Page {page} of {totalPages}</span>
              </PaginationItem>
              {page < totalPages ? (
                <PaginationItem>
                  <PaginationNext href={`?page=${page + 1}&q=${query}`} />
                </PaginationItem>
              ) : null}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}