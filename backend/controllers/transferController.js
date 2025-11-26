import User from "../models/user.model.js";
import Transfer from "../models/transfer.js";

// Transfer money from one user to another
export const transferMoney = async (req, res) => {
  try {
    const { fromUserId, toUserId, amount } = req.body;
    console.log("Query object:", req.body);

    if (!fromUserId || !toUserId || !amount) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (fromUserId === toUserId) {
      return res.status(400).json({ error: "Cannot transfer to yourself" });
    }

    // Fetch sender and receiver
    const sender = await User.findById(fromUserId);
    const receiver = await User.findById(toUserId);

    if (!sender || !receiver) {
      return res.status(404).json({ error: "Sender or receiver not found" });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Update balances
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    // Record transaction with userIds
const transaction = await Transfer.create({
  fromUser: fromUserId,
  toUser: toUserId,
  fromUserId: sender.userId, 
  fromUsername: sender.name,
  toUserId: receiver.userId, 
  toUsername: receiver.name,
  amount,
});


    res.status(200).json({ 
      success: true, 
      message: `Transferred $${amount} from ${sender.userId} to ${receiver.userId}`, 
      transaction 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Transfer failed" });
  }
};


// Get all transactions of a user
export const getUsertransfer = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId)

    const transactions = await Transfer.find({
      $or: [{ fromUser: userId }, { toUser: userId }]
    })
      .populate("fromUser", "name email")
      .populate("toUser", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, transactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};