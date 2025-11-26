import PaymentMethod from "../models/PaymentMethod.js";

export const createMethod = async (req, res) => {
  try {
    const { method, accountName, accountNumber } = req.body;
    console.log(method,accountName,accountNumber)

    if (!method || !accountName || !accountNumber) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newMethod = await PaymentMethod.create({
      method,
      accountName,
      accountNumber,
    });

    res.json(newMethod);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.find().sort({ createdAt: -1 });
    res.json(methods);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const updateMethod = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await PaymentMethod.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const deleteMethod = async (req, res) => {
  try {
    const { id } = req.params;
    await PaymentMethod.findByIdAndDelete(id);
    res.json({ message: "Method deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


// For USER SIDE → Fetch single method details by name
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
