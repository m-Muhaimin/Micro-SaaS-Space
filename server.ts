import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON payloads with high limit for logos/base64 uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Route: POST /api/products
  app.post("/api/products", (req, res) => {
    try {
      const productData = req.body;
      
      if (!productData.name || !productData.tagline) {
        return res.status(400).json({
          error: "Missing required fields. 'name' and 'tagline' are required.",
        });
      }

      console.log("[SERVER] Product submission received:", productData.name);
      
      // Return a simulated success status along with the processed data
      return res.status(201).json({
        success: true,
        message: "Product submitted successfully via /api/products!",
        product: {
          ...productData,
          id: `prod_api_${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
      });
    } catch (err: any) {
      console.error("[SERVER] Error processing product:", err);
      return res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Full-stack server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[SERVER] Server startup failed:", err);
});
