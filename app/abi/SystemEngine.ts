export const abi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "identityVerificationHubV2Address",
        type: "address",
        internalType: "address",
      },
      { name: "scope", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "castVote",
    inputs: [
      { name: "_id", type: "uint256", internalType: "uint256" },
      { name: "_option", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createPoll",
    inputs: [
      { name: "_title", type: "string", internalType: "string" },
      { name: "_options", type: "string[]", internalType: "string[]" },
      { name: "_owner", type: "address", internalType: "address" },
      {
        name: "_countries",
        type: "string[]",
        internalType: "string[]",
      },
      {
        name: "verificationConfigId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "endPoll",
    inputs: [{ name: "_id", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getConfigId",
    inputs: [
      {
        name: "destinationChainId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "userIdentifier",
        type: "bytes32",
        internalType: "bytes32",
      },
      { name: "userDefinedData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "onVerificationSuccess",
    inputs: [
      { name: "output", type: "bytes", internalType: "bytes" },
      { name: "userData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "scope",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setScope",
    inputs: [{ name: "_scope", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "verifySelfProof",
    inputs: [
      { name: "proofPayload", type: "bytes", internalType: "bytes" },
      { name: "userContextData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "PollCreated",
    inputs: [
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ScopeUpdated",
    inputs: [
      {
        name: "newScope",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SystemEngineCreated",
    inputs: [
      {
        name: "thisContract",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "VerificationCompleted",
    inputs: [
      {
        name: "output",
        type: "tuple",
        indexed: false,
        internalType: "struct ISelfVerificationRoot.GenericDiscloseOutputV2",
        components: [
          {
            name: "attestationId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "userIdentifier",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "nullifier",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "forbiddenCountriesListPacked",
            type: "uint256[4]",
            internalType: "uint256[4]",
          },
          {
            name: "issuingState",
            type: "string",
            internalType: "string",
          },
          { name: "name", type: "string[]", internalType: "string[]" },
          { name: "idNumber", type: "string", internalType: "string" },
          {
            name: "nationality",
            type: "string",
            internalType: "string",
          },
          {
            name: "dateOfBirth",
            type: "string",
            internalType: "string",
          },
          { name: "gender", type: "string", internalType: "string" },
          {
            name: "expiryDate",
            type: "string",
            internalType: "string",
          },
          {
            name: "olderThan",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "ofac", type: "bool[3]", internalType: "bool[3]" },
        ],
      },
      {
        name: "userData",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "InvalidDataFormat", inputs: [] },
  { type: "error", name: "SystemEngine__NotValidHuman", inputs: [] },
  { type: "error", name: "UnauthorizedCaller", inputs: [] },
];
