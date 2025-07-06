"use client";
import { WagmiProvider, useAccount, useConnect } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "./wagmiConfig";

import React, { useState } from "react";

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export function Providers({children}: {children: React.ReactNode}) {
 
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
   {children}
    </WagmiProvider>
    </QueryClientProvider>
  );
}


