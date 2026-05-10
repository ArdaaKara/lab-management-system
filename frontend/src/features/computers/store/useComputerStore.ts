import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ComputerGridResponse, UpdateComputerRequest } from '../../../types/computer.types';
import { getComputersByLab, updateComputer as updateComputerApi } from '../services/computerService';

interface ComputerState {
  computers: Map<string, ComputerGridResponse>;
  isLoading: boolean;
  fetchComputers: (labId: string) => Promise<void>;
  setComputer: (computer: ComputerGridResponse) => void;
  updateComputer: (id: string, req: UpdateComputerRequest) => Promise<void>;
}

export const useComputerStore = create<ComputerState>()(
  devtools(
    (set, get) => ({
      computers: new Map(),
      isLoading: false,

      fetchComputers: async (labId: string) => {
        set((state) => ({ ...state, isLoading: true }), false, 'computers/fetchComputers/pending');
        try {
          const data = await getComputersByLab(labId);
          const newMap = new Map(data.map((c) => [c.id, c]));
          set(
            (state) => ({ ...state, computers: newMap, isLoading: false }),
            false,
            'computers/fetchComputers/fulfilled'
          );
        } catch (error) {
          set((state) => ({ ...state, isLoading: false }), false, 'computers/fetchComputers/rejected');
          throw error;
        }
      },

      setComputer: (computer: ComputerGridResponse) => {
        set(
          (state) => {
            const newMap = new Map(state.computers);
            newMap.set(computer.id, computer);
            return { ...state, computers: newMap };
          },
          false,
          'computers/setComputer'
        );
      },

      updateComputer: async (id: string, req: UpdateComputerRequest) => {
        try {
          const updatedComputer = await updateComputerApi(id, req);
          get().setComputer(updatedComputer);
        } catch (error) {
          throw error;
        }
      },
    }),
    { name: 'computers' }
  )
);

export default useComputerStore;

