import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type Density = 'comfortable' | 'compact';

interface UiState {
  density: Density;
  sidebarCollapsed: boolean;
  setDensity: (d: Density) => void;
  toggleSidebar: () => void;
}

const useUiStore = create<UiState>()(
  devtools(
    persist(
      (set) => ({
        density: 'comfortable',
        sidebarCollapsed: false,
        setDensity: (density) => set({ density }, false, 'ui/setDensity'),
        toggleSidebar: () =>
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }), false, 'ui/toggleSidebar'),
      }),
      { name: 'clms-ui-prefs' }
    ),
    { name: 'ui' }
  )
);

export default useUiStore;
