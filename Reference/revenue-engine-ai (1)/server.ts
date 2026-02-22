import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("revenue_engine.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    hypothesis TEXT,
    pricing TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS icps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    persona TEXT,
    pain_mapping TEXT,
    transformation TEXT,
    offer TEXT,
    objection_handling TEXT,
    FOREIGN KEY(product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    name TEXT,
    company TEXT,
    role TEXT,
    channel TEXT,
    status TEXT DEFAULT 'lead',
    reply_type TEXT,
    revenue_value REAL DEFAULT 0,
    last_contacted_at DATETIME,
    FOREIGN KEY(product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id INTEGER,
    content TEXT,
    type TEXT, -- 'outreach', 'follow-up', 'reply'
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(contact_id) REFERENCES contacts(id)
  );

  CREATE TABLE IF NOT EXISTS sprints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    current_day INTEGER DEFAULT 1,
    FOREIGN KEY(product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sprint_id INTEGER,
    day INTEGER,
    description TEXT,
    completed INTEGER DEFAULT 0,
    FOREIGN KEY(sprint_id) REFERENCES sprints(id)
  );

  CREATE TABLE IF NOT EXISTS content_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    platform TEXT,
    content TEXT,
    status TEXT DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
    res.json(products);
  });

  app.post("/api/products", (req, res) => {
    const { name, description, hypothesis, pricing } = req.body;
    const result = db.prepare("INSERT INTO products (name, description, hypothesis, pricing) VALUES (?, ?, ?, ?)").run(name, description, hypothesis, pricing);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/products/:id/icp", (req, res) => {
    const icp = db.prepare("SELECT * FROM icps WHERE product_id = ?").get(req.params.id);
    res.json(icp || null);
  });

  app.post("/api/products/:id/icp", (req, res) => {
    const { persona, pain_mapping, transformation, offer, objection_handling } = req.body;
    const existing = db.prepare("SELECT id FROM icps WHERE product_id = ?").get(req.params.id);
    if (existing) {
      db.prepare("UPDATE icps SET persona = ?, pain_mapping = ?, transformation = ?, offer = ?, objection_handling = ? WHERE product_id = ?")
        .run(persona, pain_mapping, transformation, offer, objection_handling, req.params.id);
      res.json({ success: true });
    } else {
      db.prepare("INSERT INTO icps (product_id, persona, pain_mapping, transformation, offer, objection_handling) VALUES (?, ?, ?, ?, ?, ?)")
        .run(req.params.id, persona, pain_mapping, transformation, offer, objection_handling);
      res.json({ success: true });
    }
  });

  app.get("/api/products/:id/contacts", (req, res) => {
    const contacts = db.prepare("SELECT * FROM contacts WHERE product_id = ?").all(req.params.id);
    res.json(contacts);
  });

  app.post("/api/products/:id/contacts", (req, res) => {
    const { name, company, role, channel } = req.body;
    const result = db.prepare("INSERT INTO contacts (product_id, name, company, role, channel) VALUES (?, ?, ?, ?, ?)")
      .run(req.params.id, name, company, role, channel);
    res.json({ id: result.lastInsertRowid });
  });

  app.patch("/api/contacts/:id", (req, res) => {
    const { status, reply_type, revenue_value } = req.body;
    const updates = [];
    const values = [];
    if (status !== undefined) { updates.push("status = ?"); values.push(status); }
    if (reply_type !== undefined) { updates.push("reply_type = ?"); values.push(reply_type); }
    if (revenue_value !== undefined) { updates.push("revenue_value = ?"); values.push(revenue_value); }
    
    if (updates.length > 0) {
      values.push(req.params.id);
      db.prepare(`UPDATE contacts SET ${updates.join(", ")} WHERE id = ?`).run(...values);
    }
    res.json({ success: true });
  });

  app.get("/api/products/:id/stats", (req, res) => {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_outreach,
        SUM(CASE WHEN reply_type IS NOT NULL THEN 1 ELSE 0 END) as total_replies,
        SUM(CASE WHEN status = 'booked' THEN 1 ELSE 0 END) as total_booked,
        SUM(CASE WHEN status = 'paying' THEN 1 ELSE 0 END) as total_paying,
        SUM(revenue_value) as total_revenue
      FROM contacts 
      WHERE product_id = ?
    `).get(req.params.id);
    res.json(stats);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
