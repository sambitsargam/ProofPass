// Auth store for managing user session and credentials

import { create } from 'zustand';
import { User, Credential } from '@/types';

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  sessionToken: string | null;
  
  // Actions
  setUser: (user: User) => void;
  setLoggedIn: (logged: boolean) => void;
  setSessionToken: (token: string) => void;
  addCredential: (credential: Credential) => void;
  clearAuth: () => void;
  updateFraudStatus: (isFraudulent: boolean, score?: number) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,
  sessionToken: null,

  setUser: (user) => set({ user, isLoggedIn: true }),
  
  setLoggedIn: (logged) => set({ isLoggedIn: logged }),
  
  setSessionToken: (token) => set({ sessionToken: token }),
  
  addCredential: (credential) =>
    set((state) => {
      if (!state.user) return state;
      return {
        user: {
          ...state.user,
          credentials: [...state.user.credentials, credential],
        },
      };
    }),
  
  clearAuth: () =>
    set({
      user: null,
      isLoggedIn: false,
      sessionToken: null,
    }),

  updateFraudStatus: (isFraudulent, score) =>
    set((state) => {
      if (!state.user) return state;
      return {
        user: {
          ...state.user,
          isFraudulent,
          fraudScore: score,
        },
      };
    }),
}));
