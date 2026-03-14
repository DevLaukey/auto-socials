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
  const [proxyAddress, setProxyAddress] = useState("");
  const [proxyType, setProxyType] = useState("http");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Bulk import
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkProxies, setBulkProxies] = useState("");

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
    if (!proxyAddress) {
      setError("Proxy address is required (format: host:port)");
      return;
    }

    if (!proxyAddress.includes(":")) {
      setError(
        "Proxy address must be in format: host:port (e.g., 185.155.233.94:50100)",
      );
      return;
    }

    setActionLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const proxyData: CreateProxyData = {
        proxy_address: proxyAddress,
        proxy_type: proxyType,
      };

      // Add credentials if provided
      if (username) proxyData.username = username;
      if (password) proxyData.password = password;

      const response = await createProxy(proxyData);

      setSuccessMessage(response.message || "Proxy added successfully");

      // Reload the proxy list
      await loadProxies();

      // Close dialog after 1.5 seconds
      setTimeout(() => {
        setShowAddDialog(false);
        resetForm();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to add proxy");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleBulkImport() {
    if (!bulkProxies.trim()) {
      setError("Please enter proxy data");
      return;
    }

    setActionLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const lines = bulkProxies.trim().split("\n");
      let successCount = 0;
      let failCount = 0;
      const errors: string[] = [];

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Parse different formats
        let proxyData: CreateProxyData;

        // Format: LOGIN:PASS:IP:PORT
        if (trimmed.includes(":") && trimmed.split(":").length === 4) {
          const [login, pass, ip, port] = trimmed.split(":");
          proxyData = {
            proxy_address: `${ip}:${port}`,
            proxy_type: "http", // Default to HTTP
            username: login,
            password: pass,
          };
        }
        // Format: IP:PORT
        else if (trimmed.includes(":") && trimmed.split(":").length === 2) {
          const [ip, port] = trimmed.split(":");
          proxyData = {
            proxy_address: `${ip}:${port}`,
            proxy_type: "http",
          };
        } else {
          failCount++;
          errors.push(`Invalid format: ${trimmed}`);
          continue;
        }

        try {
          await createProxy(proxyData);
          successCount++;
        } catch (err: any) {
          failCount++;
          errors.push(`${proxyData.proxy_address}: ${err.message}`);
        }
      }

      await loadProxies();

      if (failCount === 0) {
        setSuccessMessage(`Successfully added ${successCount} proxies`);
        setTimeout(() => {
          setShowAddDialog(false);
          resetForm();
        }, 1500);
      } else {
        setError(
          `Added ${successCount} proxies, ${failCount} failed. ${
            errors.length > 0 ? errors[0] : ""
          }`,
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to import proxies");
    } finally {
      setActionLoading(false);
    }
  }

  const resetForm = () => {
    setProxyAddress("");
    setProxyType("http");
    setUsername("");
    setPassword("");
    setBulkProxies("");
    setShowBulkImport(false);
    setError(null);
    setSuccessMessage(null);
  };

  async function handleToggleProxy(proxy: Proxy) {
    setActionLoading(true);
    try {
      if (proxy.is_active) {
        await deactivateProxy(proxy.id);
      } else {
        await activateProxy(proxy.id);
      }
      await loadProxies();
    } catch (err: any) {
      alert(err.message || "Failed to update proxy");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRemoveProxy(proxy: Proxy) {
    if (!confirm(`Remove proxy ${proxy.proxy_address}?`)) return;

    setActionLoading(true);
    try {
      await removeProxy(proxy.id);
      await loadProxies();
    } catch (err: any) {
      alert(err.message || "Failed to remove proxy");
    } finally {
      setActionLoading(false);
    }
  }

  const parseProxyAddress = (address: string) => {
    const [host, port] = address.split(":");
    return { host, port: port || "unknown" };
  };

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
              <h2 className="font-semibold text-gray-900">
                Proxies
                {!loading && proxies.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({proxies.length})
                  </span>
                )}
              </h2>
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
              {proxies.map((proxy) => {
                const { host, port } = parseProxyAddress(proxy.proxy_address);
                return (
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
                            {host}:{port}
                          </span>
                          <Badge variant="default">{proxy.proxy_type}</Badge>
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
                        {proxy.created_at && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            Added{" "}
                            {new Date(proxy.created_at).toLocaleDateString()}
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
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Proxy Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogClose
          onClose={() => {
            setShowAddDialog(false);
            resetForm();
          }}
        />
        <DialogHeader>
          <DialogTitle>Add Proxy</DialogTitle>
          <DialogDescription>
            Configure a new proxy server for your requests
          </DialogDescription>
        </DialogHeader>
        <DialogContent className="max-w-md">
          <div className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="rounded-md bg-green-50 border border-green-200 text-green-700 px-3 py-2 text-sm">
                {successMessage}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant={!showBulkImport ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setShowBulkImport(false);
                  setError(null);
                }}
              >
                Single Proxy
              </Button>
              <Button
                variant={showBulkImport ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setShowBulkImport(true);
                  setError(null);
                }}
              >
                Bulk Import
              </Button>
            </div>

            {!showBulkImport ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proxy Type
                  </label>
                  <select
                    value={proxyType}
                    onChange={(e) => setProxyType(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={actionLoading}
                  >
                    <option value="http">HTTP</option>
                    <option value="https">HTTPS</option>
                    <option value="socks5">SOCKS5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proxy Address
                  </label>
                  <Input
                    type="text"
                    placeholder="host:port (e.g., 185.155.233.94:50100)"
                    value={proxyAddress}
                    onChange={(e) => setProxyAddress(e.target.value)}
                    disabled={actionLoading}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username (optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={actionLoading}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={actionLoading}
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
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bulk Import Proxies
                </label>
                <textarea
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={8}
                  placeholder="Supported formats:&#10;&#10;1. LOGIN:PASS:IP:PORT (authenticated)&#10;VSpjrP0X:QwBIjNd1s6:185.155.233.94:50100&#10;&#10;2. IP:PORT (unauthenticated)&#10;185.155.233.94:50100"
                  value={bulkProxies}
                  onChange={(e) => setBulkProxies(e.target.value)}
                  disabled={actionLoading}
                />
                <p className="text-xs text-gray-500 mt-2">
                  <strong>Formats:</strong>
                  <br />
                  • Authenticated: username:password:host:port
                  <br />
                  • Unauthenticated: host:port
                  <br />
                  One proxy per line
                </p>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setShowAddDialog(false);
              resetForm();
            }}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={showBulkImport ? handleBulkImport : handleAddProxy}
            disabled={
              actionLoading ||
              (showBulkImport ? !bulkProxies.trim() : !proxyAddress)
            }
          >
            {actionLoading
              ? "Adding..."
              : showBulkImport
                ? "Import All"
                : "Add Proxy"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
