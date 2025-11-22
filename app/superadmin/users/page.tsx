// src/app/superadmin/users/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import UserRoleChanger from "./UserRoleChanger";
import { IUser } from "@/types/next-auth";

async function getUsers() {
  await dbConnect();
  // We need to use our IUser type
  const users = await User.find({}).sort({ createdAt: -1 }).lean<IUser[]>();
  return users;
}

export default async function UserManagementPage() {
  const users = await getUsers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Registered On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <UserRoleChanger userId={user._id} currentRole={user.role} />
                </TableCell>
                <TableCell>{new Date(user.createdAt!).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}