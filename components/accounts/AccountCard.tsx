import { useAccountsStore, type Account } from "@/src/store/accountsStore";
import { Button } from "@/components/ui/button";

export default function AccountCard({ account }: { account: Account }) {
  const disconnectAccount = useAccountsStore((s) => s.disconnectAccount);
  const loadAccounts = useAccountsStore((s) => s.loadAccounts);

  const handleDisconnect = async () => {
    if (!confirm(`Disconnect ${account.platform} account "${account.username}"?`))
      return;
    try {
      await disconnectAccount(account.id);
      await loadAccounts();
    } catch (err) {
      console.error("Failed to disconnect account", err);
    }
  };

  return (
    <div className="border rounded-xl p-4 space-y-2">
      <h3 className="font-semibold">{account.platform}</h3>
      <p className="text-sm">{account.username}</p>

      {account.status && (
        <p className="text-xs text-muted-foreground">
          Status: {account.status}
        </p>
      )}

      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={loadAccounts}>
          Refresh
        </Button>

        <Button size="sm" variant="destructive" onClick={handleDisconnect}>
          Disconnect
        </Button>
      </div>
    </div>
  );
}
