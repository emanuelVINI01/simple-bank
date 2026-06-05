import type { ComponentProps } from "react";
import { Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

const ReanimatedPressable = Animated.createAnimatedComponent(Pressable);

type AnimatedPressableProps = ComponentProps<typeof Pressable> & {
  feedback?: "scale" | "lift" | "soft";
};

export function AnimatedPressable({ children, feedback = "scale", onPressIn, onPressOut, ...props }: AnimatedPressableProps) {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    if (feedback === "lift") {
      return {
        opacity: withTiming(progress.value ? 0.9 : 1, { duration: 120 }),
        transform: [
          { translateY: withSpring(progress.value ? -2 : 0, { damping: 14, stiffness: 260 }) },
          { scale: withSpring(progress.value ? 0.98 : 1, { damping: 14, stiffness: 260 }) },
        ],
      };
    }

    if (feedback === "soft") {
      return {
        opacity: withTiming(progress.value ? 0.72 : 1, { duration: 120 }),
        transform: [{ scale: withSpring(progress.value ? 0.96 : 1, { damping: 16, stiffness: 280 }) }],
      };
    }

    return {
      opacity: withTiming(progress.value ? 0.86 : 1, { duration: 120 }),
      transform: [{ scale: withSpring(progress.value ? 0.97 : 1, { damping: 15, stiffness: 300 }) }],
    };
  });

  return (
    <ReanimatedPressable
      {...props}
      onPressIn={(event) => {
        progress.value = 1;
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        progress.value = 0;
        onPressOut?.(event);
      }}
      style={animatedStyle}
    >
      {children}
    </ReanimatedPressable>
  );
}
