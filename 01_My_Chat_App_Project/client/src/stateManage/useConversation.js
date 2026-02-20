import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages:[],
  setMessage : (message) => set({messages}),
}));

export default useConversation;
