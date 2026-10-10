// Complete Artificial Intelligence course — each lecture lives in lib/notesData/ai/
import { lecture01 } from "./ai/lecture01";
import { lecture02 } from "./ai/lecture02";
import { lecture03 } from "./ai/lecture03";
import { lecture04 } from "./ai/lecture04";
import { lecture05 } from "./ai/lecture05";
import { lecture06 } from "./ai/lecture06";
import { lecture07 } from "./ai/lecture07";
import { lecture08 } from "./ai/lecture08";

const lectures = [
  lecture01,
  lecture02,
  lecture03,
  lecture04,
  lecture05,
  lecture06,
  lecture07,
  lecture08,
];

export const aiData = {
  id: "ai",
  slug: "ai",
  name: "Artificial Intelligence",
  icon: "fas fa-robot",
  iconColor: "#ff7b00",
  badge: "AI & Machine Learning",
  description: "Complete AI & LLM engineering course: ML foundations, scikit-learn, PyTorch, transformers, how LLMs work, prompt engineering, the Claude API, embeddings and vector search, RAG, agents and MCP, and shipping AI to production.",
  totalLectures: lectures.length,
  lectures,
};
