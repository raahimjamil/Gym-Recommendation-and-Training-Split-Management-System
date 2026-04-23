import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();
import cors from 'cors';
const PORT = process.env.PORT || 3000;
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import planRoutes from './src/routes/planRoutes.js';
import cookieParser from 'cookie-parser';
const JWT_SECRET = 'your_jwt_secret_key';
import authMiddleware from './middleware/authMiddleware.js';

app.use(cors({
  origin: "http://localhost:5173", // your React app URL
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())

app.use('/auth', authRoutes);
app.use('/user', authMiddleware, userRoutes);
app.use('/api', planRoutes);

app.get("/check-auth", authMiddleware, (req, res) => {
  return res.json({ loggedIn: true });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});