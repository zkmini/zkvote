"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SelfAppBuilder, SelfApp, SelfQRcodeWrapper } from '@selfxyz/qrcode';

import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';
import systemEngineAbi from '../abi/SystemEngine.abi.json';


const SYSTEM_ENGINE_ADDRESS = "0x4aB32D667CcAFF8E33Ca7107bb55a11aF8a1bE44";



type ProofOfHumanProps = {
  onVerified: () => void;
};

// Add accessCode as a prop or get it from context/state as needed
// For demo purposes, we use a placeholder. Replace with actual logic.
const ACCESS_CODE_PLACEHOLDER = "0000000000000000000000000000000000000000000000000000000000000000";

export default function ProofOfHuman({ onVerified }: ProofOfHumanProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationData, setVerificationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Generate a random 16-byte hex string starting with 0x
    const arr = new Uint8Array(16);
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(arr);
      const hex = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
      setUserId('0x' + hex);
    }
  }, []);

  const [actionCode, setActionCode] = useState<number>(1);
  const [accessCode, setAccessCode] = useState<string>(ACCESS_CODE_PLACEHOLDER);

  // Build SelfApp for create-poll verification – wrap in try/catch so we can surface any issues to the UI
  const selfApp = React.useMemo(() => {
    if (!userId) return null;
    try {
      return new SelfAppBuilder({
        appName: "ZK Vote Proof of Human",
        scope: "zkvote-create-poll",
        endpoint: SYSTEM_ENGINE_ADDRESS,
        endpointType: "staging_celo", // or your chain
        userId: "0xF797d70796c45F7244362b39E167F0994bB7dC8F",
        userIdType: "hex",
        version: 2,
        userDefinedData: String(actionCode) + accessCode,
        disclosures: {
          nationality: true,
          gender: true,
        }
        
      }).build();
    } catch (e: any) {
      console.error("Error building SelfApp", e);
      setError(e?.message || "Failed to initialise QR code provider");
      return null;
    }
  }, [userId, actionCode, accessCode]);
  

  // Helper to get MetaMask provider only
  function getMetaMaskProvider() {
    if (typeof window === 'undefined' || !window.ethereum) return null;
    // Multiple providers (EIP-1193)
    if (window.ethereum.providers) {
      return window.ethereum.providers.find((p: { isMetaMask?: boolean }) => p.isMetaMask);
    }
    // Single provider
    if (window.ethereum.isMetaMask) return window.ethereum;
    return null;
  }

  // Helper to encode userData as [actionCode (uint8)][accessCode (bytes32)]
  function encodeUserData(actionCode: number, accessCode: string) {
    // Pack as [uint8][bytes32] for Solidity decoding compatibility
    console.log("Encoding userData with actionCode:", actionCode, "and accessCode:", accessCode);
    console.log("result:", ethers.solidityPacked(["uint8", "bytes32"], [actionCode, accessCode]));
    return ethers.solidityPacked(["uint8", "bytes32"], [actionCode, accessCode]);
  }

  // Handler for QR/proof success
  async function handleVerificationSuccess(proof: any) {
    setError(null);
    setLoading(true);
    try {
      const providerObj = getMetaMaskProvider();
      if (!providerObj) throw new Error("MetaMask not detected. Please install MetaMask and try again.");
      const provider = new ethers.BrowserProvider(providerObj);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(SYSTEM_ENGINE_ADDRESS, systemEngineAbi, signer);
      // actionCode=1 for verification; replace ACCESS_CODE_PLACEHOLDER with actual access code if needed
      const userData = encodeUserData(1, ACCESS_CODE_PLACEHOLDER);
      const tx = await contract.customVerificationHook(proof, userData);
      await tx.wait();
      // Check verification status
      const address = await signer.getAddress();
      const verified = await contract.isVerified(address);
      setIsVerified(verified);
      if (verified) onVerified();
      else setError("Verification not confirmed on-chain. Please try again.");
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    }
    setLoading(false);
  }

  // Handler for QR success
  const handleSuccess = async () => {
    setIsVerified(false);
    setError(null);
    try {
      const providerObj = getMetaMaskProvider();
      if (!providerObj) throw new Error("MetaMask not detected. Please install MetaMask and try again.");
      const provider = new ethers.BrowserProvider(providerObj);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const contract = new ethers.Contract(SYSTEM_ENGINE_ADDRESS, systemEngineAbi, provider);
      const verified = await contract.isVerified(address);
      if (verified) {
        setIsVerified(true);
        onVerified();
      } else {
        setError("Verification not confirmed on-chain. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    }
  };

  // Handler for QR error
  const handleError = (error: any) => {
    setError(error?.message || 'Verification failed');
    setIsVerified(false);
  };

  if (!userId || !selfApp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }


  const resetVerification = () => {
    setIsVerified(false);
    setVerificationData(null);
    setError(null);
    setUserId(uuidv4()); // Generate new user ID for fresh verification
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */} 
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Prove You're Human</h1>
              <p className="text-gray-600 mt-1">Verify your identity with Self protocol</p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://self.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Learn about Self →
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {!isVerified && !error && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Verify Your Humanity
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                Scan the QR code below with the Self mobile app to prove you're a real person
              </p>
              <p className="text-sm text-gray-500">
                This will verify your passport without revealing sensitive information
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-8">
              <div className="p-6 bg-gray-50 rounded-xl">
                
                  {!error ? <SelfQRcodeWrapper
                    selfApp={selfApp}
                    onSuccess={handleSuccess}
                    onError={handleError}
                    /> : <p className="text-gray-500 text-sm">{error}</p>}
                
              </div>
            </div>

            {/* Button to trigger on-chain verification */}
            <div className="mt-8">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                onClick={async () => {
                  setError(null);
                  try {
                    if (!(window as any).ethereum) throw new Error("Wallet not detected");
                    const provider = new ethers.BrowserProvider((window as any).ethereum);
                    const signer = await provider.getSigner();
                    const contract = new ethers.Contract(SYSTEM_ENGINE_ADDRESS, systemEngineAbi, signer);
                    // Prepare userData for 'create-poll' action
                    const actionType = "create-poll";
                    const accessCode = ethers.ZeroAddress; // Or whatever value is appropriate
                    const userAddr = await signer.getAddress();
                    // This assumes you have a method that triggers the customVerificationHook with 'create-poll'.
                    // If such a method doesn't exist, you may need to call createPoll or similar.
                    // Example: await contract.createPoll(...);
                    // For demonstration, we'll just call isVerified after (simulate success)
                    // TODO: Replace with actual call that triggers verification on-chain
                    // await contract.createPoll("dummy", ["A", "B"], userAddr, ["PL"], ethers.ZeroHash);
                    // After transaction, check verification
                    const verified = await contract.isVerified(userAddr);
                    if (verified) {
                      setIsVerified(true);
                      onVerified();
                    } else {
                      setError("Verification not confirmed on-chain. Please try again after creating a poll.");
                    }
                  } catch (err: any) {
                    setError(err.message || 'Verification failed');
                  }
                }}
              >
                Complete On-Chain Verification
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">How to verify:</h3>
              <ol className="text-left text-blue-800 space-y-2">
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                  <a href="https://apps.apple.com/app/self/id6448697253" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Download</a>&nbsp;the Self app on your mobile device                </li>
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                  Scan your passport with the Self app
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                  Scan this QR code to prove your humanity
                </li>
              </ol>
            </div>

            <div className="mt-6 text-xs text-gray-400">
              User ID: {userId.substring(0, 8)}...
            </div>
          </div>
        )}

        {/* Success State */}
        {isVerified && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-green-900 mb-4">
                ✅ Verified Human!
              </h2>
              <p className="text-lg text-green-700 mb-6">
                Your passport has been successfully verified. You are confirmed to be a real person!
              </p>
            </div>

            {/* Verification Details */}
            {verificationData && (
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-green-900 mb-3">Verification Details:</h3>
                <div className="text-left text-green-800 space-y-2">
                  <p><strong>Status:</strong> Verified ✓</p>
                  <p><strong>Verified At:</strong> {new Date().toLocaleString()}</p>
                  <p><strong>User ID:</strong> {userId.substring(0, 8)}...</p>
                  {verificationData.nationality && (
                    <p><strong>Nationality:</strong> {verificationData.nationality}</p>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={resetVerification}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Verify Another Person
            </button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-red-900 mb-4">
                Verification Failed
              </h2>
              <p className="text-lg text-red-700 mb-6">
                Unable to verify your humanity. Please try again.
              </p>
              <div className="bg-red-50 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            </div>

            <button
              onClick={resetVerification}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-500">
          <p>Powered by <a href="https://self.xyz" className="text-blue-600 hover:underline">Self Protocol</a></p>
          <p className="text-sm mt-2">Secure, private, decentralized identity verification</p>
        </div>
      </footer>
    </div>
  );
}
