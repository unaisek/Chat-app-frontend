import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slices";
import { createChatSlice } from "./slices/chat-slice";


export const useAppStore = create()((...a) => ({
  ...createAuthSlice(...a),
  ...createChatSlice(...a),
}));