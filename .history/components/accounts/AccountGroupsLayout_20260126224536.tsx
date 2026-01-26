"use client";

import { useEffect, useState, useMemo } from "react";
import GroupList from "./GroupList";
import GroupAccounts from "./GroupAccounts";
import CreateGroupModal from "./CreateGroupModal";
import AddAccountModal from "./AddAccountModal";
import { Button } from "@/components/ui/button";
import { useAccountsStore } from "@/src/store/accountsStore";

export default function AccountGroupsLayout() {
  const {
    groups,
    accounts,
    groupAccounts,
    loadGroups,
    loadAccounts,
    loadGroupAccounts,
  } = useAccountsStore();

  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  /* -------------------------------------------
   * Load initial data (groups + all accounts)
   * ------------------------------------------- */
  useEffect(() => {
    loadGroups();
    loadAccounts();
  }, [loadGroups, loadAccounts]);

  /* -------------------------------------------
   * Select first group once groups load
   * ------------------------------------------- */
  useEffect(() => {
    if (groups.length > 0 && activeGroupId === null) {
      setActiveGroupId(groups[0].id);
    }
  }, [groups, activeGroupId]);

  /* -------------------------------------------
   * Active group object
   * ------------------------------------------- */
  const activeGroup = useMemo(
    () => groups.find((g) => g.id === activeGroupId) ?? null,
    [groups, activeGroupId],
  );

  /* -------------------------------------------
   * Load accounts for active group (BACKEND)
   * ------------------------------------------- */
  useEffect(() => {
    if (activeGroupId !== null) {
      loadGroupAccounts(activeGroupId);
    }
  }, [activeGroupId, loadGroupAccounts]);

  /* -------------------------------------------
   * Accounts for active group from store map
   * ------------------------------------------- */
  const activeGroupAccounts = useMemo(
    () =>
      activeGroupId !== null
        ? (groupAccounts[activeGroupId] ?? []).filter(
            (account) => account.username !== undefined,
          )
        : [],
    [activeGroupId, groupAccounts],
  );

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Account Groups</h2>
        <Button onClick={() => setShowGroupModal(true)}>Create Group</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GroupList
          groups={groups}
          groupAccounts={groupAccounts}
          activeGroupId={activeGroupId}
          onSelect={setActiveGroupId}
        />

        {activeGroup && (
          <GroupAccounts
            group={activeGroup}
            accounts={activeGroupAccounts}
            onAddAccount={() => setShowAccountModal(true)}
          />
        )}
      </div>

      {showGroupModal && (
        <CreateGroupModal onClose={() => setShowGroupModal(false)} />
      )}

      {showAccountModal && activeGroup && (
        <AddAccountModal
          groupId={activeGroup.id}
          onClose={() => setShowAccountModal(false)}
        />
      )}
    </>
  );
}
