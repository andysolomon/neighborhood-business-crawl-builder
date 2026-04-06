import { internalMutation } from "./_generated/server";

/**
 * Wipes all tables and creates demo data for development.
 *
 * Run via: `bunx convex run seed:reset`
 */
export const reset = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Wipe all tables
    const tables = [
      "checkIns",
      "routes",
      "businesses",
      "users",
      "districts",
    ] as const;
    for (const table of tables) {
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
    }

    const now = Date.now();

    // 1 district
    const districtId = await ctx.db.insert("districts", {
      name: "Downtown Demo District",
      slug: "downtown-demo",
      createdAt: now,
    });

    // 2 users
    const visitorId = await ctx.db.insert("users", {
      clerkId: "user_demo_visitor",
      email: "visitor@example.com",
      name: "Demo Visitor",
      role: "visitor",
      districtId,
      createdAt: now,
    });

    const adminId = await ctx.db.insert("users", {
      clerkId: "user_demo_admin",
      email: "admin@example.com",
      name: "Demo Admin",
      role: "admin",
      districtId,
      createdAt: now,
    });

    // 3 businesses
    const coffee = await ctx.db.insert("businesses", {
      name: "Crawl Coffee Co.",
      description: "Single-origin pour-overs and pastries.",
      address: "100 Main St",
      lat: 40.7128,
      lng: -74.006,
      ownerId: adminId,
      districtId,
      createdAt: now,
    });

    const bookshop = await ctx.db.insert("businesses", {
      name: "Page Turner Books",
      description: "Independent bookstore with a cozy reading nook.",
      address: "150 Main St",
      lat: 40.713,
      lng: -74.0058,
      districtId,
      createdAt: now,
    });

    const bakery = await ctx.db.insert("businesses", {
      name: "Sunrise Bakery",
      description: "Fresh croissants and sourdough loaves.",
      address: "200 Main St",
      lat: 40.7132,
      lng: -74.0055,
      districtId,
      createdAt: now,
    });

    // 2 routes with 3 stops each
    await ctx.db.insert("routes", {
      name: "Morning Coffee Crawl",
      theme: "Coffee",
      description: "Three of the best caffeine spots downtown.",
      published: true,
      stops: [
        {
          businessId: coffee,
          name: "Crawl Coffee Co.",
          lat: 40.7128,
          lng: -74.006,
          order: 0,
          qrToken: crypto.randomUUID(),
        },
        {
          businessId: bookshop,
          name: "Page Turner Books",
          lat: 40.713,
          lng: -74.0058,
          order: 1,
          qrToken: crypto.randomUUID(),
        },
        {
          businessId: bakery,
          name: "Sunrise Bakery",
          lat: 40.7132,
          lng: -74.0055,
          order: 2,
          qrToken: crypto.randomUUID(),
        },
      ],
      districtId,
      createdAt: now,
    });

    await ctx.db.insert("routes", {
      name: "Sweet Treats Trail",
      theme: "Bakery",
      description: "A walking tour of local bakeries.",
      published: true,
      stops: [
        {
          businessId: bakery,
          name: "Sunrise Bakery",
          lat: 40.7132,
          lng: -74.0055,
          order: 0,
          qrToken: crypto.randomUUID(),
        },
        {
          businessId: coffee,
          name: "Crawl Coffee Co.",
          lat: 40.7128,
          lng: -74.006,
          order: 1,
          qrToken: crypto.randomUUID(),
        },
        {
          businessId: bookshop,
          name: "Page Turner Books",
          lat: 40.713,
          lng: -74.0058,
          order: 2,
          qrToken: crypto.randomUUID(),
        },
      ],
      districtId,
      createdAt: now,
    });

    return {
      districtId,
      users: [visitorId, adminId],
      businesses: [coffee, bookshop, bakery],
    };
  },
});
