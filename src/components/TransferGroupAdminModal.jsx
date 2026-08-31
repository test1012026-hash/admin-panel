import { useEffect, useState } from "react";
import { api, errMessage } from "../lib/api";

export default function TransferGroupAdminModal({
  group,
  user,
  onClose,
  onTransferred,
  onDeletedWithoutTransfer,
}) {
  const [loading, setLoading] = useState(true);
  const [groupInfo, setGroupInfo] = useState(group || null);
  const [members, setMembers] = useState([]);
  const [selectedMemberUuid, setSelectedMemberUuid] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const currentAdminEmail =
    groupInfo?.adminEmail || user?.email || groupInfo?.adminName || "Current Admin";
  const groupUuid = groupInfo?.uuid || user?.groupUuid;
  const userUuid = user?.uuid || groupInfo?.adminUuid;

  useEffect(() => {
    async function loadMembers() {
      setLoading(true);
      setError("");
      try {
        let res;
        if (groupUuid) {
          res = await api.get(`/api/admin/groups/${groupUuid}/members`);
        } else if (userUuid) {
          res = await api.get(`/api/admin/users/${userUuid}/group-members`);
        }

        if (res?.data) {
          if (res.data.group) {
            setGroupInfo(res.data.group);
          }
          const memberList = res.data.members || [];
          setMembers(memberList);
          if (memberList.length > 0) {
            setSelectedMemberUuid(memberList[0].uuid);
          }
        }
      } catch (err) {
        setError(errMessage(err));
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, [groupUuid, userUuid]);

  async function handleTransfer(e) {
    e.preventDefault();
    if (!selectedMemberUuid) {
      setError("Please select a group member to become the new group admin.");
      return;
    }

    setBusy(true);
    setError("");
    setInfo("");

    try {
      const targetGroupUuid = groupInfo?.uuid || groupUuid;
      const { data } = await api.post(
        `/api/admin/groups/${targetGroupUuid}/transfer-admin`,
        { newAdminUuid: selectedMemberUuid },
      );

      setInfo(data.message || "Group admin transferred successfully.");
      setTimeout(() => {
        onTransferred?.(data);
        onClose();
      }, 700);
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteGroupDirectly() {
    if (
      !confirm(
        "Delete this group and remove the group admin?\n\nSince there are no other members, the group will be removed and the user will become a normal subscriber.",
      )
    ) {
      return;
    }

    setBusy(true);
    setError("");
    try {
      const targetGroupUuid = groupInfo?.uuid || groupUuid;
      if (targetGroupUuid) {
        await api.delete(`/api/admin/groups/${targetGroupUuid}`);
      } else if (userUuid) {
        await api.delete(`/api/admin/users/${userUuid}`);
      }
      onDeletedWithoutTransfer?.();
      onClose();
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative card max-h-[90vh] w-full max-w-xl overflow-y-auto p-6 shadow-lift">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">
              Change Group Admin & Demote
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              Group:{" "}
              <span className="font-semibold text-ink-800">
                {groupInfo?.name || "Group"}
              </span>{" "}
              · Current Admin:{" "}
              <span className="font-semibold text-ink-800">
                {currentAdminEmail}
              </span>
            </p>
          </div>
          <button
            type="button"
            className="btn-secondary !px-2 !py-1 text-xs"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 leading-relaxed">
          <p className="font-semibold">Important:</p>
          <p className="mt-0.5">
            To remove or delete this Group Admin, select another member from this
            group to become the new <strong>Group Admin</strong>. The current
            admin (<span className="font-medium">{currentAdminEmail}</span>) will
            be removed as group admin and become a <strong>normal subscriber for this group</strong>.
          </p>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}
        {info && (
          <p className="mt-4 rounded-xl bg-accent-soft px-3 py-2 text-sm text-accent-dark">
            {info}
          </p>
        )}

        {loading ? (
          <p className="my-6 text-center text-sm text-ink-500">
            Loading group members…
          </p>
        ) : members.length === 0 ? (
          <div className="my-6 rounded-xl border border-dashed border-ink-200 p-6 text-center">
            <p className="text-sm font-medium text-ink-700">
              No other members in this group
            </p>
            <p className="mt-1 text-xs text-ink-500">
              There are no other subscribers in this group to assign as the new
              Group Admin.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={busy}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleDeleteGroupDirectly}
                disabled={busy}
              >
                {busy ? "Processing…" : "Delete Group & Demote Admin"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleTransfer} className="mt-4 space-y-4">
            <div>
              <label className="label mb-2">
                Select Member to become New Group Admin ({members.length} available):
              </label>

              <div className="max-h-60 overflow-y-auto rounded-xl border border-ink-200 divide-y divide-ink-100 bg-white">
                {members.map((m) => {
                  const isSelected = selectedMemberUuid === m.uuid;
                  return (
                    <label
                      key={m.uuid}
                      className={`flex cursor-pointer items-center justify-between p-3 transition hover:bg-ink-50/80 ${
                        isSelected ? "bg-accent-soft/40" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="newAdminMember"
                          className="text-accent focus:ring-accent"
                          checked={isSelected}
                          onChange={() => setSelectedMemberUuid(m.uuid)}
                        />
                        <div>
                          <p className="text-sm font-medium text-ink-900">
                            {m.email}
                          </p>
                          {m.name ? (
                            <p className="text-xs text-ink-500">{m.name}</p>
                          ) : null}
                        </div>
                      </div>
                      <div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            m.subscriptionActive
                              ? "bg-teal-50 text-teal-700 border border-teal-200"
                              : "bg-red-50 text-red-600 border border-red-200"
                          }`}
                        >
                          {m.subscriptionActive ? "Active" : "Expired"}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-ink-100">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={busy}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={busy || !selectedMemberUuid}
              >
                {busy ? "Updating…" : "Assign as Group Admin & Demote Current Admin"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
