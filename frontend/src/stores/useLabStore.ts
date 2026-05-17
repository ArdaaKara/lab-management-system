import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { LabResponse } from '../types/lab.types';
import { getAllLabs } from '../services/labService';

interface LabState {
  labs: LabResponse[];
  selectedLabId: string | null;
  isLoading: boolean;
  fetchLabs: () => Promise<void>;
  selectLab: (id: string) => void;
}

const useLabStore = create<LabState>()(
  devtools(
    (set) => ({
      labs: [],
      selectedLabId: null,
      isLoading: false,

      fetchLabs: async () => {
        set({ isLoading: true }, false, 'labs/fetchStart');
        try {
          const data = await getAllLabs();
          set({ labs: data, isLoading: false }, false, 'labs/fetchSuccess');
        } catch (error) {
          set({ isLoading: false }, false, 'labs/fetchError');
          throw error;
        }
      },

      selectLab: (id) =>
        set({ selectedLabId: id }, false, 'labs/selectLab'),
    }),
    { name: 'labs' }
  )
);

export default useLabStore;
