import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ClientState {
  isClientMode: boolean;
  toggleMode: () => void;
}

const useClientMode = create<ClientState>()(
  persist(
    (set, get) => ({
        isClientMode: false, 
      toggleMode: () => {
            
            set({isClientMode:!get().isClientMode})
      },
    }),
    {
      name: 'client-mode-storage', 
    }
  )
);

export default useClientMode;