import "../global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { createBankQueryClient } from "@/providers/query-client";
import { I18nProvider } from "@/i18n/provider";

const queryClient = createBankQueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <Slot />
      </I18nProvider>
    </QueryClientProvider>
  );
}
