"use client";

import { useState, useRef } from "react";
import type { Profile } from "@/lib/types/database";
import { useProfileStore } from "@/stores/profile-store";
import { createProfile, renameProfile, deleteProfile } from "@/actions/profiles";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { MAX_PROFILES_PER_USER } from "@/lib/constants";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface ProfileManagerProps {
  initialProfiles: Profile[];
}

export function ProfileManager({ initialProfiles }: ProfileManagerProps) {
  const storeProfiles = useProfileStore((s) => s.profiles);
  const addProfileToStore = useProfileStore((s) => s.addProfile);
  const updateProfileInStore = useProfileStore((s) => s.updateProfile);
  const removeProfileFromStore = useProfileStore((s) => s.removeProfile);
  const activeProfileId = useProfileStore((s) => s.activeProfileId);

  // Use store profiles if populated, fallback to initial server data
  const profiles = storeProfiles.length > 0 ? storeProfiles : initialProfiles;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const addInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const atMax = profiles.length >= MAX_PROFILES_PER_USER;

  // --- Add Profile ---
  async function handleAdd() {
    if (!newName.trim()) return;
    setError(null);
    setIsPending(true);
    const result = await createProfile(newName);
    setIsPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.data) {
      addProfileToStore(result.data as Profile);
    }
    setNewName("");
    setIsAdding(false);
  }

  // --- Rename Profile ---
  function startEdit(profile: Profile) {
    setEditingId(profile.id);
    setEditingName(profile.name);
    setError(null);
    setTimeout(() => editInputRef.current?.select(), 10);
  }

  async function handleRename() {
    if (!editingId || !editingName.trim()) return;
    setError(null);
    setIsPending(true);
    const result = await renameProfile(editingId, editingName);
    setIsPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    updateProfileInStore(editingId, editingName.trim());
    setEditingId(null);
  }

  // --- Delete Profile ---
  async function handleDelete() {
    if (!deletingId) return;
    setError(null);
    setIsPending(true);
    const result = await deleteProfile(deletingId);
    setIsPending(false);
    if (result.error) {
      setError(result.error);
      setDeletingId(null);
      return;
    }
    removeProfileFromStore(deletingId);
    setDeletingId(null);
  }

  const deletingProfile = profiles.find((p) => p.id === deletingId);

  return (
    <div className="space-y-3">
      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-4 h-4 flex-shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          {error}
        </div>
      )}

      {/* Profile list */}
      <ul className="space-y-2" aria-label="Profiles">
        {profiles.map((profile) => {
          const isEditing = editingId === profile.id;
          const isActive = profile.id === activeProfileId;
          const isLast = profiles.length === 1;

          return (
            <li
              key={profile.id}
              className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl transition-shadow hover:shadow-sm"
            >
              {/* Avatar */}
              <span
                className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold ${
                  isActive
                    ? "bg-teal-500/15 border border-teal-500/30 text-teal-600"
                    : "bg-slate-100 border border-slate-200 text-slate-500"
                }`}
              >
                {getInitials(profile.name)}
              </span>

              {/* Name / Edit input */}
              {isEditing ? (
                <input
                  ref={editInputRef}
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="flex-1 px-2 py-1 text-sm border border-teal-400 rounded-lg outline-none focus:ring-2 focus:ring-teal-300 bg-white text-slate-900"
                  disabled={isPending}
                  maxLength={50}
                  aria-label="Edit profile name"
                />
              ) : (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {profile.name}
                  </p>
                  {isActive && (
                    <p className="text-xs text-teal-600 font-medium">Active</p>
                  )}
                </div>
              )}

              {/* Actions */}
              {isEditing ? (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={handleRename}
                    disabled={isPending || !editingName.trim()}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 disabled:opacity-40 transition-colors cursor-pointer"
                    aria-label="Save rename"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label="Cancel edit"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => startEdit(profile)}
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                    aria-label={`Rename ${profile.name}`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeletingId(profile.id)}
                    disabled={isLast}
                    title={isLast ? "Cannot delete the last profile" : `Delete ${profile.name}`}
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    aria-label={`Delete ${profile.name}`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Add new profile */}
      {isAdding ? (
        <div className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-200 rounded-xl">
          <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-teal-100 border border-teal-200 text-teal-500 text-sm font-bold">
            {newName ? getInitials(newName) : "+"}
          </span>
          <input
            ref={addInputRef}
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") {
                setIsAdding(false);
                setNewName("");
              }
            }}
            placeholder="Profile name"
            maxLength={50}
            className="flex-1 px-2 py-1 text-sm border border-teal-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-300 bg-white text-slate-900"
            disabled={isPending}
            aria-label="New profile name"
          />
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={handleAdd}
              disabled={isPending || !newName.trim()}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Create profile"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewName("");
              }}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
              aria-label="Cancel add"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setIsAdding(true);
              setError(null);
            }}
            disabled={atMax}
            className="flex items-center gap-1.5"
            aria-label="Add new profile"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Profile
          </Button>
          {atMax && (
            <span className="text-xs text-slate-400">
              {MAX_PROFILES_PER_USER}/{MAX_PROFILES_PER_USER} profiles
            </span>
          )}
        </div>
      )}

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={!!deletingId}
        title="Delete profile?"
        message={
          deletingProfile
            ? `Are you sure you want to delete "${deletingProfile.name}"? All medications and history for this profile will be permanently removed.`
            : ""
        }
        confirmLabel="Delete Profile"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
