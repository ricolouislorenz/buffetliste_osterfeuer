import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-99a48398/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all buffet entries
app.get("/make-server-99a48398/entries", async (c) => {
  try {
    const entries = await kv.getByPrefix("buffet-entry-");
    console.log(`Retrieved ${entries.length} buffet entries`);
    return c.json({ entries: entries || [] });
  } catch (error) {
    console.log(`Error retrieving buffet entries: ${error}`);
    return c.json({ error: "Failed to retrieve entries", details: String(error) }, 500);
  }
});

// Add a new buffet entry
app.post("/make-server-99a48398/entries", async (c) => {
  try {
    const body = await c.req.json();
    const { name, dish } = body;
    
    if (!name || !dish) {
      return c.json({ error: "Name and dish are required" }, 400);
    }
    
    const id = crypto.randomUUID();
    const entry = { id, name, dish, createdAt: new Date().toISOString() };
    
    await kv.set(`buffet-entry-${id}`, entry);
    console.log(`Created buffet entry: ${id}`);
    
    return c.json({ entry });
  } catch (error) {
    console.log(`Error creating buffet entry: ${error}`);
    return c.json({ error: "Failed to create entry", details: String(error) }, 500);
  }
});

// Update an existing buffet entry
app.put("/make-server-99a48398/entries/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { name, dish } = body;
    
    if (!name || !dish) {
      return c.json({ error: "Name and dish are required" }, 400);
    }
    
    const existingEntry = await kv.get(`buffet-entry-${id}`);
    if (!existingEntry) {
      return c.json({ error: "Entry not found" }, 404);
    }
    
    const updatedEntry = { ...existingEntry, name, dish, updatedAt: new Date().toISOString() };
    await kv.set(`buffet-entry-${id}`, updatedEntry);
    console.log(`Updated buffet entry: ${id}`);
    
    return c.json({ entry: updatedEntry });
  } catch (error) {
    console.log(`Error updating buffet entry: ${error}`);
    return c.json({ error: "Failed to update entry", details: String(error) }, 500);
  }
});

// Delete a buffet entry
app.delete("/make-server-99a48398/entries/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    const existingEntry = await kv.get(`buffet-entry-${id}`);
    if (!existingEntry) {
      return c.json({ error: "Entry not found" }, 404);
    }
    
    await kv.del(`buffet-entry-${id}`);
    console.log(`Deleted buffet entry: ${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting buffet entry: ${error}`);
    return c.json({ error: "Failed to delete entry", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);