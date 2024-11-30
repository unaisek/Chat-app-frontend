import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slices";


export const useAppStore = create()((...a) => ({
  ...createAuthSlice(...a),
}));