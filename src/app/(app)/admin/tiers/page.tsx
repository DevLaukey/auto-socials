"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/src/store/authStore";
import {
  Plan,
  PlanInput,
  listPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "@/src/lib/admin";

const emptyForm: PlanInput = {
  name: "",
  price: 0,
  max_channels: 1,
  posts_per_day: 10,
  comments_per_day: 10,
  dms_per_day: 10,
};

export default function AdminTiersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Dialog states
  const [formDialog, setFormDialog] = useState<"create" | Plan | null>(null);
  const [form, setForm] = useState<PlanInput>(emptyForm);
  const [deleteDialog, setDeleteDialog] = useState<Plan | null>(null);

  // Check admin access & load plans
  useEffect(() => {
    if (authLoading) return;

    if (!user || !user.is_admin) {
      router.replace("/dashboard");
      return;
    }

    loadPlans();
  }, [authLoading, user, router]);

  async function loadPlans() {
    setLoading(true);
    setError(null);
    try {
      const data = await listPlans();
      setPlans(data);
    } catch (err: any) {
      setError(err.message || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(emptyForm);
    setFormDialog("create");
  }

  function openEdit(plan: Plan) {
    setForm({
      name: plan.name,
      price: plan.price,
      max_channels: plan.max_channels,
      posts_per_day: plan.posts_per_day,
      comments_per_day: plan.comments_per_day,
      dms_per_day: plan.dms_per_day,
    });
    setFormDialog(plan);
  }

  async function handleSubmit() {
    setActionLoading(true);
    try {
      if (formDialog === "create") {
        const created = await createPlan(form);
        setPlans((prev) => [...prev, created]);
      } else if (formDialog) {
        const updated = await updatePlan(formDialog.id, form);
        setPlans((prev) =>
          prev.map((p) => (p.id === formDialog.id ? updated : p))
        );
      }
      setFormDialog(null);
    } catch (err: any) {
      alert(err.message || "Failed to save plan");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteDialog) return;
    setActionLoading(true);
    try {
      await deletePlan(deleteDialog.id);
      setPlans((prev) => prev.filter((p) => p.id !== deleteDialog.id));
      setDeleteDialog(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete plan");
    } finally {
      setActionLoading(false);
    }
  }

  const filteredPlans = plans.filter(
    (p) =>
      (p.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toString().includes(searchQuery)
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

  const isEditing = formDialog !== null && formDialog !== "create";

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tier Management</h1>
        <p className="text-gray-600 mt-1">
          Manage subscription tiers and their limits
        </p>
      </div>

      {/* Search, Create, and Refresh */}
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={openCreate}>
          <Plus size={16} />
          <span className="ml-2">Create Tier</span>
        </Button>
        <Button variant="outline" onClick={loadPlans} disabled={loading}>
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Plans Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Channels
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Posts/day
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Comments/day
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  DMs/day
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Loading plans...
                  </td>
                </tr>
              ) : filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No plans found
                  </td>
                </tr>
              ) : (
                filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{plan.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {plan.name}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="info">${plan.price}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {plan.max_channels}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {plan.posts_per_day}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {plan.comments_per_day}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {plan.dms_per_day}
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
                            onClick={() => openEdit(plan)}
                            className="cursor-pointer"
                          >
                            <Pencil size={14} className="mr-2" />
                            Edit Tier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteDialog(plan)}
                            className="cursor-pointer text-red-600"
                          >
                            <Trash2 size={14} className="mr-2" />
                            Delete Tier
                          </DropdownMenuItem>
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

      {/* Create / Edit Dialog */}
      <Dialog open={!!formDialog} onOpenChange={() => setFormDialog(null)}>
        <DialogClose onClose={() => setFormDialog(null)} />
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Tier" : "Create Tier"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the tier details below"
              : "Fill in the details to create a new tier"}
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Pro, Business"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: parseFloat(e.target.value) || 0 })
                }
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Channels
              </label>
              <Input
                type="number"
                value={form.max_channels}
                onChange={(e) =>
                  setForm({ ...form, max_channels: parseInt(e.target.value) || 0 })
                }
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posts per Day
              </label>
              <Input
                type="number"
                value={form.posts_per_day}
                onChange={(e) =>
                  setForm({ ...form, posts_per_day: parseInt(e.target.value) || 0 })
                }
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments per Day
              </label>
              <Input
                type="number"
                value={form.comments_per_day}
                onChange={(e) =>
                  setForm({
                    ...form,
                    comments_per_day: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DMs per Day
              </label>
              <Input
                type="number"
                value={form.dms_per_day}
                onChange={(e) =>
                  setForm({ ...form, dms_per_day: parseInt(e.target.value) || 0 })
                }
                min="0"
              />
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setFormDialog(null)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={actionLoading || !form.name}>
            {actionLoading
              ? "Saving..."
              : isEditing
              ? "Save Changes"
              : "Create Tier"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogClose onClose={() => setDeleteDialog(null)} />
        <DialogHeader>
          <DialogTitle>Delete Tier</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the &quot;{deleteDialog?.name}&quot; tier?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteDialog(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={actionLoading}
          >
            {actionLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
