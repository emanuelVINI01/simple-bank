export const colors = {
  bg: "#282a36",
  card: "#44475a",
  cyan: "#8be9fd",
  fg: "#f8f8f2",
  green: "#50fa7b",
  muted: "#a7b0c8",
  orange: "#ffb86c",
  pink: "#ff79c6",
  purple: "#bd93f9",
  red: "#ff5555",
  surface: "#343746",
  surfaceDeep: "#21222c",
  yellow: "#f1fa8c",
} as const;

export type ThemeColor = keyof typeof colors;

