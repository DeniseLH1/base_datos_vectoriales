import express from "express";
import cors from "cors";
import { oraculoRouter } from "./routes/oraculo.routes.js";

export const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "oraculo-api",
    timestamp: new Date().toISOString(),
    uptime: Number(process.uptime().toFixed(2)),
  });
});

app.use("/api/oraculo", oraculoRouter);

app.use((_req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});

app.use((error, _req, res, _next) => {
  console.error("[ERROR]", error);
  const status = Number.isInteger(error?.statusCode) ? error.statusCode : 500;
  res.status(status).json({
    ok: false,
    message: error?.message || "Error interno del servidor",
  });
});

export default app;
