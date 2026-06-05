import { View } from "react-native";
import type { ApiPaymentKey } from "@/api/types";
import { PaymentKeyCard } from "@/components/keys/PaymentKeyCard";

type PaymentKeyListProps = {
  keys: ApiPaymentKey[];
  onDelete: (id: string) => void;
  deletingId?: string;
};

export function PaymentKeyList({ keys, onDelete, deletingId }: PaymentKeyListProps) {
  return (
    <View className="gap-3">
      {keys.map((k) => (
        <PaymentKeyCard
          key={k.id}
          paymentKey={k}
          onDelete={onDelete}
          deleting={deletingId === k.id}
        />
      ))}
    </View>
  );
}
