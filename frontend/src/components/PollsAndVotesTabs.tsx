import React, { useState, useEffect } from "react";
import CreatePollVerificationModal from "./CreatePollVerificationModal";

const TABS = ["Polls", "Votes"] as const;
type Tab = typeof TABS[number];
import { ethers } from "ethers";
import systemEngineAbi from "../abi/SystemEngine.abi.json";
import pollAbi from "../abi/Poll.abi.json";

const SYSTEM_ENGINE_ADDRESS = "<YOUR_SYSTEM_ENGINE_ADDRESS_HERE>"; // TODO: Replace with your deployed SystemEngine address

function getStatusLabel(state: number) {
  switch (state) {
    case 0: return "Created";
    case 1: return "Active";
    case 2: return "Ended";
    default: return "Unknown";
  }
}

interface PollsAndVotesTabsProps {
  // Optionally pass children or handlers for future extensibility
}

import VotesVerificationQR from "./VotesVerificationQR";

const PollsAndVotesTabs: React.FC<PollsAndVotesTabsProps> = () => {
  // Voting states
  const [participants, setParticipants] = useState<string[] | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);
  const [votingError, setVotingError] = useState<string | null>(null);

  // ...existing state and logic...

  // Voting handler
  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();
    setVotingError(null);
    if (!selectedParticipant || !verificationConfig?.pollAddress) return;
    try {
      setVoting(true);
      if (!(window as any).ethereum) throw new Error("Wallet not detected");
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const pollContract = new ethers.Contract(verificationConfig.pollAddress, pollAbi, signer);
      // Assuming vote(address) is the method; adjust if needed
      const tx = await pollContract.vote(selectedParticipant);
      await tx.wait();
      setVoting(false);
      setParticipants(null); // Hide voting UI after voting
      setSelectedParticipant(null);
      alert('Vote submitted successfully!');
    } catch (err: any) {
      setVoting(false);
      setVotingError(err.message || 'Failed to submit vote');
    }
  };

  const [activeTab, setActiveTab] = useState<Tab>("Polls");
  const [polls, setPolls] = useState<any[]>([]);
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreatePollModal, setShowCreatePollModal] = useState(false);

  // Votes tab state
  const [accessCode, setAccessCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [verificationConfig, setVerificationConfig] = useState<any>(null);

  // Handler for verifying poll access code
  const handleVerifyAccessCode = async () => {
    setVerifying(true);
    setVerificationError(null);
    setShowQR(false);
    setVerificationConfig(null);
    try {
      if (!(window as any).ethereum) throw new Error("Wallet not detected");
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const systemEngine = new ethers.Contract(SYSTEM_ENGINE_ADDRESS, systemEngineAbi, provider);
      // Assume the contract has a method to get poll address/config by access code
      const pollAddress = await systemEngine.accessCodeToAddress(accessCode);
      if (!pollAddress || pollAddress === ethers.ZeroAddress) throw new Error("Poll not found");
      // Fetch verification config from poll contract
      const pollContract = new ethers.Contract(pollAddress, pollAbi, provider);
      const verificationConfig = await pollContract.verificationConfig();
      setVerificationConfig({ ...verificationConfig, pollAddress });
      setShowQR(true);
    } catch (err: any) {
      setVerificationError(err.message || "Failed to verify poll access code");
    } finally {
      setVerifying(false);
    }
  };


  useEffect(() => {
    async function fetchPolls() {
      if (!(window as any).ethereum) return;
      setLoading(true);
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      setAccount(await signer.getAddress());

      const systemEngine = new ethers.Contract(SYSTEM_ENGINE_ADDRESS, systemEngineAbi, provider);
      const pollCount = Number(await systemEngine.pollCount());
      const pollAddresses = await Promise.all(
        Array.from({ length: pollCount }, (_, i) => systemEngine.idToAddress(i + 1))
      );

      const pollData = await Promise.all(
        pollAddresses.map(async (address) => {
          const contract = new ethers.Contract(address, pollAbi, provider);
          const [title, state, owner] = await Promise.all([
            contract.title(),
            contract.state(),
            contract.OWNER(),
          ]);
          return { address, title, state: Number(state), owner, contract };
        })
      );

      setPolls(pollData);
      setLoading(false);
    }
    fetchPolls();
  }, []);

  const handleClosePoll = async (poll: any) => {
    // if (!(window as any).ethereum) return;
    // const provider = new ethers.BrowserProvider((window as any).ethereum);
    // const signer = await provider.getSigner();
    // const contract = new ethers.Contract(poll.address, pollAbi, signer);
    // await contract.end();
    // Optionally refetch polls here
    // Contract interaction is disabled for now.
  };

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
            <h2 className="text-xl font-bold mb-4">Polls</h2>
            {loading && <p>Loading...</p>}
            {!loading && polls.length === 0 && <p>No polls found.</p>}
            <ul className="w-full">
              {polls.map((poll) => (
                <li key={poll.address} className="mb-4 p-4 border rounded">
                  <div><b>Title:</b> {poll.title}</div>
                  <div><b>Status:</b> {getStatusLabel(poll.state)}</div>
                  <div><b>Address:</b> {poll.address}</div>
                  {account && account.toLowerCase() === poll.owner.toLowerCase() && poll.state !== 2 && (
                    <button
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => handleClosePoll(poll)}
                    >
                      Close Poll
                    </button>
                  )}
                </li>
              ))}
            </ul>

            <button
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all"
              onClick={() => setShowCreatePollModal(true)}
            >
              + Create New Poll
            </button>

            {showCreatePollModal && (
              <CreatePollVerificationModal onClose={() => setShowCreatePollModal(false)} />
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Vote on Poll</h2>
            <label className="block text-sm font-medium mb-2">Enter Poll Access Code:</label>
            <input
              type="text"
              value={accessCode}
              onChange={e => setAccessCode(e.target.value)}
              placeholder="Enter code..."
              className="w-full max-w-xs p-2 border border-gray-300 rounded mb-4"
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all mb-4"
              onClick={handleVerifyAccessCode}
              disabled={verifying}
            >
              {verifying ? 'Verifying...' : 'Verify & Vote'}
            </button>
            {verificationError && (
              <p className="text-red-600 mb-2">{verificationError}</p>
            )}
            {showQR && verificationConfig && (
              <VotesVerificationQR
                verificationConfig={verificationConfig}
                onSuccess={async () => {
                  setShowQR(false);
                  // Fetch participants after successful verification
                  if (verificationConfig.pollAddress) {
                    setParticipants(null);
                    setSelectedParticipant(null);
                    setVotingError(null);
                    setVoting(false);
                    try {
                      if (!(window as any).ethereum) throw new Error("Wallet not detected");
                      const provider = new ethers.BrowserProvider((window as any).ethereum);
                      const pollContract = new ethers.Contract(verificationConfig.pollAddress, pollAbi, provider);
                      const participantAddresses = await pollContract.getRegisteredParticipants();
                      setParticipants(participantAddresses);
                    } catch (err: any) {
                      setVotingError(err.message || "Failed to fetch participants");
                    }
                  }
                }}
              />
            )}
            {participants && (
              <div className="w-full max-w-md mt-6">
                <h3 className="font-semibold mb-2">Select a participant to vote for:</h3>
                <form onSubmit={handleVote}>
                  <div className="flex flex-col gap-2 mb-4">
                    {participants.length === 0 && <span>No participants found.</span>}
                    {participants.map((participant: string) => (
                      <label key={participant} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="participant"
                          value={participant}
                          checked={selectedParticipant === participant}
                          onChange={() => setSelectedParticipant(participant)}
                          disabled={voting}
                        />
                        <span className="break-all">{participant}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all"
                    disabled={!selectedParticipant || voting}
                  >
                    {voting ? 'Voting...' : 'Vote'}
                  </button>
                  {votingError && <p className="text-red-600 mt-2">{votingError}</p>}
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PollsAndVotesTabs;
