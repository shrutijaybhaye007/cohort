import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Internship", "Hackathon", "Workshop", "Competition", "Scholarship", "Event", "Webinar"],
      required: true,
    },
    location: { type: String, default: "" },
    isRemote: { type: Boolean, default: false },
    deadline: { type: Date },
    description: { type: String, required: true },
    skills: [{ type: String }],
    applyUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

opportunitySchema.index({ type: 1, isActive: 1 });
opportunitySchema.index({ deadline: 1 });

export default mongoose.model("Opportunity", opportunitySchema);
