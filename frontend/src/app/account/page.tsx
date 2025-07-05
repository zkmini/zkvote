"use client";
import React, { useState } from "react";

const TABS = ["Polls", "Votes"] as const;

type Tab = typeof TABS[number];

import PollsAndVotesTabs from "../../components/PollsAndVotesTabs";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Polls");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-8 p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800 min-w-[340px]">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Account
        </h1>
        <PollsAndVotesTabs />
      </div>
    </div>
  );
}
