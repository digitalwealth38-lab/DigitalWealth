import { logActivity } from "../lib/logActivity.js";
import Contact from "../models/Contact.js";

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    console.log(name, email);

    // ✅ Save contact message
    const contact = await Contact.create({
      name,
      email,
      phone,
      message,
      userId: req.user?._id || null,
    });

    // ✅ Log activity
  await logActivity(
  req.user?._id || null,
  "CONTACT",
  `New contact message:
Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}`
);


    res.status(201).json({
      success: true,
      message: "Contact message saved successfully",
    });

  } catch (error) {
    console.error("Contact error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
