import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  districts: defineTable({
    name: v.string(),
    slug: v.string(),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    role: v.union(
      v.literal("visitor"),
      v.literal("business"),
      v.literal("admin"),
    ),
    districtId: v.id("districts"),
    createdAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_districtId", ["districtId"]),

  businesses: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    address: v.optional(v.string()),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
    photoStorageId: v.optional(v.id("_storage")),
    ownerId: v.optional(v.id("users")),
    districtId: v.id("districts"),
    createdAt: v.number(),
  })
    .index("by_districtId", ["districtId"])
    .index("by_ownerId", ["ownerId"]),

  routes: defineTable({
    name: v.string(),
    theme: v.string(),
    description: v.optional(v.string()),
    published: v.boolean(),
    stops: v.array(
      v.object({
        businessId: v.id("businesses"),
        name: v.string(),
        lat: v.number(),
        lng: v.number(),
        order: v.number(),
        qrToken: v.string(),
      }),
    ),
    districtId: v.id("districts"),
    createdAt: v.number(),
  })
    .index("by_districtId", ["districtId"])
    .index("by_districtId_published", ["districtId", "published"])
    .index("by_theme", ["theme"]),

  checkIns: defineTable({
    userId: v.id("users"),
    routeId: v.id("routes"),
    stopIndex: v.number(),
    qrToken: v.string(),
    districtId: v.id("districts"),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_routeId", ["routeId"])
    .index("by_user_route_stop", ["userId", "routeId", "stopIndex"])
    .index("by_districtId", ["districtId"]),
});
