import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: ["asset_buy", "asset_claim"],
    },

    amount: Number,

    message: String,
  },
  { timestamps: true }
);

const Assettransaction = mongoose.model("Assettransaction", transactionSchema);

export default Assettransaction;