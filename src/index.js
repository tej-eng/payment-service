import "dotenv/config";

import express from "express";
import routes from "./routes/route.js";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

const app = express();

/* ---------------- TRUST PROXY ---------------- */
/* Required when running behind Apache/Nginx */
app.set("trust proxy", true);

/* ---------------- MIDDLEWARE ---------------- */
app.use(morgan("dev"));
app.use(express.json());

/* ---------------- CORS ---------------- */
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (!allowedOrigins.includes(origin)) {
        return callback(new Error(`CORS not allowed for ${origin}`), false);
      }

      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

/* ---------------- RATE LIMIT ---------------- */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,

  // Fix for Apache reverse proxy validation warning
  validate: {
    xForwardedForHeader: false,
  },

  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

app.use("/api", limiter);

/* ---------------- ROUTES ---------------- */
app.use(routes);

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Payment Service Running",
  });
});

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 8005;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});