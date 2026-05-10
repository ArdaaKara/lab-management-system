import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { LabResponse } from '../../../types/lab.types';
import { getAllLabs } from '../services/labService';

interface LabState {
  labs: LabResponse[];
  selectedLabId: string | null;
  isLoading: boolean;
  fetchLabs: () => Promise<void>;
  selectLab: (id: string) => void;
}

export const useLabStore = create<LabState>()(
  devtools(
    (set) => ({
      labs: [],
      selectedLabId: null,
      isLoading: false,

      fetchLabs: async () => {
        set((state) => ({ ...state, isLoading: true }), false, 'labs/fetchLabs/pending');
        try {
          const labs = await getAllLabs();
          set((state) => ({ ...state, labs, isLoading: false }), false, 'labs/fetchLabs/fulfilled');
        } catch (error) {
          set((state) => ({ ...state, isLoading: false }), false, 'labs/fetchLabs/rejected');
          throw error;
        }
      },

      selectLab: (id: string) => {
        set((state) => ({ ...state, selectedLabId: id }), false, 'labs/selectLab');
      },
    }),
    { name: 'labs' }
  )
);

export default useLabStore;

