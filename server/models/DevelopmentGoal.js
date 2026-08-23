import mongoose from "mongoose";

const developmentGoalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed"],
      default: "not-started",
    },
    targetDate: { type: Date },
  },
  { timestamps: true }
);

developmentGoalSchema.index({ user: 1, status: 1 });
developmentGoalSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("DevelopmentGoal", developmentGoalSchema);
