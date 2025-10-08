import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true // Explicitly create an index on email
  },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    default: "user",
    index: true // Index on role for queries filtering by role
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true // Index on createdAt for sorting or range queries
  },
});

// Compound index for queries involving email and role together
userSchema.index({ email: 1, role: 1 });

// Ensure the model is only created once to avoid OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;