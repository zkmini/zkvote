import React, { useState } from "react";

interface CreatePollFormProps {
  onCancel: () => void;
  onCreate: (poll: PollFormState) => void;
}

export interface PollFormState {
  title: string;
  options: string[];
  owner: string;
  countries: string[];
  verificationConfigId: string;
}

const defaultState: PollFormState = {
  title: "",
  options: ["", ""],
  owner: "", // Could be set to connected wallet address later
  countries: [""],
  verificationConfigId: "",
};

const CreatePollForm: React.FC<CreatePollFormProps> = ({ onCancel, onCreate }) => {
  const [form, setForm] = useState<PollFormState>(defaultState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof PollFormState) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleOptionChange = (idx: number, value: string) => {
    const options = [...form.options];
    options[idx] = value;
    setForm({ ...form, options });
  };

  const handleCountryChange = (idx: number, value: string) => {
    const countries = [...form.countries];
    countries[idx] = value;
    setForm({ ...form, countries });
  };

  const addOption = () => setForm({ ...form, options: [...form.options, ""] });
  const removeOption = (idx: number) => {
    if (form.options.length > 2) {
      const options = form.options.filter((_, i) => i !== idx);
      setForm({ ...form, options });
    }
  };

  const addCountry = () => setForm({ ...form, countries: [...form.countries, ""] });
  const removeCountry = (idx: number) => {
    if (form.countries.length > 1) {
      const countries = form.countries.filter((_, i) => i !== idx);
      setForm({ ...form, countries });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(form);
  };

  return (
    <form className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-2">Create a New Poll</h2>
      <label className="font-semibold">Title</label>
      <input
        className="input input-bordered w-full"
        type="text"
        value={form.title}
        onChange={e => handleChange(e, "title")}
        required
      />

      <label className="font-semibold">Options</label>
      {form.options.map((option, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            className="input input-bordered flex-1"
            type="text"
            value={option}
            onChange={e => handleOptionChange(idx, e.target.value)}
            required
          />
          {form.options.length > 2 && (
            <button type="button" className="btn btn-xs btn-error" onClick={() => removeOption(idx)}>-</button>
          )}
        </div>
      ))}
      <button type="button" className="btn btn-sm btn-outline" onClick={addOption}>+ Add Option</button>

      <label className="font-semibold">Countries (Allowed)</label>
      {form.countries.map((country, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            className="input input-bordered flex-1"
            type="text"
            value={country}
            onChange={e => handleCountryChange(idx, e.target.value)}
            required
          />
          {form.countries.length > 1 && (
            <button type="button" className="btn btn-xs btn-error" onClick={() => removeCountry(idx)}>-</button>
          )}
        </div>
      ))}
      <button type="button" className="btn btn-sm btn-outline" onClick={addCountry}>+ Add Country</button>

      <label className="font-semibold">Verification Config ID</label>
      <input
        className="input input-bordered w-full"
        type="text"
        value={form.verificationConfigId}
        onChange={e => handleChange(e, "verificationConfigId")}
        required
      />

      <div className="flex gap-4 mt-4">
        <button type="submit" className="btn btn-success flex-1">Create Poll</button>
        <button type="button" className="btn btn-outline flex-1" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default CreatePollForm;
