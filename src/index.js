import 'dotenv/config';   

import express from "express";
import routes from "./routes/route.js";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

const app = express();
app.use(morgan("dev"));
app.use(express.json());

const allowedOrigins = [
  "http://localhost",
  "http://localhost:3000",

];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); 
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error(`CORS not allowed for ${origin}`), false);
    }
    return callback(null, true);
  },
  
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many requests, please try again later" },
});
app.use(limiter);

app.use(routes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

