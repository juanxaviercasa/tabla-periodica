import { readStoredValue, writeStoredValue } from "./utils/safeStorage.js";
const STORAGE_KEY = "quimica-preuni-progress";

const CONTENT_REVISION = 1;
const defaultProgress = () => ({ contentRevision: CONTENT_REVISION, scores: {}, mistakes: {}, mastery: {}, diagnostic: null, streak: 0, lastStudyDate: null });

function readProgress() {
  try {
    const saved = JSON.parse(readStoredValue(STORAGE_KEY, "null"));
    const progress = { ...defaultProgress(), ...(saved && typeof saved === "object" ? saved : {}) };
    for (const key of ["scores", "mistakes", "mastery"]) {
      if (!progress[key] || typeof progress[key] !== "object" || Array.isArray(progress[key])) progress[key] = {};
    }
    // t8 has a corrected answer and prompt. Legacy mastery cannot transfer to
    // this new question; all unrelated progress remains intact.
    if (saved && saved.contentRevision !== CONTENT_REVISION) {
      delete progress.scores["tendencias-periodicas"];
      if (progress.mastery["tendencias-periodicas"]) delete progress.mastery["tendencias-periodicas"].t8;
      if (Array.isArray(progress.mistakes["tendencias-periodicas"])) progress.mistakes["tendencias-periodicas"] = progress.mistakes["tendencias-periodicas"].filter(id => id !== "t8");
      progress.contentRevision = CONTENT_REVISION;
    }
    return progress;
  } catch {
    return defaultProgress();
  }
}

export function getBestScore(topicId) {
  return readProgress().scores[topicId] ?? null;
}

export function getStudyStreak() {
  return readProgress().streak ?? 0;
}

export function getMistakes(topicId) {
  const ids = readProgress().mistakes?.[topicId];
  return Array.isArray(ids) ? ids : [];
}

export function getQuestionMastery(topicId, questionId) {
  return readProgress().mastery?.[topicId]?.[questionId] ?? { correct: 0, attempts: 0, streak: 0, nextReview: null };
}

export function getDiagnostic() {
  const result = readProgress().diagnostic;
  return result && Number.isFinite(result.score) && Number.isFinite(result.total) && result.total > 0 && result.topicScores && typeof result.topicScores === "object" ? result : null;
}

export function saveDiagnostic(result) {
  const progress = readProgress();
  progress.diagnostic = { ...result, completedAt: new Date().toISOString() };
  return saveProgress(progress);
}

function saveProgress(progress) {
  const persisted = writeStoredValue(STORAGE_KEY, JSON.stringify(progress));
  globalThis.window?.dispatchEvent(new CustomEvent("study:updated", { detail: { persisted } }));
  return persisted;
}

export function getDueReviewCount() {
  const now = Date.now();
  return Object.values(readProgress().mastery ?? {}).reduce((total, questions) => total + Object.values(questions ?? {}).filter((item) => item?.nextReview && new Date(item.nextReview).getTime() <= now).length, 0);
}

export function getDueQuestions(topicId) {
  const progress = readProgress();
  const now = Date.now();
  const mastery = progress.mastery?.[topicId] ?? {};
  return Object.entries(mastery).filter(([, item]) => item?.nextReview && new Date(item.nextReview).getTime() <= now).map(([questionId]) => questionId);
}

function localStudyDate(date) {
  return new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function saveQuizResult(topicId, score, total, mistakes = [], answers = [], { review = false } = {}) {
  const progress = readProgress();
  const now = new Date();
  const previousDay = new Date(now);
  previousDay.setDate(previousDay.getDate() - 1);
  const today = localStudyDate(now);
  const yesterday = localStudyDate(previousDay);
  const best = progress.scores[topicId];
  if (!review) progress.scores[topicId] = best && best.total === total ? { score: Math.max(best.score, score), total } : { score, total };
  const oldMistakes = Array.isArray(progress.mistakes[topicId]) ? progress.mistakes[topicId] : [];
  const answeredIds = new Set(answers.map(answer => answer.questionId));
  progress.mistakes[topicId] = [...new Set([...(review ? oldMistakes.filter(id => !answeredIds.has(id)) : []), ...mistakes])];
  const questionMastery = { ...(progress.mastery?.[topicId] ?? {}) };
  answers.forEach(({ questionId, correct }) => {
    const previous = questionMastery[questionId] ?? { correct: 0, attempts: 0, streak: 0, nextReview: null };
    const streak = correct ? (Number(previous.streak) || 0) + 1 : 0;
    const intervalDays = correct ? Math.min(30, 2 ** Math.max(0, streak - 1)) : 1;
    questionMastery[questionId] = { correct: (Number(previous.correct) || 0) + (correct ? 1 : 0), attempts: (Number(previous.attempts) || 0) + 1, streak, nextReview: new Date(Date.now() + intervalDays * 86400000).toISOString() };
  });
  progress.mastery = { ...(progress.mastery ?? {}), [topicId]: questionMastery };
  progress.streak = progress.lastStudyDate === today ? progress.streak : progress.lastStudyDate === yesterday ? progress.streak + 1 : 1;
  progress.lastStudyDate = today;
  return saveProgress(progress);
}
