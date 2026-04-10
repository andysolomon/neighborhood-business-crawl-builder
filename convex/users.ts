import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

/**
 * Lazy-sync fallback: look up user by Clerk identity, create if missing.
 * Called by the useRole() hook when a user is authenticated but may not
 * have a Convex user doc yet (e.g. webhook was missed).
 */
export const getOrCreateUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const clerkId = identity.subject;

    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (existing) return existing;

    // Get the single district (MVP single-tenant)
    const district = await ctx.db.query("districts").first();
    if (!district) throw new Error("No district found — run seed first");

    // Create new user with default visitor role
    const userId = await ctx.db.insert("users", {
      clerkId,
      email: identity.email ?? "",
      name: identity.name,
      role: "visitor",
      districtId: district._id,
      createdAt: Date.now(),
    });

    return await ctx.db.get(userId);
  },
});

/**
 * Upsert user from Clerk webhook payload.
 * Internal mutation — only callable from API routes, not from clients.
 */
/**
 * Upsert user from Clerk webhook payload.
 * Called from the Next.js webhook route via ConvexHttpClient.
 * Security: webhook signature is verified by svix before this is called.
 */
export const upsertFromClerk = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    role: v.optional(
      v.union(
        v.literal("visitor"),
        v.literal("business"),
        v.literal("admin"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      // Update existing user
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
        ...(args.role && { role: args.role }),
      });
      return existing._id;
    }

    // Create new user
    const district = await ctx.db.query("districts").first();
    if (!district) throw new Error("No district found — run seed first");

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      role: args.role ?? "visitor",
      districtId: district._id,
      createdAt: Date.now(),
    });
  },
});
