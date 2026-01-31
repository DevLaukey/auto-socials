"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  UserX,
  UserCheck,
  Calendar,
  CreditCard,
  Shield,
  ShieldOff,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/src/store/authStore";
import {
  AdminUser,
  Payment,
  listUsers,
  setUserStatus,
  extendSubscription,
  getUserPayments,
  promoteToAdmin,
  revokeAdmin,
} from "@/src/lib/admin";

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [extendDialog, setExtendDialog] = useState<AdminUser | null>(null);
  const [extendDays, setExtendDays] = useState("30");
  const [paymentsDialog, setPaymentsDialog] = useState<AdminUser | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Check admin access & load users only when confirmed admin
  useEffect(() => {
    if (authLoading) return;

    if (!user || !user.is_admin) {
      router.replace("/dashboard");
      return;
    }

    loadUsers();
  }, [authLoading, user, router]);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(targetUser: AdminUser) {
    setActionLoading(true);
    try {
      await setUserStatus(targetUser.id, !targetUser.is_active);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetUser.id ? { ...u, is_active: !u.is_active } : u
        )
      );
    } catch (err: any) {
      alert(err.message || "Failed to update user status");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleExtendSubscription() {
    if (!extendDialog) return;
    setActionLoading(true);
    try {
      await extendSubscription(extendDialog.id, parseInt(extendDays));
      await loadUsers();
      setExtendDialog(null);
      setExtendDays("30");
    } catch (err: any) {
      alert(err.message || "Failed to extend subscription");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleViewPayments(targetUser: AdminUser) {
    setPaymentsDialog(targetUser);
    setPaymentsLoading(true);
    try {
      const data = await getUserPayments(targetUser.id);
      setPayments(data);
    } catch (err: any) {
      alert(err.message || "Failed to load payments");
      setPaymentsDialog(null);
    } finally {
      setPaymentsLoading(false);
    }
  }

  async function handlePromoteAdmin(targetUser: AdminUser) {
    if (!confirm(`Promote ${targetUser.email} to admin?`)) return;
    setActionLoading(true);
    try {
      await promoteToAdmin(targetUser.id);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetUser.id ? { ...u, is_admin: true } : u
        )
      );
    } catch (err: any) {
      alert(err.message || "Failed to promote user");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRevokeAdmin(targetUser: AdminUser) {
    if (!confirm(`Revoke admin privileges from ${targetUser.email}?`)) return;
    setActionLoading(true);
    try {
      await revokeAdmin(targetUser.id);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetUser.id ? { ...u, is_admin: false } : u
        )
      );
    } catch (err: any) {
      alert(err.message || "Failed to revoke admin");
    } finally {
      setActionLoading(false);
    }
  }

  // Filter users by search
  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toString().includes(searchQuery)
  );

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user.is_admin) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">
          Manage users, subscriptions, and admin privileges
        </p>
      </div>

      {/* Search and Refresh */}
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search by email or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button
          variant="outline"
          onClick={loadUsers}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subscription
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Created
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{u.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={u.is_active ? "success" : "danger"}>
                        {u.is_active ? "Active" : "Suspended"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={u.is_admin ? "info" : "default"}>
                        {u.is_admin ? "Admin" : "User"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {u.subscription?.is_active ? (
                        <div>
                          <Badge variant="success">
                            {u.subscription.plan_name || "Active"}
                          </Badge>
                          {u.subscription.end_date && (
                            <p className="text-xs text-gray-500 mt-1">
                              Expires:{" "}
                              {new Date(u.subscription.end_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <Badge variant="default">None</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={actionLoading}>
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(u)}
                            className="cursor-pointer"
                          >
                            {u.is_active ? (
                              <>
                                <UserX size={14} className="mr-2" />
                                Suspend User
                              </>
                            ) : (
                              <>
                                <UserCheck size={14} className="mr-2" />
                                Activate User
                              </>
                            )}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => setExtendDialog(u)}
                            className="cursor-pointer"
                          >
                            <Calendar size={14} className="mr-2" />
                            Extend Subscription
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleViewPayments(u)}
                            className="cursor-pointer"
                          >
                            <CreditCard size={14} className="mr-2" />
                            View Payments
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {u.is_admin ? (
                            <DropdownMenuItem
                              onClick={() => handleRevokeAdmin(u)}
                              className="cursor-pointer text-red-600"
                              disabled={u.id === user?.id}
                            >
                              <ShieldOff size={14} className="mr-2" />
                              Revoke Admin
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handlePromoteAdmin(u)}
                              className="cursor-pointer"
                            >
                              <Shield size={14} className="mr-2" />
                              Promote to Admin
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Extend Subscription Dialog */}
      <Dialog open={!!extendDialog} onOpenChange={() => setExtendDialog(null)}>
        <DialogClose onClose={() => setExtendDialog(null)} />
        <DialogHeader>
          <DialogTitle>Extend Subscription</DialogTitle>
          <DialogDescription>
            Extend subscription for {extendDialog?.email}
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of days
          </label>
          <Input
            type="number"
            value={extendDays}
            onChange={(e) => setExtendDays(e.target.value)}
            min="1"
            placeholder="30"
          />
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setExtendDialog(null)}>
            Cancel
          </Button>
          <Button onClick={handleExtendSubscription} disabled={actionLoading}>
            {actionLoading ? "Extending..." : "Extend"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Payments Dialog */}
      <Dialog open={!!paymentsDialog} onOpenChange={() => setPaymentsDialog(null)}>
        <DialogClose onClose={() => setPaymentsDialog(null)} />
        <DialogHeader>
          <DialogTitle>Payment History</DialogTitle>
          <DialogDescription>
            Payments for {paymentsDialog?.email}
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          {paymentsLoading ? (
            <p className="text-gray-500 text-center py-4">Loading payments...</p>
          ) : payments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No payments found</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {payment.amount} {payment.currency}
                    </p>
                    <p className="text-xs text-gray-500">
                      {payment.plan_name || "N/A"} -{" "}
                      {new Date(payment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      payment.status === "completed" || payment.status === "succeeded"
                        ? "success"
                        : payment.status === "pending"
                        ? "warning"
                        : "danger"
                    }
                  >
                    {payment.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
        <DialogFooter>
          <Button onClick={() => setPaymentsDialog(null)}>Close</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
