/**
 * Cohort Database Seed Script
 * Run: node server/seeds/seed.js
 * Requires MONGODB_URI in server/.env (default: mongodb://localhost:27017/cohort)
 *
 * Demo login after seeding: sanket@demo.com / demo1234
 */

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dns from "node:dns";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Ensure DNS resolution succeeds for MongoDB Atlas SRV records
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // fallback to system resolver if setServers fails
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cohort";


console.log("Connecting to MongoDB…");
await mongoose.connect(MONGO_URI);
console.log("Connected.\n");

const User = (await import("../models/User.js")).default;
const Post = (await import("../models/Post.js")).default;
const Opportunity = (await import("../models/Opportunity.js")).default;
const Resource = (await import("../models/Resource.js")).default;

console.log("Clearing existing data…");
await Promise.all([
  User.deleteMany(),
  Post.deleteMany(),
  Opportunity.deleteMany(),
  Resource.deleteMany(),
]);

const pw = await bcrypt.hash("demo1234", 10);

console.log("Seeding users…");
const users = await User.insertMany([
  {
    name: "Sanket Desai",
    email: "sanket@demo.com",
    password: pw,
    headline: "Full-Stack Dev · React & Node.js",
    university: "Shivaji University",
    program: "B.Tech Computer Science",
    year: "3rd Year",
    location: "Kolhapur, MH",
    bio: "Passionate about building products that solve real problems. Exploring full-stack dev and open source.",
    skills: ["React", "Node.js", "MongoDB", "JavaScript", "Git"],
    interests: ["Web Development", "UI/UX", "Open Source"],
    avatarColor: "#2F5233",
    onboardingComplete: true,
    credits: 45,
  },
  {
    name: "Priya Nandakumar",
    email: "priya@demo.com",
    password: pw,
    headline: "CS Junior · Building accessible ML tools",
    university: "Shivaji University",
    program: "B.Tech Computer Science",
    year: "3rd Year",
    location: "Pune, MH",
    bio: "Researching low-resource NLP for regional languages.",
    skills: ["Python", "PyTorch", "TensorFlow", "Public Speaking", "SQL"],
    interests: ["AI/ML", "Data Science", "Research"],
    avatarColor: "#9C7D1B",
    credits: 68,
  },
  {
    name: "Aarav Deshmukh",
    email: "aarav@demo.com",
    password: pw,
    headline: "Final Year Mech · Formula Student captain",
    university: "COEP Technological University",
    program: "B.Tech Mechanical Engineering",
    year: "4th Year",
    location: "Pune, MH",
    bio: "Leading our Formula Student aero package. Looking for mentors in vehicle dynamics.",
    skills: ["SolidWorks", "CFD", "AutoCAD", "Team Leadership"],
    interests: ["Engineering", "Leadership"],
    avatarColor: "#6B4F3B",
    credits: 82,
  },
  {
    name: "Dr. Neha Kulkarni",
    email: "neha@demo.com",
    password: pw,
    headline: "Alumni Mentor · Ex-Amazon Applied Scientist",
    university: "Shivaji University",
    program: "Faculty",
    year: "Faculty",
    location: "Bengaluru, KA",
    bio: "Ex-Amazon applied scientist. Mentoring 3–4 students each semester.",
    skills: ["Mentorship", "Applied ML", "Career Guidance", "Python"],
    interests: ["Mentorship", "AI/ML"],
    avatarColor: "#4A7052",
    credits: 100,
  },
  {
    name: "Rohan Iyer",
    email: "rohan@demo.com",
    password: pw,
    headline: "Sophomore · Product design enthusiast",
    university: "MIT-WPU",
    program: "B.Des Product Design",
    year: "2nd Year",
    location: "Pune, MH",
    bio: "Learning UX research methods. Just wrapped a campus navigation usability study.",
    skills: ["Figma", "User Research", "Prototyping", "Adobe XD"],
    interests: ["UI/UX", "Product Design"],
    avatarColor: "#C9A227",
    credits: 41,
  },
  {
    name: "Aisha Khan",
    email: "aisha@demo.com",
    password: pw,
    headline: "Data Science · Kaggle Competitions",
    university: "VIT Pune",
    program: "B.Tech IT",
    year: "3rd Year",
    location: "Nashik, MH",
    bio: "Kaggle competitor building interpretable ML models for healthcare.",
    skills: ["Python", "Pandas", "Scikit-learn", "SQL"],
    interests: ["Data Science", "AI/ML"],
    avatarColor: "#C9A227",
    credits: 55,
  },
  {
    name: "Arjun Patel",
    email: "arjun@demo.com",
    password: pw,
    headline: "Android Dev · Kotlin & Firebase",
    university: "NMIMS University",
    program: "B.Tech IT",
    year: "4th Year",
    location: "Mumbai, MH",
    bio: "Published 2 apps on Play Store. Building a smart campus app.",
    skills: ["Kotlin", "Android", "Firebase", "REST APIs"],
    interests: ["Mobile Development"],
    avatarColor: "#2F5233",
    credits: 72,
  },
]);

const [u1, u2, u3, u4, u5] = users;

console.log("Seeding posts…");
await Post.insertMany([
  {
    author: u4._id,
    content: "Reminder for my mentees: the applied-ML showcase opens Monday. Bring a working prototype — I care more about what broke than what worked.",
    tag: "Mentorship",
    likes: [u2._id, u3._id],
    comments: [{ author: u2._id, content: "Noted! Finishing our eval notebook this weekend." }],
  },
  {
    author: u3._id,
    content: "Our Formula Student aero package passed wind-tunnel validation today. Six weeks of CFD iterations — the numbers matched simulation within 4%. Grateful for the whole team.",
    tag: "Milestone",
    likes: [u1._id, u4._id, u5._id],
    comments: [],
  },
  {
    author: u2._id,
    content: "Publishing a write-up on fine-tuning small models for Marathi text classification with under 2,000 labeled examples. Feedback welcome!",
    tag: "Research",
    likes: [u4._id],
    comments: [{ author: u5._id, content: "Would love to read this once it's up!" }],
  },
  {
    author: u5._id,
    content: "Ran a 12-person usability study on campus navigation apps. Nobody trusts an app that doesn't show building entrances. Full report going in my portfolio.",
    tag: "Project",
    likes: [u2._id],
    comments: [],
  },
]);

console.log("Seeding opportunities…");
const d = (days) => new Date(Date.now() + days * 86400000);
await Opportunity.insertMany([
  { title: "Frontend Intern — React + TypeScript", organization: "Postman", type: "Internship", location: "Bengaluru", isRemote: true, deadline: d(20), description: "Join Postman's growth team to build internal tools. Work on features shipped to millions of developers.", skills: ["React", "TypeScript", "REST APIs"], applyUrl: "https://postman.com/careers" },
  { title: "Smart India Hackathon 2025", organization: "Ministry of Education", type: "Hackathon", location: "Pan-India", deadline: d(35), description: "National hackathon — work on real government problem statements across health, agriculture, and education.", skills: ["Problem Solving", "Any tech stack"], applyUrl: "https://sih.gov.in" },
  { title: "Data Science Intern", organization: "Flipkart", type: "Internship", location: "Bengaluru", deadline: d(15), description: "Build recommendation models and A/B testing frameworks for Flipkart's e-commerce platform.", skills: ["Python", "SQL", "Pandas", "ML"], applyUrl: "https://flipkart.com/careers" },
  { title: "UX Design Workshop — Google", organization: "Google India", type: "Workshop", location: "Online", isRemote: true, deadline: d(10), description: "3-day intensive workshop on design thinking, user research, and Figma. Open to all design students.", skills: ["Figma", "User Research", "Design Thinking"], applyUrl: "https://events.google.com" },
  { title: "KPIT Sparkle 2025", organization: "KPIT Technologies", type: "Competition", location: "Pune", deadline: d(45), description: "Annual technology innovation competition for engineering students. Build in EV, automation, and sustainable tech.", skills: ["Embedded Systems", "IoT"], applyUrl: "https://kpitsparkle.com" },
  { title: "AICTE National Scholarship for STEM", organization: "AICTE", type: "Scholarship", location: "Pan-India", deadline: d(60), description: "Merit-based scholarship for technically-excellent students. Covers tuition for the entire degree.", skills: ["Academic Excellence"], applyUrl: "https://aicte-india.org/scholarships" },
  { title: "Backend Engineering Intern — Node.js", organization: "Razorpay", type: "Internship", location: "Bengaluru", deadline: d(25), description: "Build high-throughput payment processing microservices. Exposure to distributed systems and fintech.", skills: ["Node.js", "PostgreSQL", "Redis"], applyUrl: "https://razorpay.com/jobs" },
  { title: "Webinar: Breaking Into Product Management", organization: "Product School India", type: "Webinar", location: "Online", isRemote: true, deadline: d(5), description: "Panel with PMs from Google, Amazon, and Indian startups. Learn what it takes to break into PM.", skills: ["Communication", "Product Thinking"], applyUrl: "https://productschool.com/events" },
  { title: "HackTheBox Campus CTF", organization: "HackTheBox", type: "Competition", location: "Online", isRemote: true, deadline: d(30), description: "48-hour CTF for college teams. Real-world security challenges in web, crypto, forensics.", skills: ["Cybersecurity", "Linux", "Python"], applyUrl: "https://hackthebox.com/university" },
  { title: "ML Research Intern — IIT Bombay", organization: "IIT Bombay AI Lab", type: "Internship", location: "Mumbai", deadline: d(40), description: "Research internship in NLP and computer vision. Work alongside PhD students on published research.", skills: ["Python", "PyTorch", "Research", "Mathematics"], applyUrl: "https://iitb.ac.in/research" },
]);

console.log("Seeding resources…");
await Resource.insertMany([
  { title: "The Odin Project — Full Stack JS", category: "Web Development", description: "Free curriculum covering HTML, CSS, JavaScript, Node.js, React, and databases from beginner to job-ready.", difficulty: "Beginner", estimatedHours: 120, url: "https://www.theodinproject.com", tags: ["HTML", "CSS", "JavaScript", "React"] },
  { title: "CS50x — Intro to Computer Science", category: "Programming", description: "Harvard's legendary intro to CS. Covers C, Python, SQL, and web development.", difficulty: "Beginner", estimatedHours: 80, url: "https://cs50.harvard.edu/x", tags: ["C", "Python", "Algorithms"] },
  { title: "Fast.ai — Practical Deep Learning", category: "AI/ML", description: "Top-down deep learning with PyTorch. Used by researchers worldwide.", difficulty: "Intermediate", estimatedHours: 40, url: "https://course.fast.ai", tags: ["Python", "PyTorch", "Deep Learning"] },
  { title: "SQL for Data Analysis — Mode Analytics", category: "Database", description: "Hands-on SQL for real data analysis. Covers JOINs, subqueries, and window functions.", difficulty: "Beginner", estimatedHours: 20, url: "https://mode.com/sql-tutorial", tags: ["SQL", "Data Analysis"] },
  { title: "NeetCode DSA Roadmap", category: "Data Structures", description: "Structured DSA roadmap with video explanations and LeetCode problems by pattern.", difficulty: "Intermediate", estimatedHours: 60, url: "https://neetcode.io/roadmap", tags: ["DSA", "LeetCode", "Algorithms"] },
  { title: "Communication Skills Specialization", category: "Communication", description: "5-course Coursera specialization from University of Michigan covering writing, speaking, and presentations.", difficulty: "Beginner", estimatedHours: 30, url: "https://www.coursera.org/specializations/communication-skills", tags: ["Communication", "Writing"] },
  { title: "Harvard Resume Writing Guide", category: "Resume Building", description: "Harvard OCS guide to compelling resumes and cover letters for internships.", difficulty: "Beginner", estimatedHours: 3, url: "https://ocs.fas.harvard.edu/resumes-cvs", tags: ["Resume", "Job Search"] },
  { title: "Figma UI Design — Zero to Hero", category: "UI/UX", description: "Complete Figma course: components, auto-layout, prototyping, and design systems.", difficulty: "Beginner", estimatedHours: 25, url: "https://www.figma.com/resources/learn-design", tags: ["Figma", "UI Design"] },
  { title: "Tech Interview Handbook", category: "Career Development", description: "LinkedIn optimization, cold outreach, interviews, salary negotiation — the complete career guide.", difficulty: "Beginner", estimatedHours: 5, url: "https://www.techinterviewhandbook.org", tags: ["Internship", "Job Search", "Networking"] },
  { title: "Kaggle Learn — Machine Learning", category: "Data Science", description: "Free mini-courses: pandas, ML fundamentals, feature engineering, and computer vision.", difficulty: "Beginner", estimatedHours: 15, url: "https://www.kaggle.com/learn", tags: ["ML", "Python", "Pandas"] },
  { title: "PortSwigger Web Security Academy", category: "Cybersecurity", description: "Free web security training from Burp Suite creators. Covers XSS, SQL injection, and more.", difficulty: "Intermediate", estimatedHours: 50, url: "https://portswigger.net/web-security", tags: ["Security", "Web", "Ethical Hacking"] },
  { title: "Cracking the Coding Interview Prep", category: "Interview Prep", description: "Curated resources for FAANG interviews. Behavioral, system design, and coding practice.", difficulty: "Advanced", estimatedHours: 100, url: "https://www.techinterviewhandbook.org", tags: ["Interview", "DSA", "System Design"] },
]);

console.log(`
✅ Database seeded!
   Users: ${users.length}
   Opportunities: 10
   Resources: 12

Demo login → sanket@demo.com / demo1234
`);

await mongoose.disconnect();
