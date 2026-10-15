"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

// Reading progress lives in this browser only (localStorage). Everything here fails
// quietly when storage is blocked: the pages still work, they just forget progress.

const listeners = new Set();

function read(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // storage blocked or full: ignore
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

// The server and the first client render see null, so markup always matches
function useStored(key) {
  return useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null
  );
}

const completedKey = (stackSlug) => `notes-completed:${stackSlug}`;
const lastKey = (stackSlug) => `notes-last:${stackSlug}`;

function parseList(raw) {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

// Lectures this visitor has marked complete in a course
export function useCompleted(stackSlug) {
  const raw = useStored(completedKey(stackSlug));
  const completed = useMemo(() => new Set(raw ? parseList(raw) : []), [raw]);

  const toggle = useCallback(
    (lectureSlug) => {
      const next = new Set(parseList(read(completedKey(stackSlug))));
      if (next.has(lectureSlug)) next.delete(lectureSlug);
      else next.add(lectureSlug);
      write(completedKey(stackSlug), JSON.stringify([...next]));
    },
    [stackSlug]
  );

  return { completed, toggle };
}

// The lecture this visitor opened most recently in a course
export function useLastLecture(stackSlug) {
  return useStored(lastKey(stackSlug));
}

export function rememberLecture(stackSlug, lectureSlug) {
  if (read(lastKey(stackSlug)) !== lectureSlug) write(lastKey(stackSlug), lectureSlug);
}
