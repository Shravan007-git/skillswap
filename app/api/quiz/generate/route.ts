import { NextRequest, NextResponse } from "next/server";

// Hardcoded quiz questions per skill — no API key needed
// Replace with Claude API later by setting ANTHROPIC_API_KEY in .env.local
const QUIZ_BANK: Record<string, { question: string; options: string[]; correct: number }[]> = {
  Python: [
    { question: "What is the output of print(type([]))?", options: ["A. <class 'list'>", "B. <class 'array'>", "C. <class 'tuple'>", "D. <class 'dict'>"], correct: 0 },
    { question: "Which keyword is used to define a function in Python?", options: ["A. function", "B. def", "C. fun", "D. define"], correct: 1 },
    { question: "What does len('hello') return?", options: ["A. 4", "B. 6", "C. 5", "D. 3"], correct: 2 },
    { question: "Which of these is a mutable data type in Python?", options: ["A. tuple", "B. string", "C. int", "D. list"], correct: 3 },
    { question: "What is the correct way to create a dictionary in Python?", options: ["A. d = {}", "B. d = []", "C. d = ()", "D. d = <>"], correct: 0 },
  ],
  JavaScript: [
    { question: "Which keyword declares a block-scoped variable in JavaScript?", options: ["A. var", "B. let", "C. set", "D. define"], correct: 1 },
    { question: "What does === check in JavaScript?", options: ["A. Value only", "B. Type only", "C. Value and type", "D. Neither"], correct: 2 },
    { question: "What will typeof null return?", options: ["A. 'null'", "B. 'undefined'", "C. 'object'", "D. 'boolean'"], correct: 2 },
    { question: "Which method adds an element to the end of an array?", options: ["A. push()", "B. pop()", "C. shift()", "D. append()"], correct: 0 },
    { question: "What does the 'async' keyword do to a function?", options: ["A. Makes it run faster", "B. Makes it return a Promise", "C. Makes it synchronous", "D. Makes it loop"], correct: 1 },
  ],
  React: [
    { question: "What hook is used to manage state in a functional component?", options: ["A. useEffect", "B. useContext", "C. useState", "D. useRef"], correct: 2 },
    { question: "What does JSX stand for?", options: ["A. JavaScript XML", "B. Java Syntax Extension", "C. JSON XML", "D. JavaScript XHR"], correct: 0 },
    { question: "When does useEffect run by default?", options: ["A. Only once", "B. Never", "C. After every render", "D. Before render"], correct: 2 },
    { question: "What is the correct way to pass data from parent to child?", options: ["A. State", "B. Props", "C. Context only", "D. Redux only"], correct: 1 },
    { question: "Which is NOT a valid React Hook rule?", options: ["A. Call hooks at top level", "B. Call hooks from React functions", "C. Call hooks inside conditions", "D. Call hooks in custom hooks"], correct: 2 },
  ],
  Figma: [
    { question: "What is a Component in Figma?", options: ["A. A reusable design element", "B. A colour palette", "C. A font style", "D. A page layout"], correct: 0 },
    { question: "What does Auto Layout in Figma do?", options: ["A. Exports files", "B. Arranges elements dynamically based on content", "C. Creates animations", "D. Syncs with code"], correct: 1 },
    { question: "What is a Frame in Figma?", options: ["A. A border around an image", "B. A container that acts like an artboard", "C. A type of font", "D. A plugin"], correct: 1 },
    { question: "What is the shortcut to create a component in Figma?", options: ["A. Ctrl+G", "B. Ctrl+K", "C. Ctrl+Alt+K", "D. Ctrl+C"], correct: 2 },
    { question: "What are Variants in Figma used for?", options: ["A. Color themes", "B. Grouping similar components with different states", "C. Creating animations", "D. Exporting assets"], correct: 1 },
  ],
  Excel: [
    { question: "Which function returns the largest value in a range?", options: ["A. LARGE()", "B. MAX()", "C. TOP()", "D. HIGH()"], correct: 1 },
    { question: "What does VLOOKUP stand for?", options: ["A. Variable Lookup", "B. Vertical Lookup", "C. Value Lookup", "D. Vector Lookup"], correct: 1 },
    { question: "Which symbol starts a formula in Excel?", options: ["A. #", "B. @", "C. =", "D. $"], correct: 2 },
    { question: "What does the $ symbol do in a cell reference like $A$1?", options: ["A. Formats as currency", "B. Locks the reference when copied", "C. Multiplies the value", "D. Adds a border"], correct: 1 },
    { question: "Which function counts cells that are not empty?", options: ["A. COUNT()", "B. COUNTA()", "C. COUNTIF()", "D. SUM()"], correct: 1 },
  ],
  "Machine Learning": [
    { question: "What is overfitting in machine learning?", options: ["A. Model performs poorly on training data", "B. Model memorises training data but fails on new data", "C. Model runs too slowly", "D. Model has too few parameters"], correct: 1 },
    { question: "Which algorithm is used for classification tasks?", options: ["A. Linear Regression", "B. K-Means", "C. Logistic Regression", "D. PCA"], correct: 2 },
    { question: "What does 'training' a model mean?", options: ["A. Writing code for the model", "B. Adjusting model parameters to minimise error on data", "C. Collecting more data", "D. Deploying the model"], correct: 1 },
    { question: "What is a feature in machine learning?", options: ["A. A model output", "B. An input variable used to make predictions", "C. A type of neural network", "D. A loss function"], correct: 1 },
    { question: "What does cross-validation help with?", options: ["A. Speeding up training", "B. Reducing dataset size", "C. Estimating model performance on unseen data", "D. Improving visualisations"], correct: 2 },
  ],
};

// Generic fallback questions for any skill not in the bank
function getGenericQuestions(skill: string) {
  return [
    { question: `How long have you been working with ${skill}?`, options: ["A. Less than 3 months", "B. 3–6 months", "C. 6–12 months", "D. Over a year"], correct: 3 },
    { question: `Which best describes your ${skill} level?`, options: ["A. Complete beginner", "B. Can do basics", "C. Can work independently", "D. Can teach others"], correct: 2 },
    { question: `Have you used ${skill} in a real project?`, options: ["A. No, only tutorials", "B. Yes, one small project", "C. Yes, multiple projects", "D. Yes, professionally"], correct: 2 },
    { question: `Can you explain a core concept of ${skill} to a beginner?`, options: ["A. No, still learning myself", "B. Sort of, with difficulty", "C. Yes, clearly", "D. Yes, and I can give examples"], correct: 3 },
    { question: `What would you do if a student got stuck on a ${skill} problem?`, options: ["A. Tell them to Google it", "B. Give them the answer directly", "C. Break it into smaller steps and guide them", "D. Skip and move on"], correct: 2 },
  ];
}

export async function POST(req: NextRequest) {
  const { skill } = await req.json();
  if (!skill) return NextResponse.json({ error: "Skill is required" }, { status: 400 });

  // Check if we have questions for this skill, otherwise use generic
  const questions = QUIZ_BANK[skill] || getGenericQuestions(skill);

  // Shuffle slightly so it doesn't feel static
  const shuffled = [...questions].sort(() => Math.random() - 0.3);

  return NextResponse.json({ questions: shuffled.slice(0, 5) });
}
