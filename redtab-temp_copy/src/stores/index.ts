import { create } from 'zustand';

// Export the new comprehensive auth store
export { useAuthStore } from './authStore';

// Export language store for i18n
export { useLanguageStore } from './languageStore';

interface UiStore {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  toggleCollapseSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// Set sidebar to be closed by default on mobile, open on desktop
const getInitialSidebarState = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth >= 768; // md breakpoint
  }
  return true;
};

// Get initial collapsed state from localStorage or default
const getInitialCollapsedState = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored !== null) return stored === 'true';
    return window.innerWidth < 1024; // lg breakpoint
  }
  return false;
};

export const useUiStore = create<UiStore>((set) => ({
  sidebarOpen: getInitialSidebarState(),
  sidebarCollapsed: getInitialCollapsedState(),
  theme: 'light',
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  toggleCollapseSidebar: () => 
    set((state) => {
      const newState = !state.sidebarCollapsed;
      localStorage.setItem('sidebar-collapsed', String(newState));
      return { sidebarCollapsed: newState };
    }),
  
  setSidebarCollapsed: (collapsed: boolean) => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
    set({ sidebarCollapsed: collapsed });
  },
  
  setTheme: (theme) => set({ theme }),
}));
