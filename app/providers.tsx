"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { createQueryClient } from "@/lib/query-client";
import { I18nProvider } from "@/src/i18n/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          {children}
        </I18nProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
