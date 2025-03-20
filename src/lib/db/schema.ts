import {
    integer,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
    json,
    boolean,
  } from "drizzle-orm/pg-core";
  
  export const userSystemEnum = pgEnum("user_system_enum", ["system", "user"]);
  
  export const chats = pgTable("chats", {
    id: serial("id").primaryKey(),
    pdfName: text("pdf_name").notNull(),
    pdfUrl: text("pdf_url").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    fileKey: text("file_key").notNull(),
  });
  
  export type DrizzleChat = typeof chats.$inferSelect;
  
  export const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    chatId: integer("chat_id")
      .references(() => chats.id)
      .notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    role: userSystemEnum("role").notNull(),
  });
  
  export const userSubscriptions = pgTable("user_subscriptions", {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull().unique(),
    stripeCustomerId: varchar("stripe_customer_id", { length: 256 })
      .notNull()
      .unique(),
    stripeSubscriptionId: varchar("stripe_subscription_id", {
      length: 256,
    }).unique(),
    stripePriceId: varchar("stripe_price_id", { length: 256 }),
    stripeCurrentPeriodEnd: timestamp("stripe_current_period_ended_at"),
  });
  
  export const posts = pgTable("posts", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: json("content").notNull(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    published: boolean("published").notNull().default(true),
    coverImage: text("cover_image"),
  });
  
  export const comments = pgTable("comments", {
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
    postId: integer("post_id")
      .references(() => posts.id)
      .notNull(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    parentId: integer("parent_id").references((): any => comments.id),
  });
  
  export const likes = pgTable("likes", {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
      .references(() => posts.id)
      .notNull(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  });
  
  export type Post = typeof posts.$inferSelect;
  export type Comment = typeof comments.$inferSelect;
  export type Like = typeof likes.$inferSelect;
  
  // Drizzle-orm
  // drizzle-kit