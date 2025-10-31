import axios from "axios";
import User from "../models/user.model.js";
import Transaction from "../models/Transaction.js";
import dotenv from "dotenv"
dotenv.config()
// Start deposit



export const minamount = async (req, res) => {
  const SAFE_MIN_AMOUNTS = {
    USDTTRC20: 13,
    TRX: 2,
  };

  try {
    const currency = req.params.currency.toUpperCase();
    const baseCurrency = "USD";
    const apiKey = process.env.NOWPAYMENTS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ msg: "NOWPAYMENTS_API_KEY not found" });
    }

    console.log(`Fetching min amount for ${currency}...`);

    // Fetch from API
    const response = await axios.get(
      `https://api.nowpayments.io/v1/min-amount?currency_from=${baseCurrency}&currency_to=${currency}`,
      { headers: { "x-api-key": apiKey } }
    );

    const apiMin = parseFloat(response?.data?.min_amount || 0);
    const safeMin = SAFE_MIN_AMOUNTS[currency] || 10;

    // ✅ Use whichever is smaller — your safe tested value or API’s
    const finalMin = Math.min(apiMin || Infinity, safeMin);

    console.log(
      `✅ Final minimum for ${currency}: $${finalMin} (API: ${apiMin}, fallback: ${safeMin})`
    );

    return res.json({
      success: true,
      currency,
      minAmount: finalMin,
      usedFallback: finalMin === safeMin,
    });
  } catch (error) {
    console.error(
      "❌ Error fetching minimum amount:",
      error?.response?.data || error.message
    );

    const currency = req.params.currency?.toUpperCase?.() || "UNKNOWN";
    const fallback = SAFE_MIN_AMOUNTS[currency] || 10;

    return res.status(200).json({
      success: true,
      currency,
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
      type: "deposit", 
      status: "waiting",
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
  try {
    const { order_id, payment_status, price_amount } = req.body;
    console.log("🔔 Webhook received:", req.body);

    const transaction = await Transaction.findOne({ transactionId: order_id });
    if (!transaction) {
      console.log("⚠️ Transaction not found:", order_id);
      return res.status(404).json({ message: "Transaction not found" });
    }

    const status = payment_status.toLowerCase();

    switch (status) {
      case "waiting":
        transaction.status = "waiting";
        break;

      case "confirming":
        transaction.status = "confirming";
        break;

      case "finished":
        if (transaction.status !== "finished") {
          transaction.status = "finished";
          transaction.price_amount = price_amount;

          const user = await User.findById(transaction.user);
          if (user) {
            // ✅ Deduct 1.08% platform fee
            const fee = (price_amount * 1.08) / 100;
            const creditedAmount = price_amount - fee;

            user.balance += creditedAmount;
            transaction.price_amount = creditedAmount;
            await user.save();

            // Save fee info in transaction
            transaction.fee = fee;
            transaction.creditedAmount = creditedAmount;
            console.log(
              `✅ User ${user.name} credited $${creditedAmount} after 0.5% fee ($${fee} deducted)`
            );
          }
        }
        break;

      case "failed":
      case "expired":
        transaction.status = "failed";
        break;

      default:
        console.log("⚠️ Unknown payment status:", payment_status);
        break;
    }

    await transaction.save();
    console.log(`💾 Transaction ${order_id} updated to ${transaction.status}`);

    return res.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


