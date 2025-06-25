import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trains = pgTable("trains", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  trainType: text("train_type").notNull(),
  departureTime: text("departure_time").notNull(),
  arrivalTime: text("arrival_time").notNull(),
  frequency: text("frequency").notNull(),
  isActive: boolean("is_active").default(true),
});

export const stations = pgTable("stations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sinhalaName: text("sinhala_name").notNull(),
  distanceFromColombo: integer("distance_from_colombo").notNull(),
  order: integer("order").notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  trainId: integer("train_id").references(() => trains.id).notNull(),
  stationId: integer("station_id").references(() => stations.id).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).default('100.00'),
  paymentMethod: text("payment_method").notNull(), // 'card' or 'cash'
  paymentStatus: text("payment_status").default('pending'), // 'pending', 'paid', 'failed'
  orderStatus: text("order_status").default('placed'), // 'placed', 'preparing', 'ready', 'delivered', 'cancelled'
  customerPhone: text("customer_phone").notNull(),
  seatInfo: text("seat_info"),
  items: json("items").notNull(), // Array of {menuItemId, quantity, price}
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const trainsRelations = relations(trains, ({ many }) => ({
  orders: many(orders),
}));

export const stationsRelations = relations(stations, ({ many }) => ({
  orders: many(orders),
}));

export const menuItemsRelations = relations(menuItems, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  train: one(trains, {
    fields: [orders.trainId],
    references: [trains.id],
  }),
  station: one(stations, {
    fields: [orders.stationId],
    references: [stations.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTrainSchema = createInsertSchema(trains).omit({
  id: true,
});

export const insertStationSchema = createInsertSchema(stations).omit({
  id: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Train = typeof trains.$inferSelect;
export type InsertTrain = z.infer<typeof insertTrainSchema>;
export type Station = typeof stations.$inferSelect;
export type InsertStation = z.infer<typeof insertStationSchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
