import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";

export const usersTable = sqliteTable("users", {
  id: text()
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  first_name: text("first_name", { length: 30 }).notNull(),
  last_name: text("last_name", { length: 30 }).notNull(),
  email: text("email", { length: 255 }).notNull().unique(),
  password: text("password", { length: 255 }).notNull(),
  role: text({ enum: ["USER", "ADMIN"] })
    .notNull()
    .default("USER"),
  creation_date: integer("creation_date", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
});

export const collectionsTable = sqliteTable("collections", {
  id: text()
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  title: text("title", { length: 100 }).notNull(),
  description: text("description", { length: 500 }),
  owner_id: text("owner_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  visibility: text({ enum: ["PRIVATE", "PUBLIC"] })
    .notNull()
    .default("PRIVATE"),
});

export const cardTable = sqliteTable("cards", {
  id: text()
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  front: text("front", { length: 300 }).notNull(),
  back: text("back", { length: 300 }).notNull(),
  front_URL: text("front_URL", { length: 300 }),
  back_URL: text("back_URL", { length: 300 }),
  collection_id: text("collection_id")
    .notNull()
    .references(() => collectionsTable.id, { onDelete: "cascade" }),
});

export const cardsUsersTable = sqliteTable("cards_users", {
  id: text()
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  card_id: text("card_id")
    .notNull()
    .references(() => cardTable.id, { onDelete: "cascade" }),
  user_id: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  level: integer("level").notNull().default(1),
  last_revision_date: integer("last_revision_date", { mode: "timestamp" }),
});
