const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String },
  description: String,
  techStack: [String],
  githubLink: String,
  liveDemo: String,
  image: String,
});

const experienceSchema = new mongoose.Schema({
  company: { type: String},
  position: String,
  duration: String,
  description: String,
});

const educationSchema = new mongoose.Schema({
  school: { type: String},
  degree: String,
  year: String,
  description: String,
});

const skillSchema = new mongoose.Schema({
  name: { type: String},
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" }
});

const socialSchema = new mongoose.Schema({
  platform: String,
  link: String
});

const contactSchema = new mongoose.Schema({
  phone: String,
  address: String,
  website: String,
  email: String
});

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
    unique: true
  },
  name: { type: String  },
  title: String,
  bio: String,
  avatar: String, 
  contactEmail: String,

  socialLinks: [socialSchema],
  skills: [skillSchema],
  projects: [projectSchema],
  experience: [experienceSchema],
  education: [educationSchema],
  contact:[contactSchema],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Portfolio", portfolioSchema);
