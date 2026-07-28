const LABELS = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
}

export function difficultyLabel(key) {
  return LABELS[key] || ''
}
