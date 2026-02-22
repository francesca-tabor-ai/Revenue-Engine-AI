import { eq, and, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  founderProfiles,
  contacts,
  outreachMessages,
  replies,
  revenueRecords,
  messagingExperiments,
  revenueSprints,
  sprintDailyTracking,
  authorityContent,
  campaignTemplates,
  behaviourTracking,
  behaviourNudges,
  channelConnections,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============= Founder Profile Queries =============

export async function getFounderProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(founderProfiles)
    .where(eq(founderProfiles.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function upsertFounderProfile(
  userId: number,
  data: Partial<Omit<typeof founderProfiles.$inferInsert, 'userId'>>
) {
  const db = await getDb();
  if (!db) return undefined;

  const existing = await getFounderProfile(userId);

  if (existing) {
    await db
      .update(founderProfiles)
      .set({ ...data, updatedAt: new Date() } as any)
      .where(eq(founderProfiles.userId, userId));
    return getFounderProfile(userId);
  } else {
    await db.insert(founderProfiles).values({
      userId,
      productName: (data.productName as string) || "Untitled Product",
      ...data,
    } as any);
    return getFounderProfile(userId);
  }
}

// ============= Contact Queries =============

export async function getContacts(userId: number, limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(contacts)
    .where(eq(contacts.userId, userId))
    .limit(limit)
    .offset(offset);
}

export async function createContact(
  userId: number,
  data: Omit<typeof contacts.$inferInsert, "userId">
) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .insert(contacts)
    .values({ userId, ...data });

  const id = result[0]?.insertId;
  if (id) {
    const rows = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id as number))
      .limit(1);
    return rows[0];
  }
}

// ============= Outreach Message Queries =============

export async function getOutreachMessages(userId: number, limit = 100) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(outreachMessages)
    .where(eq(outreachMessages.userId, userId))
    .orderBy(desc(outreachMessages.createdAt))
    .limit(limit);
}

export async function createOutreachMessage(
  userId: number,
  data: Omit<typeof outreachMessages.$inferInsert, "userId">
) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .insert(outreachMessages)
    .values({ userId, ...data });

  const id = result[0]?.insertId;
  if (id) {
    const rows = await db
      .select()
      .from(outreachMessages)
      .where(eq(outreachMessages.id, id as number))
      .limit(1);
    return rows[0];
  }
}

// ============= Reply Queries =============

export async function getReplies(userId: number, limit = 100) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(replies)
    .where(eq(replies.userId, userId))
    .orderBy(desc(replies.createdAt))
    .limit(limit);
}

export async function createReply(
  userId: number,
  data: Omit<typeof replies.$inferInsert, "userId">
) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .insert(replies)
    .values({ userId, ...data });

  const id = result[0]?.insertId;
  if (id) {
    const rows = await db
      .select()
      .from(replies)
      .where(eq(replies.id, id as number))
      .limit(1);
    return rows[0];
  }
}

// ============= Revenue Record Queries =============

export async function getRevenueRecords(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(revenueRecords)
    .where(eq(revenueRecords.userId, userId))
    .orderBy(desc(revenueRecords.closedDate));
}

export async function createRevenueRecord(
  userId: number,
  data: Omit<typeof revenueRecords.$inferInsert, "userId">
) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .insert(revenueRecords)
    .values({ userId, ...data });

  const id = result[0]?.insertId;
  if (id) {
    const rows = await db
      .select()
      .from(revenueRecords)
      .where(eq(revenueRecords.id, id as number))
      .limit(1);
    return rows[0];
  }
}

// ============= Revenue Sprint Queries =============

export async function getRevenueSprints(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(revenueSprints)
    .where(eq(revenueSprints.userId, userId))
    .orderBy(desc(revenueSprints.createdAt));
}

export async function createRevenueSprint(
  userId: number,
  data: Omit<typeof revenueSprints.$inferInsert, "userId">
) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .insert(revenueSprints)
    .values({ userId, ...data });

  const id = result[0]?.insertId;
  if (id) {
    const rows = await db
      .select()
      .from(revenueSprints)
      .where(eq(revenueSprints.id, id as number))
      .limit(1);
    return rows[0];
  }
}

// ============= Authority Content Queries =============

export async function getAuthorityContent(userId: number, limit = 100) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(authorityContent)
    .where(eq(authorityContent.userId, userId))
    .orderBy(desc(authorityContent.createdAt))
    .limit(limit);
}

export async function createAuthorityContent(
  userId: number,
  data: Omit<typeof authorityContent.$inferInsert, "userId">
) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .insert(authorityContent)
    .values({ userId, ...data });

  const id = result[0]?.insertId;
  if (id) {
    const rows = await db
      .select()
      .from(authorityContent)
      .where(eq(authorityContent.id, id as number))
      .limit(1);
    return rows[0];
  }
}

// ============= Behaviour Tracking Queries =============

export async function trackBehaviour(
  userId: number,
  data: Omit<typeof behaviourTracking.$inferInsert, "userId" | "createdAt">
) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .insert(behaviourTracking)
    .values({ userId, ...data, createdAt: new Date() } as any);

  return result;
}

export async function getBehaviourNudges(userId: number, limit = 10) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(behaviourNudges)
    .where(eq(behaviourNudges.userId, userId))
    .orderBy(desc(behaviourNudges.createdAt))
    .limit(limit);
}

export async function createBehaviourNudge(
  userId: number,
  data: Omit<typeof behaviourNudges.$inferInsert, "userId">
) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .insert(behaviourNudges)
    .values({ userId, ...data });

  const id = result[0]?.insertId;
  if (id) {
    const rows = await db
      .select()
      .from(behaviourNudges)
      .where(eq(behaviourNudges.id, id as number))
      .limit(1);
    return rows[0];
  }
}

// ============= Channel Connection Queries =============

export async function getChannelConnections(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(channelConnections)
    .where(eq(channelConnections.userId, userId));
}

export async function getChannelConnection(userId: number, channel: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(channelConnections)
    .where(
      and(
        eq(channelConnections.userId, userId),
        eq(channelConnections.channel, channel as any)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function upsertChannelConnection(
  userId: number,
  channel: string,
  data: Partial<typeof channelConnections.$inferInsert>
) {
  const db = await getDb();
  if (!db) return undefined;

  const existing = await getChannelConnection(userId, channel);

  if (existing) {
    await db
      .update(channelConnections)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(channelConnections.id, existing.id));
    return getChannelConnection(userId, channel);
  } else {
    await db.insert(channelConnections).values({
      userId,
      channel: channel as any,
      ...data,
    });
    return getChannelConnection(userId, channel);
  }
}
