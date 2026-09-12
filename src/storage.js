const STORAGE_KEY = "quimica-preuni-progress";

const defaultProgress = () => ({ scores: {}, mistakes: {}, mastery: {}, diagnostic: null, streak: 0, lastStudyDate: null });

function readProgress() {
  try {
    return { ...defaultProgress(), ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}) };
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
  return readProgress().mistakes?.[topicId] ?? [];
}

export function getQuestionMastery(topicId, questionId) {
  return readProgress().mastery?.[topicId]?.[questionId] ?? { correct: 0, attempts: 0, streak: 0, nextReview: null };
}

export function getDiagnostic() {
  return readProgress().diagnostic;
}

export function saveDiagnostic(result) {
  const progress = readProgress();
  progress.diagnostic = { ...result, completedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent("study:updated"));
}

export function getDueReviewCount() {
  const now = Date.now();
  return Object.values(readProgress().mastery ?? {}).reduce((total, questions) => total + Object.values(questions).filter((item) => item.nextReview && new Date(item.nextReview).getTime() <= now).length, 0);
}

export function getDueQuestions(topicId) {
  const progress = readProgress();
  const now = Date.now();
  const mastery = progress.mastery?.[topicId] ?? {};
  const dueIds = Object.entries(mastery).filter(([, item]) => item.nextReview && new Date(item.nextReview).getTime() <= now).map(([questionId]) => questionId);
  return dueIds.length ? dueIds : progress.mistakes?.[topicId] ?? [];
}

export function saveQuizResult(topicId, score, total, mistakes = [], answers = []) {
  const progress = readProgress();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const best = progress.scores[topicId];
  progress.scores[topicId] = best ? { score: Math.max(best.score, score), total } : { score, total };
  progress.mistakes = { ...(progress.mistakes ?? {}), [topicId]: mistakes };
  const questionMastery = { ...(progress.mastery?.[topicId] ?? {}) };
  answers.forEach(({ questionId, correct }) => {
    const previous = questionMastery[questionId] ?? { correct: 0, attempts: 0, streak: 0, nextReview: null };
    const streak = correct ? previous.streak + 1 : 0;
    const intervalDays = correct ? Math.min(30, 2 ** Math.max(0, streak - 1)) : 1;
    questionMastery[questionId] = { correct: previous.correct + (correct ? 1 : 0), attempts: previous.attempts + 1, streak, nextReview: new Date(Date.now() + intervalDays * 86400000).toISOString() };
  });
  progress.mastery = { ...(progress.mastery ?? {}), [topicId]: questionMastery };
  progress.streak = progress.lastStudyDate === today ? progress.streak : progress.lastStudyDate === yesterday ? progress.streak + 1 : 1;
  progress.lastStudyDate = today;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent("study:updated"));
}
