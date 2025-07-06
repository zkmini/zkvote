'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { countries as allCountries } from '@selfxyz/qrcode';
import { countryCodes, type Country3LetterCode } from '@selfxyz/common';
import { ethers } from 'ethers';
import { getSystemEngine, getSystemEngineContract } from '../../lib/systemEngine';
import { HUB_CONTRACT_ABI } from './hub_contract';
import { abi } from '../../abi/SystemEngine';

// helper to generate a verification config ID
async function generateVerificationConfigId(
  minAge: number,
) {
  const DEFAULT_HUB_ADDRESSES = '0x68c931C9a534D37aa78094877F46fE46a49F1A51';
  const RPC_URLS = 'https://alfajores-forno.celo-testnet.org';
  const config = {
    olderThanEnabled:minAge > 0,
    olderThan: minAge,
    forbiddenCountriesEnabled: false,
    forbiddenCountriesListPacked:  [BigInt(0), BigInt(0), BigInt(0), BigInt(0)],
    ofacEnabled: [true , true , true]
  };

  try {
    const currentNetwork = {
      key: 'alfajores' as const,
      name: 'Celo Testnet (Alfajores)',
      hubAddress: DEFAULT_HUB_ADDRESSES,
      rpcUrl: RPC_URLS
    }
    const readProvider = new ethers.JsonRpcProvider(currentNetwork.rpcUrl);
    const contract = new ethers.Contract(currentNetwork.hubAddress, HUB_CONTRACT_ABI, readProvider);

    const configId = await contract.generateConfigId(config);
    return configId;
  } catch (error) {
    console.error('Error generating config ID from contract:', error);
    return ethers.solidityPackedKeccak256(
      ['bool', 'uint256', 'bool', 'uint256[4]', 'bool[3]'],
      [
        config.olderThanEnabled,
        config.olderThan,
        config.forbiddenCountriesEnabled,
        config.forbiddenCountriesListPacked,
        config.ofacEnabled
      ]
    );
  }
};

export default function CreatePollPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [minAge, setMinAge] = useState<number>(0);
  const [options, setOptions] = useState<string[]>(['Option #1']);
  const [countryList, setCountryList] = useState<Country3LetterCode[]>([]);
  const [verificationConfigId, setVerificationConfigId] = useState<string>('');

  // add option
  const addOption = () => setOptions([...options, `Option #${options.length + 1}`]);

  const updateOption = (idx: number, value: string) => {
    const updated = [...options];
    updated[idx] = value;
    setOptions(updated);
  };

  const removeOption = (idx: number) => {
    const updated = options.filter((_, i) => i !== idx);
    setOptions(updated);
  };

  const toggleCountry = (code: Country3LetterCode) => {
    setCountryList((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const configId = await generateVerificationConfigId(minAge);
    setVerificationConfigId(configId);
    // TODO: send to blockchain here
    console.log('Verification Config ID:', configId);

    // get shared contract (connects wallet if needed)
    const systemEngine = await getSystemEngine();
    const signer = systemEngine.runner! as ethers.Signer;

    try {
      const tx = await systemEngine.createPoll(
        name,
        options,
        await signer.getAddress(),
        countryList,
        configId,
      );
      console.log('createPoll tx hash:', tx.hash);
      await tx.wait();
      alert('Poll created on-chain!');
    } catch (err) {
      console.error('createPoll error:', err);
      alert('Transaction failed – see console for details.');
      return;
    }
    console.log({ name, description, minAge, options, countryList });
    alert('Poll created (console log).');
    router.push('/verified');
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-10 px-4 text-gray-900">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-blue-800">Create Poll</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-md space-y-6 overflow-auto"
      >
        {/* name */}
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        {/* description */}
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        {/* minimum age */}
        <div>
          <label className="block font-semibold mb-1">Minimum Age</label>
          <input
            type="number"
            min={0}
            value={minAge}
            onChange={(e) => setMinAge(parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        {/* options list */}
        <div>
          <label className="block font-semibold mb-2">Options</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  value={opt}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg p-2"
                />
                {options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    className="text-red-600 font-bold px-2"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addOption}
            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Add Option
          </button>
        </div>

        {/* countries allowed */}
        <div>
          <label className="block font-semibold mb-2">Allowed Countries</label>
          <div className="h-40 overflow-y-scroll border border-gray-300 rounded-lg p-2 grid grid-cols-2 gap-2 text-sm">
            {Object.entries(allCountries).map(([code, label]) => (
              <label key={code} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={countryList.includes(code as Country3LetterCode)}
                  onChange={() => toggleCountry(code as Country3LetterCode)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* show verificationConfigId if computed */}
        {verificationConfigId && (
          <div className="p-4 bg-gray-100 rounded-lg text-xs break-all">
            Verification Config ID: {verificationConfigId}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
        >
          Submit Poll
        </button>
      </form>
    </div>
  );
}
