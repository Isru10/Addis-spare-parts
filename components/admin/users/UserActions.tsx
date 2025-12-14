"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Shield, ShieldOff, Trash2 } from "lucide-react";
import { updateUserRole, deleteUser } from "@/app/(admin)/admin/users/actions";

interface UserActionsProps {
  targetUser: { _id: string; role: string; name: string };
  currentUserRole: string; // 'admin' | 'superadmin'
}

export default function UserActions({ targetUser, currentUserRole }: UserActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // FIX: Allow Admins to manage any non-staff user
  const canManage = () => {
    if (currentUserRole === 'superadmin') return true;
    if (currentUserRole === 'admin') {
      return targetUser.role !== 'admin' && targetUser.role !== 'superadmin';
    }
    return false;
  };

  if (!canManage()) return <span className="text-xs text-muted-foreground italic">No actions</span>;

  const handleRoleChange = (newRole: string) => {
    if (confirm(`Change ${targetUser.name}'s role to ${newRole}?`)) {
      startTransition(async () => {
        await updateUserRole(targetUser._id, newRole);
        router.refresh();
      });
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${targetUser.name}? This cannot be undone.`)) {
      startTransition(async () => {
        await deleteUser(targetUser._id);
        router.refresh();
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Manage User</DropdownMenuLabel>
        
        {/* Only Superadmin can promote/demote staff */}
        {currentUserRole === 'superadmin' && (
          <>
            {(targetUser.role !== 'admin' && targetUser.role !== 'superadmin') && (
              <DropdownMenuItem onClick={() => handleRoleChange('admin')}>
                <Shield className="mr-2 h-4 w-4 text-blue-600" /> Promote to Admin
              </DropdownMenuItem>
            )}
            {targetUser.role === 'admin' && (
              <DropdownMenuItem onClick={() => handleRoleChange('user')}>
                <ShieldOff className="mr-2 h-4 w-4" /> Demote to User
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
          <Trash2 className="mr-2 h-4 w-4" /> Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}