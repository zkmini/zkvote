import React, { useState } from "react";

interface CreatePollConfigProps {
  allCountries: string[];
  onCreatePoll: (config: { minimumAge: number; excludedCountries: string[] }) => void;
}

const CreatePollConfig: React.FC<CreatePollConfigProps> = ({ allCountries, onCreatePoll }) => {
  const [minimumAge, setMinimumAge] = useState<number>(18);
  const [includedCountries, setIncludedCountries] = useState<string[]>([]);

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinimumAge(parseInt(e.target.value, 10));
  };

  const handleCountryToggle = (country: string) => {
    setIncludedCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const excludedCountries = allCountries.filter((c) => !includedCountries.includes(c));
    onCreatePoll({ minimumAge, excludedCountries });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
      <div style={{ marginBottom: 16 }}>
        <label>
          Minimum Age:{" "}
          <input
            type="number"
            min={0}
            max={120}
            value={minimumAge}
            onChange={handleAgeChange}
            style={{ width: 80 }}
          />
        </label>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Included Countries:</label>
        <div style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #ccc", padding: 8 }}>
          {allCountries.map((country) => (
            <label key={country} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={includedCountries.includes(country)}
                onChange={() => handleCountryToggle(country)}
              />
              {country}
            </label>
          ))}
        </div>
      </div>
      <button type="submit" style={{ padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: 4 }}>
        Create Poll
      </button>
    </form>
  );
};

export default CreatePollConfig;
