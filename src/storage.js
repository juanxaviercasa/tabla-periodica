const STORAGE_KEY = "quimica-preuni-progress";

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? { scores: {}, streak: 0, lastStudyDate: null };
  } catch {
    return { scores: {}, streak: 0, lastStudyDate: null };
  }
}

export function getBestScore(topicId) {
  return readProgress().scores[topicId] ?? null;
}

export function getStudyStreak() {
  return readProgress().streak ?? 0;
}

export function saveQuizResult(topicId, score, total) {
  const progress = readProgress();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const best = progress.scores[topicId];
  progress.scores[topicId] = best ? { score: Math.max(best.score, score), total } : { score, total };
  progress.streak = progress.lastStudyDate === today ? progress.streak : progress.lastStudyDate === yesterday ? progress.streak + 1 : 1;
  progress.lastStudyDate = today;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent("study:updated"));
}
