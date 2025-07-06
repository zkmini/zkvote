"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { countries, getUniversalLink } from "@selfxyz/core";
import {
  SelfQRcodeWrapper,
  SelfAppBuilder,
  type SelfApp,
} from "@selfxyz/qrcode";
import { BrowserProvider, Contract, ZeroAddress } from "ethers";
import systemEngineAbi from "../abi/SystemEngine.abi";

const SYSTEM_ENGINE_ADDRESS = "0x4aB32D667CcAFF8E33Ca7107bb55a11aF8a1bE44";

const ACCESS_CODE_PLACEHOLDER =
  "0000000000000000000000000000000000000000000000000000000000000000";

export default function Home() {
  const router = useRouter();
  const [showMain, setShowMain] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isVerifiedUser, setIsVerifiedUser] = useState<boolean | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const [universalLink, setUniversalLink] = useState("");
  const [userId, setUserId] = useState<string>("");

  const [actionCode, setActionCode] = useState<number>(1);
  const [accessCode, setAccessCode] = useState<string>(ACCESS_CODE_PLACEHOLDER);

  const excludedCountries = useMemo(() => [countries.NORTH_KOREA], []);

  const displayToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const connectWallet = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      setUserId(address);

      const contract = new Contract(
        SYSTEM_ENGINE_ADDRESS,
        systemEngineAbi,
        provider
      );

      const verified = await contract.isVerified(address);
      setIsVerifiedUser(verified);
      setShowMain(true);
    } catch (err) {
      console.error("Wallet connection failed", err);
      displayToast("Wallet connection failed");
    }
  };

  useEffect(() => {
    if (isVerifiedUser === false) {
      try {
        const app = new SelfAppBuilder({
          appName: "ZK Vote Proof of Human",
          scope: "zkvote-create-poll",
          endpoint: SYSTEM_ENGINE_ADDRESS,
          endpointType: "staging_celo",
          userId: walletAddress || ZeroAddress,
          userIdType: "hex",
          version: 2,
          userDefinedData: String(actionCode) + accessCode,
          disclosures: {
            nationality: false,
            gender: true,
          },
        }).build();

        setSelfApp(app);
        setUniversalLink(getUniversalLink(app));
      } catch (error) {
        console.error("Failed to initialize Self app:", error);
      }
    }
  }, [walletAddress, isVerifiedUser]);

  const copyToClipboard = () => {
    if (!universalLink) return;

    navigator.clipboard
      .writeText(universalLink)
      .then(() => {
        setLinkCopied(true);
        displayToast("Universal link copied to clipboard!");
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        displayToast("Failed to copy link");
      });
  };

  const openSelfApp = () => {
    if (!universalLink) return;

    window.open(universalLink, "_blank");
    displayToast("Opening Self App...");
  };

  const handleSuccessfulVerification = () => {
    displayToast("Verification successful! Redirecting...");
    setTimeout(() => {
      router.push("/verified");
    }, 1500);
  };

  if (showMain && isVerifiedUser) {
    return (
      <div className="min-h-screen bg-black text-red-600 flex items-center justify-center text-2xl">
        You are verified.
      </div>
    );
  }

  if (!showMain) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white text-2xl px-12 py-6 rounded-full shadow-lg transition"
          onClick={connectWallet}
        >
          Connect MetaMask
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="mb-6 md:mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
          {process.env.NEXT_PUBLIC_SELF_APP_NAME || "Self Workshop"}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          Scan QR code with Self Protocol App to verify your identity
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        <div className="flex justify-center mb-4 sm:mb-6">
          {selfApp ? (
            <SelfQRcodeWrapper
              selfApp={selfApp}
              onSuccess={handleSuccessfulVerification}
              onError={() => {
                displayToast("Error: Failed to verify identity");
              }}
            />
          ) : (
            <div className="w-[256px] h-[256px] bg-gray-200 animate-pulse flex items-center justify-center">
              <p className="text-gray-500 text-sm">Loading QR Code...</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 mb-4 sm:mb-6">
          <button
            type="button"
            onClick={copyToClipboard}
            disabled={!universalLink}
            className="flex-1 bg-gray-800 hover:bg-gray-700 transition-colors text-white p-2 rounded-md text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {linkCopied ? "Copied!" : "Copy Universal Link"}
          </button>

          <button
            type="button"
            onClick={openSelfApp}
            disabled={!universalLink}
            className="flex-1 bg-blue-600 hover:bg-blue-500 transition-colors text-white p-2 rounded-md text-sm sm:text-base mt-2 sm:mt-0 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Open Self App
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 mt-2">
          <span className="text-gray-500 text-xs uppercase tracking-wide">
            User Address
          </span>
          <div className="bg-gray-100 rounded-md px-3 py-2 w-full text-center break-all text-sm font-mono text-gray-800 border border-gray-200">
            {walletAddress || "Not connected"}
          </div>
        </div>

        {showToast && (
          <div className="fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded shadow-lg animate-fade-in text-sm">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
