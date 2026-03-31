import { create } from "zustand";
import type { Profile } from "@/lib/types/database";

interface ProfileState {
  profiles: Profile[];
  activeProfileId: string | null;
  syncProfiles: (
    profiles: Profile[],
    preferredActiveProfileId?: string | null
  ) => void;
  setProfiles: (profiles: Profile[]) => void;
  setActiveProfile: (id: string) => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (id: string, name: string) => void;
  removeProfile: (id: string) => void;
}

export const useProfileStore = create<ProfileState>()((set) => ({
  profiles: [],
  activeProfileId: null,

  syncProfiles: (profiles, preferredActiveProfileId) =>
    set((state) => {
      const preferredIsValid = profiles.some(
        (profile) => profile.id === preferredActiveProfileId
      );
      const currentIsValid = profiles.some(
        (profile) => profile.id === state.activeProfileId
      );

      return {
        profiles,
        activeProfileId: preferredIsValid
          ? (preferredActiveProfileId ?? null)
          : currentIsValid
            ? state.activeProfileId
            : (profiles[0]?.id ?? null),
      };
    }),

  setProfiles: (profiles) =>
    set((state) => {
      const isValid = profiles.some((profile) => profile.id === state.activeProfileId);
      return {
        profiles,
        activeProfileId: isValid ? state.activeProfileId : (profiles[0]?.id ?? null),
      };
    }),

  setActiveProfile: (id) => set({ activeProfileId: id }),

  addProfile: (profile) =>
    set((state) => ({ profiles: [...state.profiles, profile] })),

  updateProfile: (id, name) =>
    set((state) => ({
      profiles: state.profiles.map((profile) =>
        profile.id === id ? { ...profile, name } : profile
      ),
    })),

  removeProfile: (id) =>
    set((state) => {
      const filtered = state.profiles.filter((profile) => profile.id !== id);
      const isValid = filtered.some(
        (profile) => profile.id === state.activeProfileId
      );
      return {
        profiles: filtered,
        activeProfileId: isValid ? state.activeProfileId : (filtered[0]?.id ?? null),
      };
    }),
}));
