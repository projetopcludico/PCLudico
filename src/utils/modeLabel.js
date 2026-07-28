const LABELS = {
  forms: 'Formas',
  sounds: 'Sons',
  numbers: 'Números',
}

export function modeLabel(key) {
  return LABELS[key] || ''
}
