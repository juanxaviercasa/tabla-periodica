export function updateAbundance(values, index, percentage) {
  const next = [...values];
  const selected = Math.max(0, Math.min(100, Number(percentage) || 0));
  const others = values.map((_, i) => i).filter(i => i !== index);
  const total = others.reduce((sum, i) => sum + values[i], 0);
  next[index] = selected;
  let remainder = 100 - selected;
  others.forEach((i, position) => {
    next[i] = position === others.length - 1 ? Number(remainder.toFixed(2)) : Number(((100 - selected) * (total > 0 ? values[i] / total : 1 / others.length)).toFixed(2));
    remainder -= next[i];
  });
  return next;
}
