import { Button } from "@/components/ui/button";
import AccountCard from "./AccountCard";
import type { Account } from "@/src/store/accountsStore";

type Props = {
  group: { id: number; name: string };
  accounts?: Account[];
  onAddAccount: () => void;
};

export default function GroupAccounts({
  group,
  accounts = [],
  onAddAccount,
}: Props) {
  return (
    <div className="md:col-span-3 bg-white border rounded-xl p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{group.name} Accounts</h3>
        <Button size="sm" onClick={onAddAccount}>
          Connect Account
        </Button>
      </div>

      {accounts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No accounts connected to this group yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      )}
    </div>
  );
}
