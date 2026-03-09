import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile } from "@/lib/types/database";

interface ProfileState {
  profiles: Profile[];
  activeProfileId: string | null;
  setProfiles: (profiles: Profile[]) => void;
  setActiveProfile: (id: string) => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (id: string, name: string) => void;
  removeProfile: (id: string) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profiles: [],
      activeProfileId: null,

      setProfiles: (profiles) =>
        set((state) => {
          const isValid = profiles.some((p) => p.id === state.activeProfileId);
          return {
            profiles,
            activeProfileId: isValid
              ? state.activeProfileId
              : (profiles[0]?.id ?? null),
          };
        }),

      setActiveProfile: (id) => set({ activeProfileId: id }),

      addProfile: (profile) =>
        set((state) => ({ profiles: [...state.profiles, profile] })),

      updateProfile: (id, name) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id ? { ...p, name } : p,
          ),
        })),

      removeProfile: (id) =>
        set((state) => {
          const filtered = state.profiles.filter((p) => p.id !== id);
          const isValid = filtered.some((p) => p.id === state.activeProfileId);
          return {
            profiles: filtered,
            activeProfileId: isValid
              ? state.activeProfileId
              : (filtered[0]?.id ?? null),
          };
        }),
    }),
    {
      name: "medtrack-profile-store",
      // Only persist the active profile selection, not the full list
      partialize: (state) => ({ activeProfileId: state.activeProfileId }),
    },
  ),
);
