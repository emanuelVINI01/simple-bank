import { colors } from "@/theme/colors";

export const spacing = {
  pageX: 20,
  radius: 12,
  radiusSmall: 8,
  tabBarHeight: 72,
} as const;

export const shadows = {
  panel: {
    elevation: 10,
    shadowColor: "#000000",
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
  },
} as const;

export const semanticColors = {
  danger: colors.red,
  link: colors.cyan,
  moneyIn: colors.green,
  moneyOut: colors.pink,
  primary: colors.purple,
  warning: colors.yellow,
} as const;

