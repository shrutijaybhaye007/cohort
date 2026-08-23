import mongoose from "mongoose";

// One document per connection request. `status` moves from "pending" to
// "accepted", or gets deleted if ignored. Query for a user's network by
// filtering where requester or recipient equals their id.
const connectionSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted"], default: "pending" },
  },
  { timestamps: true }
);

connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

export default mongoose.model("Connection", connectionSchema);
