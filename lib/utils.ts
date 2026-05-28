import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SKILLS_LIST = [
  // Tech
  "Python", "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
  "SQL", "MongoDB", "AWS", "Docker", "Git", "Machine Learning", "Data Science",
  "Figma", "UI/UX Design", "Photoshop", "Illustrator",
  // Business
  "Excel", "PowerPoint", "Financial Modelling", "Digital Marketing",
  "SEO", "Content Writing", "Copywriting", "Public Speaking",
  "Project Management", "Leadership",
  // Creative
  "Guitar", "Piano", "Singing", "Video Editing", "Photography",
  "Drawing", "Painting", "Yoga", "Dance",
  // Languages
  "English", "Hindi", "Telugu", "Tamil", "Spanish", "French",
  // Other
  "Chess", "Cooking", "Fitness Training", "Stock Market", "Crypto",
];

export const SKILL_CATEGORIES: Record<string, string[]> = {
  "💻 Tech": ["Python", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "SQL", "MongoDB", "AWS", "Docker", "Git", "Machine Learning", "Data Science"],
  "🎨 Design": ["Figma", "UI/UX Design", "Photoshop", "Illustrator", "Drawing", "Painting"],
  "📊 Business": ["Excel", "PowerPoint", "Financial Modelling", "Digital Marketing", "SEO", "Content Writing", "Copywriting", "Public Speaking", "Project Management", "Leadership"],
  "🎵 Creative": ["Guitar", "Piano", "Singing", "Video Editing", "Photography", "Dance"],
  "🗣️ Languages": ["English", "Hindi", "Telugu", "Tamil", "Spanish", "French"],
  "⚡ Other": ["Chess", "Cooking", "Fitness Training", "Stock Market", "Crypto", "Yoga"],
};

export function getSkillEmoji(skill: string): string {
  const map: Record<string, string> = {
    Python: "🐍", JavaScript: "⚡", TypeScript: "📘", React: "⚛️",
    "Next.js": "▲", "Node.js": "🟢", SQL: "🗄️", MongoDB: "🍃",
    AWS: "☁️", Docker: "🐳", Git: "🌿", "Machine Learning": "🤖",
    "Data Science": "📊", Figma: "🎨", "UI/UX Design": "✏️",
    Photoshop: "🖼️", Illustrator: "🖊️", Excel: "📗", PowerPoint: "📙",
    "Financial Modelling": "💹", "Digital Marketing": "📱", SEO: "🔍",
    "Content Writing": "✍️", Copywriting: "📝", "Public Speaking": "🎤",
    Guitar: "🎸", Piano: "🎹", Singing: "🎵", "Video Editing": "🎬",
    Photography: "📸", Drawing: "🎨", Chess: "♟️", Cooking: "👨‍🍳",
    "Fitness Training": "💪", "Stock Market": "📈", Crypto: "₿",
    English: "🇬🇧", Hindi: "🇮🇳", Telugu: "🤝", Tamil: "🌺",
    Spanish: "🇪🇸", French: "🇫🇷", Dance: "💃", Yoga: "🧘",
  };
  return map[skill] || "🎯";
}

export function calculateCompatibility(teachSkills: string[], learnSkills: string[], otherTeach: string[], otherLearn: string[]): number {
  const iTeach = teachSkills.filter(s => otherLearn.includes(s)).length;
  const iLearn = learnSkills.filter(s => otherTeach.includes(s)).length;
  const total = Math.max(teachSkills.length, learnSkills.length, 1);
  return Math.min(100, Math.round(((iTeach + iLearn) / (total * 2)) * 100 + Math.random() * 15));
}
