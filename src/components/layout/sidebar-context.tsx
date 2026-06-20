"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const COOKIE_NAME = "sidebar_collapsed";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const SHORTCUT_KEY = "b";

type SidebarContextValue = {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (value: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

/** Collapse state of the desktop sidebar (icon-only ↔ full width). */
export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a <SidebarProvider>.");
  }
  return ctx;
}

/**
 * Holds the desktop sidebar collapse state. `defaultCollapsed` is read from the
 * `sidebar_collapsed` cookie in the server layout to avoid a flash on load.
 * Persists changes back to the cookie and wires the Ctrl/Cmd+B shortcut.
 */
export function SidebarProvider({
  defaultCollapsed = false,
  children,
}: {
  defaultCollapsed?: boolean;
  children: React.ReactNode;
}) {
  const [collapsed, _setCollapsed] = useState(defaultCollapsed);

  const setCollapsed = useCallback((value: boolean) => {
    _setCollapsed(value);
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}`;
  }, []);

  const toggle = useCallback(() => {
    _setCollapsed((prev) => {
      const next = !prev;
      document.cookie = `${COOKIE_NAME}=${next}; path=/; max-age=${COOKIE_MAX_AGE}`;
      return next;
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === SHORTCUT_KEY && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  const value = useMemo(
    () => ({ collapsed, toggle, setCollapsed }),
    [collapsed, toggle, setCollapsed]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}
