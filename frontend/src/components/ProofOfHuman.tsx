"use client";
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";

export interface ProofOfHumanProps {
  onVerified: () => void;
}

// Simulate a challenge URL and polling for verification
export const ProofOfHuman: React.FC<ProofOfHumanProps> = ({ onVerified }) => {
  const [challengeUrl, setChallengeUrl] = useState<string>("");
  const [polling, setPolling] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Simulate fetching a challenge URL from Self Protocol
    setChallengeUrl("https://self-protocol.example/verify/human?session=demo123");
  }, []);

  useEffect(() => {
    if (polling && !verified) {
      // Simulate polling for verification (after scan)
      const timeout = setTimeout(() => {
        setVerified(true);
        onVerified();
      }, 3000); // 3 seconds after scan
      return () => clearTimeout(timeout);
    }
  }, [polling, verified, onVerified]);

  if (verified) {
    return (
      <div className="flex flex-col items-center gap-4">
        <span className="text-green-600 font-bold text-lg">Verified!</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-gray-700 dark:text-gray-200">Scan with Self Protocol app to prove you are human</span>
      <div className="bg-white p-4 rounded-lg shadow">
        <QRCode value={challengeUrl} size={160} />
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all"
        onClick={() => setPolling(true)}
        disabled={polling}
      >
        {polling ? "Waiting for verification..." : "I have scanned the QR"}
      </button>
    </div>
  );
};
