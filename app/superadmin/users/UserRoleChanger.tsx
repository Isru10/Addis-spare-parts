// src/app/superadmin/users/UserRoleChanger.tsx
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransition } from "react";
import { updateUserRole } from "./actions";
import { useSession } from "next-auth/react";

interface UserRoleChangerProps {
  userId: string;
  currentRole: "user" | "admin" | "superadmin";
}

export default function UserRoleChanger({ userId, currentRole }: UserRoleChangerProps) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (newRole: "user" | "admin") => {
    // Optimistic UI update could be added here
    startTransition(async () => {
      await updateUserRole(userId, newRole);
      // Can add a toast notification on success/error here
    });
  };

  // A superadmin cannot be demoted through this UI
  if (currentRole === 'superadmin') {
    return <span>Super Admin</span>;
  }
  
  // Prevent a superadmin from demoting themselves
  const isSelf = session?.user?.id === userId;

  return (
    <Select
      defaultValue={currentRole}
      onValueChange={handleRoleChange}
      disabled={isPending || isSelf}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="user">User</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}