import {
  users,
  trains,
  stations,
  menuItems,
  orders,
  type User,
  type InsertUser,
  type Train,
  type InsertTrain,
  type Station,
  type InsertStation,
  type MenuItem,
  type InsertMenuItem,
  type Order,
  type InsertOrder,
} from "@shared/schema";
import { dbPromise, pool } from "./db";
import { eq, desc, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Train operations
  getAllTrains(): Promise<Train[]>;
  getTrain(id: number): Promise<Train | undefined>;
  createTrain(train: InsertTrain): Promise<Train>;

  // Station operations
  getAllStations(): Promise<Station[]>;
  getStation(id: number): Promise<Station | undefined>;
  createStation(station: InsertStation): Promise<Station>;

  // Menu operations
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  updatePaymentStatus(id: number, status: string): Promise<Order | undefined>;

  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const db = await dbPromise;
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = await dbPromise;
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const db = await dbPromise;
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = await dbPromise;
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Train operations
  async getAllTrains(): Promise<Train[]> {
    const db = await dbPromise;
    return await db.select().from(trains).where(eq(trains.isActive, true));
  }

  async getTrain(id: number): Promise<Train | undefined> {
    const db = await dbPromise;
    const [train] = await db.select().from(trains).where(eq(trains.id, id));
    return train || undefined;
  }

  async createTrain(insertTrain: InsertTrain): Promise<Train> {
    const db = await dbPromise;
    const [train] = await db.insert(trains).values(insertTrain).returning();
    return train;
  }

  // Station operations
  async getAllStations(): Promise<Station[]> {
    const db = await dbPromise;
    return await db.select().from(stations).orderBy(stations.order);
  }

  async getStation(id: number): Promise<Station | undefined> {
    const db = await dbPromise;
    const [station] = await db.select().from(stations).where(eq(stations.id, id));
    return station || undefined;
  }

  async createStation(insertStation: InsertStation): Promise<Station> {
    const db = await dbPromise;
    const [station] = await db.insert(stations).values(insertStation).returning();
    return station;
  }

  // Menu operations
  async getAllMenuItems(): Promise<MenuItem[]> {
    const db = await dbPromise;
    return await db.select().from(menuItems).where(eq(menuItems.isAvailable, true));
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    const db = await dbPromise;
    return await db
      .select()
      .from(menuItems)
      .where(and(eq(menuItems.category, category), eq(menuItems.isAvailable, true)));
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const db = await dbPromise;
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return item || undefined;
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const db = await dbPromise;
    const [item] = await db.insert(menuItems).values(insertMenuItem).returning();
    return item;
  }

  // Order operations
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const db = await dbPromise;
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const db = await dbPromise;
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    const db = await dbPromise;
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getAllOrders(): Promise<Order[]> {
    const db = await dbPromise;
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const db = await dbPromise;
    const [order] = await db
      .update(orders)
      .set({ orderStatus: status })
      .where(eq(orders.id, id))
      .returning();
    return order || undefined;
  }

  async updatePaymentStatus(id: number, status: string): Promise<Order | undefined> {
    const db = await dbPromise;
    const [order] = await db
      .update(orders)
      .set({ paymentStatus: status })
      .where(eq(orders.id, id))
      .returning();
    return order || undefined;
  }
}

export const storage = new DatabaseStorage();
