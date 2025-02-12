// components/providers/SessionProvider.tsx
import { type ReactNode } from "react";
import { useSessionRuntime, useSessionPersist } from "hooks/session/useSessionRuntime";

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: Readonly<SessionProviderProps>) {
  useSessionRuntime();
  useSessionPersist();
  return <>{children}</>;
}