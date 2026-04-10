"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useRef } from "react";

type UserRole = "visitor" | "business" | "admin";

/**
 * Returns the current user's role from Convex.
 * If the user is authenticated but has no Convex doc (webhook missed),
 * triggers a lazy-sync mutation to create one.
 */
export function useRole() {
  const { isSignedIn, isLoaded } = useAuth();
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);
  const hasSynced = useRef(false);

  // Reactive query for current user's Convex doc
  const user = useQuery(api.users.currentUser);

  // Lazy-sync: if authenticated but no Convex doc, create one
  useEffect(() => {
    if (!isLoaded || !isSignedIn || hasSynced.current) return;
    if (user !== null) return; // user exists or still loading (undefined)
    // user === null means query resolved but no doc found
    hasSynced.current = true;
    getOrCreateUser().catch(() => {
      hasSynced.current = false;
    });
  }, [isLoaded, isSignedIn, user, getOrCreateUser]);

  if (!isLoaded) return { role: null as UserRole | null, isLoading: true, user: null };
  if (!isSignedIn) return { role: null as UserRole | null, isLoading: false, user: null };
  if (user === undefined) return { role: null as UserRole | null, isLoading: true, user: null };
  if (user === null) return { role: null as UserRole | null, isLoading: true, user: null };

  return { role: user.role, isLoading: false, user };
}
