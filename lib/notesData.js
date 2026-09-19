import { reactData } from "./notesData/reactData";
import { nextjsData } from "./notesData/nextjsData";
import { javaData } from "./notesData/javaData";
import { pythonData } from "./notesData/pythonData";
import { aiData } from "./notesData/aiData";

export const techStacks = [
  reactData,
  nextjsData,
  javaData,
  pythonData,
  aiData,
];

export function getAllTechStacks() {
  return techStacks;
}

export function getTechStack(slug) {
  return techStacks.find((stack) => stack.slug.toLowerCase() === slug.toLowerCase());
}

export function getLecture(techSlug, lectureSlug) {
  const stack = getTechStack(techSlug);
  if (!stack) return null;
  return stack.lectures.find((l) => l.slug.toLowerCase() === lectureSlug.toLowerCase());
}
