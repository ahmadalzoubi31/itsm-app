// drizzle/schema/incidents.ts
import { pgTable, text, timestamp, boolean, pgEnum, integer, primaryKey } from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters"

// Define enums
export const IncidentStatusEnum = pgEnum('incident_state', [
  'NEW', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'CLOSED', 'CANCELLED'
]);

export const priorityEnum = pgEnum('priority', [
  'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
]);

export const impactEnum = pgEnum('impact', [
  'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
]);

export const urgencyEnum = pgEnum('urgency', [
  'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
]);

export const userRoleEnum = pgEnum('user_role', [
  'END_USER', 'SERVICE_DESK', 'MANAGER', 'ADMIN'
]);

// Tables
export const incidents = pgTable('incidents', {
  id: text('id').primaryKey(),
  number: text('number').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: IncidentStatusEnum('status').notNull(),
  priority: priorityEnum('priority').notNull(),
  impact: impactEnum('impact').notNull(),
  urgency: urgencyEnum('urgency').notNull(),
  category: text('category').notNull(),
  subcategory: text('subcategory'),
  reportedById: text('reported_by_id').notNull().references(() => users.id),
  assignedToId: text('assigned_to_id').references(() => users.id),
  assignmentGroup: text('assignment_group'),
  resolution: text('resolution'),
  closeCode: text('close_code'),
  closeNotes: text('close_notes'),
  slaBreachTime: timestamp('sla_breach_time', { withTimezone: true }),
  businessService: text('business_service'),
  location: text('location'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

export const incidentComments = pgTable('incident_comments', {
  id: text('id').primaryKey(),
  incidentId: text('incident_id').notNull().references(() => incidents.id),
  userId: text('user_id').notNull().references(() => users.id),
  comment: text('comment').notNull(),
  isPrivate: boolean('is_private').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
});

export const incidentHistory = pgTable('incident_history', {
  id: text('id').primaryKey(),
  incidentId: text('incident_id').notNull().references(() => incidents.id),
  userId: text('user_id').notNull().references(() => users.id),
  field: text('field').notNull(),
  oldValue: text('old_value'),
  newValue: text('new_value'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
});

// Next-auth example
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  password: text("password"),
  role: userRoleEnum("role").notNull(),
  image: text("image"),
})
 
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)
 
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
)
 
export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
)