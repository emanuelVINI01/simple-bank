import { ShieldCheck, Sparkles, WalletCards } from "lucide-react-native";
import { Text, View } from "react-native";
import { colors } from "@/theme/colors";

type AuthShellProps = {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
};

const highlights = [
  { label: "Conta digital", icon: WalletCards, color: colors.purple },
  { label: "Transferencias", icon: Sparkles, color: colors.cyan },
  { label: "Ambiente seguro", icon: ShieldCheck, color: colors.green },
];

export function AuthShell({ children, eyebrow, title, subtitle }: AuthShellProps) {
  return (
    <View className="gap-6">
      <View className="gap-5">
        <View className="gap-2">
          <Text className="text-[12px] font-extrabold uppercase tracking-[3px] text-dracula-cyan">{eyebrow}</Text>
          <Text className="text-[36px] font-extrabold leading-[40px] text-dracula-fg">{title}</Text>
          <Text className="max-w-[320px] text-[15px] leading-6 text-dracula-muted">{subtitle}</Text>
        </View>

        <View className="overflow-hidden rounded-[28px] border border-dracula-purple/30 bg-dracula-surface p-5">
          <View className="absolute right-[-48px] top-[-42px] h-32 w-32 rounded-full bg-dracula-purple/20" />
          <View className="absolute bottom-[-56px] left-[-46px] h-36 w-36 rounded-full bg-dracula-cyan/10" />
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs text-dracula-muted">Simple Bank</Text>
              <Text className="mt-1 text-lg font-extrabold text-dracula-fg">Conta essencial</Text>
            </View>
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-dracula-purple">
              <WalletCards size={19} color={colors.fg} />
            </View>
          </View>
          <View className="mt-7">
            <Text className="text-xs text-dracula-muted">Saldo inicial</Text>
            <Text className="mt-1 text-[28px] font-extrabold text-dracula-green">R$ 10,00</Text>
          </View>
          <View className="mt-5 flex-row gap-2">
            {highlights.map(({ label, icon: Icon, color }) => (
              <View key={label} className="flex-1 rounded-2xl bg-dracula-surface-deep p-3">
                <Icon size={16} color={color} />
                <Text className="mt-2 text-[11px] font-semibold leading-4 text-dracula-fg">{label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className="gap-4 rounded-[24px] border border-white/10 bg-dracula-surface p-4">
        {children}
      </View>
    </View>
  );
}
