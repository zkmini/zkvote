"use client";
import React, { useState } from "react";
import { WagmiProvider, useAccount, useConnect } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "./wagmiConfig";
import { queryClient } from "./queryClient";
import { ProofOfHuman } from "../components/ProofOfHuman";

const TABS = ["Polls", "Votes"] as const;
type Tab = typeof TABS[number];

function AccountTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("Polls");
  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="flex gap-4 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`px-6 py-2 rounded-t-lg font-semibold text-lg transition-all border-b-4 ${
              activeTab === tab
                ? "border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-900"
                : "border-transparent text-gray-600 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="w-full min-h-[220px] bg-gray-100 dark:bg-gray-700 rounded-lg p-6 flex flex-col items-center justify-center">
        {activeTab === "Polls" ? (
          <div className="w-full flex flex-col items-center">
            <p className="mb-4 text-gray-700 dark:text-gray-200">No polls created yet.</p>
            <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all">
              + Create New Poll
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            <p className="mb-4 text-gray-700 dark:text-gray-200">No votes cast yet.</p>
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all">
              Vote on New Poll
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function HomeInner() {
  const { isConnected, address } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  // Simulate smart contract check (replace with real contract call later)
  async function checkIsVerified(addr: string): Promise<boolean> {
    // TODO: Replace with actual contract call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return false; // always false for now
  }

  React.useEffect(() => {
    if (isConnected && address) {
      setIsVerified(null); // loading
      checkIsVerified(address).then(setIsVerified);
    } else {
      setIsVerified(null);
    }
  }, [isConnected, address]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-8 p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Blockchain Voting dApp
        </h1>
        {!isConnected ? (
          <button
            className="px-12 py-6 text-2xl rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
            onClick={() => connect({ connector: connectors[0] })}
            disabled={isPending}
          >
            {isPending ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : isVerified === null ? (
          <span className="text-lg text-gray-700 dark:text-gray-200">Checking verification...</span>
        ) : !isVerified ? (
          <ProofOfHuman onVerified={() => setIsVerified(true)} />
        ) : (
          <AccountTabs />
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <HomeInner />
      </WagmiProvider>
    </QueryClientProvider>
  );
}