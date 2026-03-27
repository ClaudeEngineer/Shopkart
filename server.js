const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

// ── CORS Setup ─────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://shopcartshopp.netlify.app",
  "https://punedeveloper.in",          // ✅ ADD THIS
  "https://www.punedeveloper.in",
  "https://punedeveloper.in/admin/login",          // ✅ ADD THIS
  "https://www.punedeveloper.in/admin/login"       // ✅ ALSO THIS (important)
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      return callback(null, false);
    }
  },
  credentials: true,
}));

// Preflight requests (for PUT, POST, DELETE from browsers)
app.options("*", cors());

// ── Body parsers ────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// ── Routes ────────────────────────────────────────────
app.use("/api/auth",       require("./routes/authRoutes"));
app.use("/api/products",   require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/cart",       require("./routes/cartRoutes"));
app.use("/api/orders",     require("./routes/orderRoutes"));
app.use("/api/users",      require("./routes/userRoutes"));

// ── Health check ──────────────────────────────────────
app.get("/", (req, res) => res.json({ status: "OK", message: "ShopKart API running 🚀" }));
app.get("/api/health", (req, res) => res.json({ status: "OK", message: "ShopKart API running 🚀" }));

// ── Error Handling ────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ShopKart Server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
});