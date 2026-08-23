import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        "Web Development", "Programming", "Database", "Data Structures",
        "Communication", "Interview Prep", "Resume Building", "Career Development",
        "Data Science", "UI/UX", "Cybersecurity", "AI/ML",
      ],
      required: true,
    },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    estimatedHours: { type: Number, default: 1 },
    url: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

resourceSchema.index({ category: 1 });
resourceSchema.index({ difficulty: 1 });

export default mongoose.model("Resource", resourceSchema);
