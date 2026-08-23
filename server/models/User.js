import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    tech: [{ type: String }],
    githubUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    date: { type: String, default: "" },
  },
  { timestamps: true }
);

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    issuer: { type: String, default: "" },
    date: { type: String, default: "" },
    url: { type: String, default: "" },
  },
  { timestamps: true }
);

const skillProficiencySchema = new mongoose.Schema(
  {
    skill: { type: String, required: true },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    headline: { type: String, default: "", trim: true },
    university: { type: String, default: "", trim: true },
    program: { type: String, default: "", trim: true },
    year: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    bio: { type: String, default: "" },
    skills: { type: [String], default: [] },
    skillProficiencies: { type: [skillProficiencySchema], default: [] },
    interests: { type: [String], default: [] },
    projects: { type: [projectSchema], default: [] },
    certifications: { type: [certificationSchema], default: [] },
    achievements: { type: [String], default: [] },
    links: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },
    avatarColor: { type: String, default: "#2F5233" },
    avatarUrl: { type: String, default: "" },
    onboardingComplete: { type: Boolean, default: false },
    credits: { type: Number, default: 10 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
