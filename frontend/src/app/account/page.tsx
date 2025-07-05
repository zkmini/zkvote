"use client";
import React, { useState } from "react";

const TABS = ["Polls", "Votes"] as const;

type Tab = typeof TABS[number];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Polls");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-8 p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800 min-w-[340px]">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Account
        </h1>
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
              {/* TODO: List polls created by this account */}
              <p className="mb-4 text-gray-700 dark:text-gray-200">No polls created yet.</p>
              <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all">
                + Create New Poll
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              {/* TODO: List votes cast by this account */}
              <p className="mb-4 text-gray-700 dark:text-gray-200">No votes cast yet.</p>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all">
                Vote on New Poll
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
