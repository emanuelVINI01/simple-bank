import { ScrollView, Text, TextInput, View } from "react-native";
import { Search } from "lucide-react-native";
import { colors } from "@/theme/colors";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";

type FilterType = "all" | "credit" | "debit";

type TransactionFiltersProps = {
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  query: string;
  onQueryChange: (q: string) => void;
};

const filters: { label: string; value: FilterType }[] = [
  { label: "Todas", value: "all" },
  { label: "Entradas", value: "credit" },
  { label: "Saidas", value: "debit" },
];

export function TransactionFilters({ filter, onFilterChange, query, onQueryChange }: TransactionFiltersProps) {
  return (
    <View className="mb-3 gap-3 px-5">
      <View
        className="flex-row items-center gap-2 rounded-[10px] border border-dracula-card bg-dracula-surface-deep px-3"
      >
        <Search size={16} color={colors.muted} />
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder="Buscar..."
          placeholderTextColor={colors.muted}
          className="flex-1 py-3 text-sm text-dracula-fg"
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
        {filters.map((f) => {
          const active = filter === f.value;
          return (
            <AnimatedPressable
              key={f.value}
              onPress={() => onFilterChange(f.value)}
              feedback="soft"
              className={`rounded-full px-4 py-[7px] ${active ? "bg-dracula-purple" : "bg-dracula-card"}`}
            >
              <Text className={`text-[13px] ${active ? "font-bold text-dracula-fg" : "font-normal text-dracula-muted"}`}>
                {f.label}
              </Text>
            </AnimatedPressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
