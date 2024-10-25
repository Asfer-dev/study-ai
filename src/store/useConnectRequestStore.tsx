import { Types } from "mongoose";
import { create } from "zustand";

interface ConnectRequestStore {
  incomingConnectRequests: Types.ObjectId[]; // Or your preferred data structure
  addRequest: (request: Types.ObjectId) => void;
  removeRequest: (requestId: Types.ObjectId) => void;
  setRequests: (requests: Types.ObjectId[]) => void;
}

export const useConnectRequestStore = create<ConnectRequestStore>((set) => ({
  incomingConnectRequests: [],
  addRequest: (request) =>
    set((state) => ({
      incomingConnectRequests: [...state.incomingConnectRequests, request],
    })),
  removeRequest: (requestId) =>
    set((state) => ({
      incomingConnectRequests: state.incomingConnectRequests.filter(
        (req) => req.toString() !== requestId.toString()
      ),
    })),
  setRequests: (requests) => set({ incomingConnectRequests: requests }),
}));
