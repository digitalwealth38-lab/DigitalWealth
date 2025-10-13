import axios from "axios";
import User from "../models/user.model.js";
import Transaction from "../models/Transaction.js";
import dotenv from "dotenv"
dotenv.config()
// Start deposit
export const minamount=async (req, res) => {
  const SAFE_MIN_AMOUNTS = {
  BTC: 50,   // BTC requires around $50 minimum
  ETH: 25,
  USDT: 5,
  LTC: 10,
  TRX: 5,
  BNB: 10,
};

  try {
    const { currency } = req.params.toUpperCase();
    const baseCurrency = "USD";
    const apiKey = process.env.NOWPAYMENTS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ msg: "NOWPAYMENTS_API_KEY not found" });
    }

    console.log(`Fetching min amount for ${currency}...`);

    // Try fetching from NowPayments
    const response = await axios.get(
      `https://api.nowpayments.io/v1/min-amount?currency_from=${baseCurrency}&currency_to=${currency}`,
      { headers: { "x-api-key": apiKey } }
    );

    let apiMin = parseFloat(response?.data?.min_amount || 0);

    // If API gives unrealistic value, use fallback
    const minAmount =
      apiMin < SAFE_MIN_AMOUNTS[currency] ? SAFE_MIN_AMOUNTS[currency] : apiMin;

    console.log(
      `✅ Final minimum for ${currency}: $${minAmount} (API: ${apiMin}, fallback: ${SAFE_MIN_AMOUNTS[currency]})`
    );

    return res.json({
      success: true,
      currency,
      minAmount,
      usedFallback: apiMin < SAFE_MIN_AMOUNTS[currency],
    });
  } catch (error) {
    console.error("❌ Error fetching minimum amount:", error?.response?.data || error.message);

    const fallback = SAFE_MIN_AMOUNTS[req.params.currency.toUpperCase()] || 10;
    res.status(200).json({
      success: true,
      currency: req.params.currency.toUpperCase(),
      minAmount: fallback,
      warning: "Used fallback amount due to API error",
    });
  }
};

export const startDeposit = async (req, res) => {
  const { amount, currency } = req.body;
  const userId = req.user.id;

  if (!amount || !currency) return res.status(400).json({ msg: "Amount and currency required" });

  try {
    const transactionId = `tx_${Date.now()}_${userId}`;

    // Save transaction as pending
    const transaction = new Transaction({
      user: userId,
      transactionId,
      amount,
      currency,
      status: "pending",
    });
    await transaction.save();

    // Call NowPayments API
    const npRes = await axios.post(
      "https://api.nowpayments.io/v1/invoice",
      {
        price_amount: amount,
        price_currency: "usd", // user deposits in USD
        pay_currency: currency, // crypto currency user wants to pay
        order_id: transactionId,
        ipn_callback_url: `${process.env.BASE_URL}/api/user/webhook`,
      },
      {
        headers: {
          "x-api-key": process.env.NOWPAYMENTS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
console.log(transactionId)
console.log("Full NowPayments response:", npRes.data);

    res.json({
    transactionId,
    invoice_url: npRes.data.invoice_url,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ msg: "Failed to create deposit" });
  }
};

// Webhook for NowPayments
export const paymentWebhook = async (req, res) => {
  const { order_id, payment_status, price_amount } = req.body;
  console.log("Webhook:", req.body);

  if (payment_status === "finished") {
    // Find transaction
    const transaction = await Transaction.findOne({ transactionId: order_id });
    if (transaction && transaction.status !== "finished") {
      transaction.status = "finished";
      await transaction.save();

      // Update user's balance
      const user = await User.findById(transaction.user);
      if (user) {
        user.balance += price_amount;
        await user.save();
        console.log(`User ${user.name} balance updated`);
      }
    }
  }

  res.json({ status: "ok" });
};
