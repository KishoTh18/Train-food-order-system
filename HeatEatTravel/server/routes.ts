import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not found, payment functionality will be limited');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Train routes
  app.get("/api/trains", async (req, res) => {
    try {
      const trains = await storage.getAllTrains();
      res.json(trains);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching trains: " + error.message });
    }
  });

  app.get("/api/trains/:id", async (req, res) => {
    try {
      const train = await storage.getTrain(parseInt(req.params.id));
      if (!train) {
        return res.status(404).json({ message: "Train not found" });
      }
      res.json(train);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching train: " + error.message });
    }
  });

  // Station routes
  app.get("/api/stations", async (req, res) => {
    try {
      const stations = await storage.getAllStations();
      res.json(stations);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching stations: " + error.message });
    }
  });

  app.get("/api/stations/:id", async (req, res) => {
    try {
      const station = await storage.getStation(parseInt(req.params.id));
      if (!station) {
        return res.status(404).json({ message: "Station not found" });
      }
      res.json(station);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching station: " + error.message });
    }
  });

  // Menu routes
  app.get("/api/menu", async (req, res) => {
    try {
      const { category } = req.query;
      if (category && typeof category === 'string') {
        const items = await storage.getMenuItemsByCategory(category);
        res.json(items);
      } else {
        const items = await storage.getAllMenuItems();
        res.json(items);
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching menu items: " + error.message });
    }
  });

  app.get("/api/menu/:id", async (req, res) => {
    try {
      const item = await storage.getMenuItem(parseInt(req.params.id));
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching menu item: " + error.message });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const orderData = {
        ...req.body,
        userId: req.user!.id,
      };

      const validatedOrder = insertOrderSchema.parse(orderData);
      const order = await storage.createOrder(validatedOrder);

      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating order: " + error.message });
    }
  });

  app.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const orders = await storage.getUserOrders(req.user!.id);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching orders: " + error.message });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const order = await storage.getOrder(parseInt(req.params.id));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Ensure user can only access their own orders
      if (order.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching order: " + error.message });
    }
  });

  // Payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!stripe) {
      return res.status(500).json({ message: "Payment processing not configured" });
    }

    try {
      const { amount, orderId } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(amount) * 100), // Convert LKR to cents
        currency: "lkr",
        metadata: {
          orderId: orderId?.toString() || '',
          userId: req.user!.id.toString(),
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post("/api/payment-success", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const { orderId } = req.body;
      
      const order = await storage.updatePaymentStatus(parseInt(orderId), 'paid');
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json({ message: "Payment confirmed", order });
    } catch (error: any) {
      res.status(500).json({ message: "Error confirming payment: " + error.message });
    }
  });

  // Admin routes for order management
  app.get("/api/admin/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/orders/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await storage.updateOrderStatus(parseInt(id), status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/orders/:id/payment", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;
      const order = await storage.updatePaymentStatus(parseInt(id), paymentStatus);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
