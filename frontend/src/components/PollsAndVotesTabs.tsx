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

const PollsAndVotesTabs: React.FC<PollsAndVotesTabsProps> = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Polls");
  const [polls, setPolls] = useState<any[]>([]);
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreatePollModal, setShowCreatePollModal] = useState(false);

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
            <p className="mb-4 text-gray-700 dark:text-gray-200">No votes cast yet.</p>
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all">
              Vote on New Poll
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollsAndVotesTabs;
