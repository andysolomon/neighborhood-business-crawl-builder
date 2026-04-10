"use client";

import { useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState } from "react";

type UserRole = "visitor" | "business" | "admin";

type UseRoleResult =
  | { role: UserRole; isLoading: false; user: NonNullable<unknown> }
  | { role: null; isLoading: true; user: null }
  | { role: null; isLoading: false; user: null };

export function useRole(): UseRoleResult {
  const { isSignedIn, isLoaded } = useAuth();
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);
  const [user, setUser] = useState<{ role: UserRole } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    getOrCreateUser()
      .then((result) => {
        if (!cancelled && result) {
          setUser(result);
        }
        if (!cancelled) setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isSignedIn, isLoaded, getOrCreateUser]);

  if (isLoading) return { role: null, isLoading: true, user: null };
  if (!user) return { role: null, isLoading: false, user: null };
  return { role: user.role, isLoading: false, user };
}
