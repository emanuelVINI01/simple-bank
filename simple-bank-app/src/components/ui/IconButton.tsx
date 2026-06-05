import { AnimatedPressable } from "@/components/ui/AnimatedPressable";

type IconButtonProps = {
  icon: React.ReactNode;
  onPress: () => void;
  className?: string;
  disabled?: boolean;
};

export function IconButton({ icon, onPress, className, disabled }: IconButtonProps) {
  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      feedback="soft"
      className={`items-center justify-center rounded-lg p-2 ${disabled ? "opacity-40" : ""} ${className ?? ""}`}
    >
      {icon}
    </AnimatedPressable>
  );
}
