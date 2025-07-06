'use client';

import { useEffect, useState } from 'react';
import { ZeroAddress, Contract, JsonRpcProvider, ethers } from 'ethers';
import {
  SelfAppBuilder,
  SelfQRcodeWrapper,
  type SelfApp,
} from '@selfxyz/qrcode';

import { SYSTEM_ENGINE_ADDRESS, CELO_TESTNET_RPC } from '../constants';
import {abi} from '../../abi/SystemEngine';

// Read configId from smart contract
async function getConfigId(
  destinationChainId: string,     // bytes32
  userIdentifier: string,         // bytes32
  userDefinedData: string         // hex-encoded bytes
): Promise<string> {
  const provider = new JsonRpcProvider(CELO_TESTNET_RPC);
  const contract = new Contract(SYSTEM_ENGINE_ADDRESS, abi  , provider);
  return await contract.getConfigId(destinationChainId, userIdentifier, userDefinedData);
}

export default function JoinPollPage() {
  const [accessCode, setAccessCode] = useState('');
  const [submittedCode, setSubmittedCode] = useState(false);
  const [verificationConfigId, setVerificationConfigId] = useState('');
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  const endpoint = SYSTEM_ENGINE_ADDRESS;
  const endpointType = 'staging_celo';

  const destinationChainId = ethers.zeroPadValue('0xaef3', 32); // CELO Testnet chain ID padded
  const userIdentifier = ZeroAddress.padStart(66, '0'); // 32-byte 0x-address

  useEffect(() => {
    if (!submittedCode || !accessCode) return;

    const fetchConfigIdAndBuildApp = async () => {
      try {
        // Build userDefinedData: 0x01 (actionCode 1) + accessCode (bytes32)
        const actionCode = '01';
        const fullUserData = `0x${actionCode}${accessCode.replace(/^0x/, '')}`;

        const configId = await getConfigId(destinationChainId, userIdentifier, fullUserData);
        setVerificationConfigId(configId);

        const selfApp = new SelfAppBuilder({
          appName: 'ZK Vote Poll Join',
          scope: 'zkvote-create-poll',
          endpoint,
          endpointType,
          userId: ZeroAddress,
          userIdType: 'hex',
          version: 2,
          userDefinedData: fullUserData,
        }).build();

        setSelfApp(selfApp);
      } catch (e: any) {
        console.error('Failed to fetch config ID or build app:', e);
        setError('Failed to verify access code or fetch config.');
      }
    };

    fetchConfigIdAndBuildApp();
  }, [submittedCode, accessCode]);

  const handleSubmitCode = () => {
    if (!/^0x[a-fA-F0-9]{64}$/.test(accessCode)) {
      setError('Access code must be 0x-prefixed 32-byte hex string (64 chars).');
      return;
    }

    setError('');
    setSubmittedCode(true);
  };

  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-700 font-semibold text-xl bg-green-50">
        ✅ You are verified and joined the poll!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-800">
        Join Poll
      </h1>

      {!submittedCode ? (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
          <label className="block text-gray-700 font-medium">
            Enter Access Code
          </label>
          <input
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md font-mono"
            placeholder="0x-prefixed 64 char hex code"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleSubmitCode}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Continue
          </button>
        </div>
      ) : selfApp ? (
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center space-y-4">
          <p className="text-lg font-semibold text-center">
            Scan with Self App to verify & join
          </p>
          <SelfQRcodeWrapper
            selfApp={selfApp}
            onSuccess={() => {
              localStorage.setItem(`joined_${accessCode}`, 'true');
              setVerified(true);
            }}
            onError={() => {
              setError('Verification failed. Please try again.');
            }}
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      ) : (
        <p className="text-gray-600">Generating QR code...</p>
      )}
    </div>
  );
}
