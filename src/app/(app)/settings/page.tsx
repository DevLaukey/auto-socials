"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Power,
  PowerOff,
  RefreshCw,
  Globe,
  Eye,
  EyeOff,
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
  Proxy,
  CreateProxyData,
  listProxies,
  createProxy,
  activateProxy,
  deactivateProxy,
  removeProxy,
} from "@/src/lib/proxies";

export default function SettingsPage() {
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Add proxy dialog
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newProxy, setNewProxy] = useState<CreateProxyData>({
    host: "",
    port: 8080,
    username: "",
    password: "",
    protocol: "http",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadProxies();
  }, []);

  async function loadProxies() {
    setLoading(true);
    setError(null);
    try {
      const data = await listProxies();
      setProxies(data);
    } catch (err: any) {
      setError(err.message || "Failed to load proxies");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddProxy() {
    if (!newProxy.host || !newProxy.port) {
      return;
    }

    setActionLoading(true);
    try {
      const created = await createProxy({
        host: newProxy.host,
        port: newProxy.port,
        protocol: newProxy.protocol,
        username: newProxy.username || undefined,
        password: newProxy.password || undefined,
      });
      setProxies((prev) => [...prev, created]);
      setShowAddDialog(false);
      setNewProxy({
        host: "",
        port: 8080,
        username: "",
        password: "",
        protocol: "http",
      });
    } catch (err: any) {
      alert(err.message || "Failed to add proxy");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleToggleProxy(proxy: Proxy) {
    setActionLoading(true);
    try {
      if (proxy.is_active) {
        await deactivateProxy(proxy.id);
      } else {
        await activateProxy(proxy.id);
      }
      setProxies((prev) =>
        prev.map((p) =>
          p.id === proxy.id ? { ...p, is_active: !p.is_active } : p
        )
      );
    } catch (err: any) {
      alert(err.message || "Failed to update proxy");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRemoveProxy(proxy: Proxy) {
    if (!confirm(`Remove proxy ${proxy.host}:${proxy.port}?`)) return;

    setActionLoading(true);
    try {
      await removeProxy(proxy.id);
      setProxies((prev) => prev.filter((p) => p.id !== proxy.id));
    } catch (err: any) {
      alert(err.message || "Failed to remove proxy");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your application settings</p>
      </div>

      {/* Proxies Section */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="text-gray-500" size={20} />
            <div>
              <h2 className="font-semibold text-gray-900">Proxies</h2>
              <p className="text-sm text-gray-500">
                Manage proxy servers for your requests
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadProxies}
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </Button>
            <Button size="sm" onClick={() => setShowAddDialog(true)}>
              <Plus size={14} />
              <span className="ml-1">Add Proxy</span>
            </Button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-gray-500 text-center py-8">Loading proxies...</p>
          ) : proxies.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500">No proxies configured</p>
              <p className="text-sm text-gray-400 mt-1">
                Add a proxy to route your requests
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {proxies.map((proxy) => (
                <div
                  key={proxy.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        proxy.is_active ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {proxy.host}:{proxy.port}
                        </span>
                        <Badge variant="default">{proxy.protocol}</Badge>
                        <Badge
                          variant={proxy.is_active ? "success" : "default"}
                        >
                          {proxy.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {proxy.username && (
                        <p className="text-sm text-gray-500 mt-0.5">
                          Auth: {proxy.username}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleProxy(proxy)}
                      disabled={actionLoading}
                      title={proxy.is_active ? "Deactivate" : "Activate"}
                    >
                      {proxy.is_active ? (
                        <PowerOff size={14} />
                      ) : (
                        <Power size={14} />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveProxy(proxy)}
                      disabled={actionLoading}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Proxy Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogClose onClose={() => setShowAddDialog(false)} />
        <DialogHeader>
          <DialogTitle>Add Proxy</DialogTitle>
          <DialogDescription>
            Configure a new proxy server for your requests
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Protocol
              </label>
              <select
                value={newProxy.protocol}
                onChange={(e) =>
                  setNewProxy({
                    ...newProxy,
                    protocol: e.target.value as "http" | "https" | "socks5",
                  })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="http">HTTP</option>
                <option value="https">HTTPS</option>
                <option value="socks5">SOCKS5</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Host
                </label>
                <Input
                  type="text"
                  placeholder="proxy.example.com"
                  value={newProxy.host}
                  onChange={(e) =>
                    setNewProxy({ ...newProxy, host: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Port
                </label>
                <Input
                  type="number"
                  placeholder="8080"
                  value={newProxy.port}
                  onChange={(e) =>
                    setNewProxy({ ...newProxy, port: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username (optional)
              </label>
              <Input
                type="text"
                placeholder="username"
                value={newProxy.username}
                onChange={(e) =>
                  setNewProxy({ ...newProxy, username: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password (optional)
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  value={newProxy.password}
                  onChange={(e) =>
                    setNewProxy({ ...newProxy, password: e.target.value })
                  }
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowAddDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddProxy}
            disabled={actionLoading || !newProxy.host || !newProxy.port}
          >
            {actionLoading ? "Adding..." : "Add Proxy"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
