import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema({
  method: { type: String, required: true },          // JazzCash, EasyPaisa, etc.
  accountName: { type: String, required: true },     // Example: Ali Ahmed
  accountNumber: { type: String, required: true },   // Example: 03001234567
}, { timestamps: true });

export default mongoose.model("PaymentMethod", paymentMethodSchema);
