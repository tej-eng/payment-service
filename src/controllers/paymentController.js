// src/controllers/paymentController.js

import 'dotenv/config';  

import Razorpay from 'razorpay';
import { v4 as uuidv4 } from 'uuid';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { rechargePackId, amount, userId, coins } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // in paisa
      currency: "INR",
      receipt: uuidv4(),
      notes: {
        userId,
        rechargePackId,
        coins,
      },
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};