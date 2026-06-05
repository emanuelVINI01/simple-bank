import { SafeAreaView } from "react-native-safe-area-context";
import { RefreshControl, ScrollView, View } from "react-native";
import { colors } from "@/theme/colors";
import { useRefreshApp } from "@/hooks/use-refresh-app";

type ScreenProps = {
  children: React.ReactNode;
  scroll?: boolean;
  refreshable?: boolean;
  onRefresh?: () => Promise<void> | void;
  className?: string;
  contentContainerClassName?: string;
};

export function Screen({ children, scroll = false, refreshable = true, onRefresh, className, contentContainerClassName }: ScreenProps) {
  const refreshState = useRefreshApp(onRefresh);
  const refreshControl = refreshable ? (
    <RefreshControl refreshing={refreshState.refreshing} onRefresh={refreshState.refresh} tintColor={colors.purple} />
  ) : undefined;

  if (scroll || refreshable) {
    return (
      <SafeAreaView className="flex-1 bg-dracula-bg">
        <ScrollView
          className={`flex-1 bg-dracula-bg ${className ?? ""}`}
          contentContainerClassName={`${scroll ? "pb-6" : "flex-grow"} ${contentContainerClassName ?? ""}`}
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dracula-bg">
      <View className={`flex-1 bg-dracula-bg ${className ?? ""}`}>{children}</View>
    </SafeAreaView>
  );
}
