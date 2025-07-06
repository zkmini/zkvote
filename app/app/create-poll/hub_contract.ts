export const HUB_CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "AddressEmptyCode",
    type: "error",
  },
  {
    inputs: [],
    name: "ConfigNotSet",
    type: "error",
  },
  {
    inputs: [],
    name: "CrossChainIsNotSupportedYet",
    type: "error",
  },
  {
    inputs: [],
    name: "CurrentDateNotInValidRange",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "ERC1967InvalidImplementation",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC1967NonPayable",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedCall",
    type: "error",
  },
  {
    inputs: [],
    name: "InputTooShort",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAttestationId",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidCscaRoot",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidDateDigit",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidDateLength",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidDayRange",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidDscCommitmentRoot",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidDscProof",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidFieldElement",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidIdentityCommitmentRoot",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidMonthRange",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidRegisterProof",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidUserIdentifierInProof",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidVcAndDiscloseProof",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidYearRange",
    type: "error",
  },
  {
    inputs: [],
    name: "LengthMismatch",
    type: "error",
  },
  {
    inputs: [],
    name: "NoVerifierSet",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "ScopeMismatch",
    type: "error",
  },
  {
    inputs: [],
    name: "UUPSUnauthorizedCallContext",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "slot",
        type: "bytes32",
      },
    ],
    name: "UUPSUnsupportedProxiableUUID",
    type: "error",
  },
  {
    inputs: [],
    name: "UserContextDataTooShort",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "typeId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "verifier",
        type: "address",
      },
    ],
    name: "DscCircuitVerifierUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "HubInitializedV2",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "typeId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "verifier",
        type: "address",
      },
    ],
    name: "RegisterCircuitVerifierUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "attestationId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "registry",
        type: "address",
      },
    ],
    name: "RegistryUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "attestationId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "vcAndDiscloseCircuitVerifier",
        type: "address",
      },
    ],
    name: "VcAndDiscloseCircuitUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "configId",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "olderThanEnabled",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "olderThan",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "forbiddenCountriesEnabled",
            type: "bool",
          },
          {
            internalType: "uint256[4]",
            name: "forbiddenCountriesListPacked",
            type: "uint256[4]",
          },
          {
            internalType: "bool[3]",
            name: "ofacEnabled",
            type: "bool[3]",
          },
        ],
        indexed: false,
        internalType: "struct SelfStructs.VerificationConfigV2",
        name: "config",
        type: "tuple",
      },
    ],
    name: "VerificationConfigV2Set",
    type: "event",
  },
  {
    inputs: [],
    name: "UPGRADE_INTERFACE_VERSION",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "attestationIds",
        type: "bytes32[]",
      },
      {
        internalType: "uint256[]",
        name: "typeIds",
        type: "uint256[]",
      },
      {
        internalType: "address[]",
        name: "verifierAddresses",
        type: "address[]",
      },
    ],
    name: "batchUpdateDscCircuitVerifiers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "attestationIds",
        type: "bytes32[]",
      },
      {
        internalType: "uint256[]",
        name: "typeIds",
        type: "uint256[]",
      },
      {
        internalType: "address[]",
        name: "verifierAddresses",
        type: "address[]",
      },
    ],
    name: "batchUpdateRegisterCircuitVerifiers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "attestationId",
        type: "bytes32",
      },
    ],
    name: "discloseVerifier",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "attestationId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "typeId",
        type: "uint256",
      },
    ],
    name: "dscCircuitVerifiers",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "olderThanEnabled",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "olderThan",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "forbiddenCountriesEnabled",
            type: "bool",
          },
          {
            internalType: "uint256[4]",
            name: "forbiddenCountriesListPacked",
            type: "uint256[4]",
          },
          {
            internalType: "bool[3]",
            name: "ofacEnabled",
            type: "bool[3]",
          },
        ],
        internalType: "struct SelfStructs.VerificationConfigV2",
        name: "config",
        type: "tuple",
      },
    ],
    name: "generateConfigId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "attestationId",
        type: "bytes32",
      },
    ],
    name: "getIdentityCommitmentMerkleRoot",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "configId",
        type: "bytes32",
      },
    ],
    name: "getVerificationConfigV2",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "olderThanEnabled",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "olderThan",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "forbiddenCountriesEnabled",
            type: "bool",
          },
          {
            internalType: "uint256[4]",
            name: "forbiddenCountriesListPacked",
            type: "uint256[4]",
          },
          {
            internalType: "bool[3]",
            name: "ofacEnabled",
            type: "bool[3]",
          },
        ],
        internalType: "struct SelfStructs.VerificationConfigV2",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "attestationId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "typeId",
        type: "uint256",
      },
    ],
    name: "registerCircuitVerifiers",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "attestationId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "registerCircuitVerifierId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256[2]",
            name: "a",
            type: "uint256[2]",
          },
          {
            internalType: "uint256[2][2]",
            name: "b",
            type: "uint256[2][2]",
          },
          {
            internalType: "uint256[2]",
            name: "c",
            type: "uint256[2]",
          },
          {
            internalType: "uint256[3]",
            name: "pubSignals",
            type: "uint256[3]",
          },
        ],
        internalType: "struct IRegisterCircuitVerifier.RegisterCircuitProof",
        name: "registerCircuitProof",
        type: "tuple",
      },
    ],
    name: "registerCommitment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "attestationId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "dscCircuitVerifierId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256[2]",
            name: "a",
            type: "uint256[2]",
          },
          {
            internalType: "uint256[2][2]",
            name: "b",
            type: "uint256[2][2]",
          },
          {
            internalType: "uint256[2]",
            name: "c",
            type: "uint256[2]",
          },
          {
            internalType: "uint256[2]",
            name: "pubSignals",
            type: "uint256[2]",
          },
        ],
        internalType: "struct IDscCircuitVerifier.DscCircuitProof",
        name: "dscCircuitProof",
        type: "tuple",
      },
    ],
    name: "registerDscKeyCommitment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "attestationId",
        type: "bytes32",
      },
    ],
    name: "registry",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "attestationId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "root",
        type: "uint256",
      },
    ],
    name: "rootTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "olderThanEnabled",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "olderThan",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "forbiddenCountriesEnabled",
            type: "bool",
          },
          {
            internalType: "uint256[4]",
            name: "forbiddenCountriesListPacked",
            type: "uint256[4]",
          },
          {
            internalType: "bool[3]",
            name: "ofacEnabled",
            type: "bool[3]",
          },
        ],
        internalType: "struct SelfStructs.VerificationConfigV2",
        name: "config",
        type: "tuple",
      },
    ],
    name: "setVerificationConfigV2",
    outputs: [
      {
        internalType: "bytes32",
        name: "configId",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "attestationId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "typeId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "verifierAddress",
        type: "address",
      },
    ],
    name: "updateDscVerifier",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "attestationId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "typeId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "verifierAddress",
        type: "address",
      },
    ],
    name: "updateRegisterCircuitVerifier",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "attestationId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "registryAddress",
        type: "address",
      },
    ],
    name: "updateRegistry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "attestationId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "vcAndDiscloseCircuitVerifierAddress",
        type: "address",
      },
    ],
    name: "updateVcAndDiscloseCircuit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "configId",
        type: "bytes32",
      },
    ],
    name: "verificationConfigV2Exists",
    outputs: [
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "baseVerificationInput",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "userContextData",
        type: "bytes",
      },
    ],
    name: "verify",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
