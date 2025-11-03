import { create } from "zustand";

const channel = new BroadcastChannel("interview_channel");

export const useInterviewStore = create((set) => {
  channel.onmessage = (event) => {
    set({ candidates: event.data });
  };

  return {
    candidates: [],
    currentCandidate: null,
    results: [],
    score: 0,

    setCandidate: (data) =>
      set((state) => {
        const existsIndex = state.candidates.findIndex(
          (c) => c.email === data.email && c.email !== ""
        );

        let updatedCandidates = [...state.candidates];
        if (existsIndex >= 0) {
          updatedCandidates[existsIndex] = data;
        } else {
          updatedCandidates.push(data);
        }

        channel.postMessage(updatedCandidates);

        return { currentCandidate: data, candidates: updatedCandidates };
      }),
    setResults: (res) => set({ results: res }),
    setScore: (s) => set({ score: s }),
    addCandidate: (candidateData) =>
    set((state) => ({
      candidates: [...state.candidates, candidateData],
    })),
    resetInterview: () =>
    set({
      currentCandidate: null,
      results: [],
      score: 0,
    }),
  };
});
