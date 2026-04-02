import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  message:    { type: String, required: true },
  type:       { type: String, enum: ["info", "warning", "success", "error"], default: "info" },
  bgColor:    { type: String, default: "#eff6ff" },
  textColor:  { type: String, default: "#1d4ed8" },
  borderColor:{ type: String, default: "#3b82f6" },
  icon:       { type: String, default: "📢" },
  link:       { type: String, default: "" },      // optional CTA button
  linkText:   { type: String, default: "" },      // e.g. "Learn More"
  active:     { type: Boolean, default: false },  // admin toggles this
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);