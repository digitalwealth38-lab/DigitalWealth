import PaymentMethod from "../models/PaymentMethod.js";

// CREATE
export const createMethod = async (req, res) => {
  try {
    const { method, accountName, accountNumber, qrCode } = req.body;

    if (!method || !accountName || !accountNumber) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newMethod = await PaymentMethod.create({
      method,
      accountName,
      accountNumber,
      qrCode, // ✅ SAVE QR
    });

    res.json(newMethod);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// GET ALL
export const getMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.find().sort({ createdAt: -1 });
    res.json(methods);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// UPDATE (SAFE VERSION)
export const updateMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { method, accountName, accountNumber, qrCode } = req.body;

    const updated = await PaymentMethod.findByIdAndUpdate(
      id,
      {
        method,
        accountName,
        accountNumber,
        qrCode, // ✅ update QR too
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Method not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// DELETE
export const deleteMethod = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await PaymentMethod.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Method not found" });
    }

    res.json({ message: "Method deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// GET BY NAME (USER SIDE)
export const getMethodByName = async (req, res) => {
  try {
    const { method } = req.params;

    const found = await PaymentMethod.findOne({ method });

    if (!found) {
      return res.status(404).json({ message: "Method not found" });
    }

    res.json(found);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};