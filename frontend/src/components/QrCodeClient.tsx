"use client";
import { WagmiProvider, useAccount, useConnect } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "./wagmiConfig";

import React, { useState } from "react";

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
import ProofOfHuman from "../components/ProofOfHuman";
import systemEngineAbi from "../abi/SystemEngine.abi.json";
const SYSTEM_ENGINE_ADDRESS = "0xb67a4ce5242a2DFaF0bA6187d62363276b0b62ad";

const TABS = ["Polls", "Votes"] as const;
type Tab = typeof TABS[number];

import PollsAndVotesTabs from "../components/PollsAndVotesTabs";

function AccountTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("Polls");
  return <PollsAndVotesTabs />;
}

import { useContractRead } from 'wagmi';
import { Providers } from "./Providers";

export function HomeInner() {
  const { isConnected, address } = useAccount();
  const { connect, connectors, isPending } = useConnect();

  // Use wagmi's useContractRead to check if the user is verified
  // Only call useContractRead if address and isConnected are set
  const contractReadArgs = address && isConnected ? [address] : undefined;
  const { data: isVerified, isLoading: isVerifiedLoading } = useContractRead(
    contractReadArgs
      ? {
          address: SYSTEM_ENGINE_ADDRESS,
          abi: systemEngineAbi,
          functionName: 'isVerified',
          args: contractReadArgs,
        }
      : {
          address: SYSTEM_ENGINE_ADDRESS,
          abi: systemEngineAbi,
          functionName: 'isVerified',
          // No args, will not run
        }
  );

  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-8 p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Blockchain Voting dApp
        </h1>
        {/* Show connect wallet button if not connected */}
        {!isConnected ? (
          <button
            className="px-12 py-6 text-2xl rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
            onClick={() => connect({ connector: connectors[0] })}
            disabled={isPending}
          >
            {isPending ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : isVerifiedLoading ? (
          // Show loading spinner while checking verification
          <span className="text-lg text-gray-700 dark:text-gray-200">Checking verification...</span>
        ) : !isVerified ? (
          // Show ProofOfHuman verification if not verified
          <ProofOfHuman onVerified={() => {}} />
        ) : (
          // If verified, show the main dApp tabs
          <AccountTabs />
        )}
      </div>
    </div>
    
  );
}


