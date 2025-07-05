"use client";

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { v4 as uuidv4 } from 'uuid';
import { countryCodes, SelfAppDisclosureConfig, type Country3LetterCode } from '@selfxyz/common';
import { countries, SelfAppBuilder } from '@selfxyz/qrcode';
import Image from 'next/image';
import type { SelfApp } from '@selfxyz/common';

// Import the QR code component with SSR disabled to prevent document references during server rendering
const SelfQRcodeWrapper = dynamic(
  () => import('@selfxyz/qrcode').then((mod) => mod.SelfQRcode),
  { ssr: false }
);

interface CreatePollVerificationModalProps {
  onClose: () => void;
}

const CreatePollVerificationModal: React.FC<CreatePollVerificationModalProps> = ({ onClose }) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [savingOptions, setSavingOptions] = useState(false);
    const [selfApp, setSelfApp] = useState<SelfApp | null>(null);

    useEffect(() => {
        setUserId(uuidv4());
    }, []);
    
    const [disclosures, setDisclosures] = useState<SelfAppDisclosureConfig>({
        // DG1 disclosures
        issuing_state: false,
        name: false,
        nationality: true,
        date_of_birth: false,
        passport_number: false,
        gender: false,
        expiry_date: false,
        // Custom checks
        minimumAge: 18,
        excludedCountries: [
            countries.IRAN,
            countries.IRAQ,
            countries.NORTH_KOREA,
            countries.RUSSIA,
            countries.SYRIAN_ARAB_REPUBLIC,
            countries.VENEZUELA
        ] as Country3LetterCode[],
        ofac: true,
    });

    const [showCountryModal, setShowCountryModal] = useState(false);
    const [selectedCountries, setSelectedCountries] = useState<Country3LetterCode[]>([
        countries.IRAN,
        countries.IRAQ,
        countries.NORTH_KOREA,
        countries.RUSSIA,
        countries.SYRIAN_ARAB_REPUBLIC,
        countries.VENEZUELA
    ]);

    const [countrySelectionError, setCountrySelectionError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAge = parseInt(e.target.value);
        setDisclosures(prev => ({ ...prev, minimumAge: newAge }));
    };

    const handleCountryToggle = (country: Country3LetterCode) => {
        setSelectedCountries(prev => {
            if (prev.includes(country)) {
                setCountrySelectionError(null);
                return prev.filter(c => c !== country);
            }
            
            if (prev.length >= 40) {
                setCountrySelectionError('Maximum 40 countries can be excluded');
                return prev;
            }
            
            return [...prev, country];
        });
    };

    const saveCountrySelection = () => {
        const codes = selectedCountries.map(countryName => {
            const entry = Object.entries(countryCodes).find(([_, name]) => name === countryName);
            return entry ? entry[0] : countryName.substring(0, 3).toUpperCase();
        }) as Country3LetterCode[];

        setDisclosures(prev => ({ ...prev, excludedCountries: codes }));
        setShowCountryModal(false);
    };

    const handleCheckboxChange = (field: string) => {
        setDisclosures(prev => ({
            ...prev,
            [field]: !prev[field as keyof typeof prev]
        }));
    };

    const saveOptionsToServer = useMemo(() => async () => {
        if (!userId || savingOptions) return;
        
        setSavingOptions(true);
        try {
            const response = await fetch('/api/saveOptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    options: {
                        minimumAge: disclosures.minimumAge && disclosures.minimumAge > 0 ? disclosures.minimumAge : undefined,
                        excludedCountries: disclosures.excludedCountries,
                        ofac: disclosures.ofac,
                        issuing_state: disclosures.issuing_state,
                        name: disclosures.name,
                        nationality: disclosures.nationality,
                        date_of_birth: disclosures.date_of_birth,
                        passport_number: disclosures.passport_number,
                        gender: disclosures.gender,
                        expiry_date: disclosures.expiry_date
                    }
                }),
            });

            console.log("saved options to server");

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save options');
            }
        } catch (error) {
            console.error('Error saving options:', error);
            // Only show alert if it's a user-facing error
            if (error instanceof Error && error.message) {
                alert(error.message);
            } else {
                alert('Failed to save verification options. Please try again.');
            }
        } finally {
            setSavingOptions(false);
        }
    }, [userId, savingOptions]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (userId) {
                saveOptionsToServer();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [userId, disclosures]);

    useEffect(() => {
        if (userId) {
            const app = new SelfAppBuilder({
                appName: "Self Playground",
                scope: "self-playground",
                endpoint: "https://b705-83-144-23-157.ngrok-free.app/api/verify",
                // endpoint: "https://c622-118-169-75-84.ngrok-free.app/api/verify",
                endpointType: "https",
                logoBase64: "https://i.imgur.com/Rz8B3s7.png",
                userId,
                disclosures: {
                    ...disclosures,
                    minimumAge: disclosures.minimumAge && disclosures.minimumAge > 0 ? disclosures.minimumAge : undefined,
                },
                version: 2, 
                userDefinedData: "hello from the playground",
                devMode: false,
            } as Partial<SelfApp>).build();
            setSelfApp(app);
            console.log("selfApp built:", app);
        }
    }, [userId, disclosures]);

    if (!userId) return null;

    const filteredCountries = Object.entries(countryCodes).filter(([_, country]) =>
        country.toLowerCase().includes(searchQuery.toLowerCase())
    );


  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 min-w-[350px] max-w-2xl w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
            {selfApp && userId ? (
              <>
                <SelfQRcodeWrapper
                  selfApp={selfApp}
                  onSuccess={() => {}}
                  darkMode={false}
                  onError={() => {}}
                />
                <p className="mt-4 text-sm text-gray-700">
                  User ID: {userId.substring(0, 8)}...
                </p>
              </>
            ) : (
              <>
                <p>Loading QR Code...</p>
                <p className="mt-4 text-sm text-gray-700">Loading user ID...</p>
              </>
            )}
          </div>
          <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-6 border border-gray-300">
            <h2 className="text-2xl font-semibold mb-4">Verification Options</h2>
            <div className="space-y-6">
              <div className="border border-gray-300 rounded-md p-4">
                <h3 className="text-lg font-medium mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={disclosures.issuing_state}
                        onChange={() => handleCheckboxChange("issuing_state")}
                        className="h-4 w-4"
                      />
                      <span>Disclose Issuing State</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={disclosures.name}
                        onChange={() => handleCheckboxChange("name")}
                        className="h-4 w-4"
                      />
                      <span>Disclose Name</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={disclosures.nationality}
                        onChange={() => handleCheckboxChange("nationality")}
                        className="h-4 w-4"
                      />
                      <span>Disclose Nationality</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={disclosures.date_of_birth}
                        onChange={() => handleCheckboxChange("date_of_birth")}
                        className="h-4 w-4"
                      />
                      <span>Disclose Date of Birth</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={disclosures.passport_number}
                        onChange={() => handleCheckboxChange("passport_number")}
                        className="h-4 w-4"
                      />
                      <span>Disclose Passport Number</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={disclosures.gender}
                        onChange={() => handleCheckboxChange("gender")}
                        className="h-4 w-4"
                      />
                      <span>Disclose Gender</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={disclosures.expiry_date}
                        onChange={() => handleCheckboxChange("expiry_date")}
                        className="h-4 w-4"
                      />
                      <span>Disclose Expiry Date</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="border border-gray-300 rounded-md p-4">
                <h3 className="text-lg font-medium mb-3">Verification Rules</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1">Minimum Age: {disclosures.minimumAge || "None"}</label>
                    <input
                      type="range"
                      min="0"
                      max="99"
                      value={disclosures.minimumAge}
                      onChange={handleAgeChange}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      Set to 0 to disable age requirement
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={disclosures.ofac}
                        onChange={() => handleCheckboxChange("ofac")}
                        className="h-4 w-4"
                      />
                      <span>Enable OFAC Check</span>
                    </label>
                  </div>
                  <div>
                    <button
                      onClick={() => setShowCountryModal(true)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Configure Excluded Countries
                    </button>
                    <div className="mt-2 text-sm text-gray-700">
                      {disclosures.excludedCountries && disclosures.excludedCountries.length > 0
                        ? `${disclosures.excludedCountries.length} countries excluded`
                        : "No countries excluded"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showCountryModal && (
          <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-300">
              <h3 className="text-xl font-semibold mb-4">Select Countries to Exclude</h3>
              {countrySelectionError && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                  {countrySelectionError}
                </div>
              )}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-6 max-h-80 overflow-y-auto">
                {filteredCountries.map(([code, country]) => (
                  <label key={code} className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded">
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(code as Country3LetterCode)}
                      onChange={() => handleCountryToggle(code as Country3LetterCode)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{country}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCountryModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCountrySelection}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePollVerificationModal;
