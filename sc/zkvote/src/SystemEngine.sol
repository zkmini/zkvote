// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {SelfVerificationRoot} from "@selfxyz/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/interfaces/ISelfVerificationRoot.sol";
import {SelfStructs} from "@selfxyz/contracts/libraries/SelfStructs.sol";
import {Poll} from "./Poll.sol";

contract SystemEngine is SelfVerificationRoot {
    error SystemEngine__NotValidHuman();

    uint256 private pollCount;

    mapping(bytes32 accessCode => address Poll) codeToPollAddress;
    mapping(address Poll => bytes32 verificationConfigId) configIds;
    mapping(address participant => bool isVerified) isVerified;
    mapping(uint256 pollId => address pollAddress) idToAddress;

    bytes32 private constant DEFAULT_VERIFICATION_CONFIG_ID =
        0x7b6436b0c98f62380866d9432c2af0ee08ce16a171bda6951aecd95ee1307d61;

    event VerificationCompleted(ISelfVerificationRoot.GenericDiscloseOutputV2 output, bytes userData);
    event PollCreated(uint256 indexed id);
    event SystemEngineCreated(address indexed thisContract);

    constructor(address identityVerificationHubV2Address, uint256 scope)
        SelfVerificationRoot(identityVerificationHubV2Address, scope)
    {
        pollCount = 0;
        emit SystemEngineCreated(address(this));
    }

    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData // actionType,accessCode
    ) internal override {
        (uint8 actionCode, bytes32 accessCode) = parseUserData(userData);

        address participant = address(uint160(output.userIdentifier));

        address pollAddress = codeToPollAddress[accessCode];

        Poll pollContract = Poll(pollAddress);

        if (actionCode == 0) {
            pollContract.addParticipant(participant, output.nationality);
        } else if (actionCode == 1) {
            isVerified[participant] = true;
        }
    }

    function getConfigId(
        bytes32 destinationChainId,
        bytes32 userIdentifier,
        bytes memory userDefinedData // actionType,accessCode
    ) public view override returns (bytes32) {
        (uint8 actionCode, bytes32 accessCode) = parseUserData(userDefinedData);

        if (actionCode == 1) {
            address pollAddr = codeToPollAddress[accessCode];
            return configIds[pollAddr];
        } else if (actionCode == 0) {
            return DEFAULT_VERIFICATION_CONFIG_ID;
        }

        revert("Invalid action code");
    }

    function createPoll(
        string memory _title,
        string[] memory _options,
        address _owner,
        string[] memory _countries,
        bytes32 verificationConfigId
    ) external {
        if (!isVerified[msg.sender]) {
            revert SystemEngine__NotValidHuman();
        }

        Poll poll = new Poll(_title, _options, _owner, _countries);

        bytes32 code = keccak256(abi.encodePacked(_title, msg.sender, block.timestamp));
        uint256 id = ++pollCount + block.timestamp;

        codeToPollAddress[code] = address(poll);
        idToAddress[id] = address(poll);
        configIds[address(poll)] = verificationConfigId;

        poll.start();
        emit PollCreated(id);
    }

    function castVote(uint256 _id, uint256 _option) external {
        address pollAddress = idToAddress[_id];
        Poll(pollAddress).castVote(msg.sender, _option);
    }

    function endPoll(uint256 _id) external {
        address pollAddress = idToAddress[_id];
        Poll(pollAddress).end();
    }

    function setScope(uint256 _scope) external {
        _setScope(_scope);
    }

    /// @dev Parse userData to extract actionCode and accessCode
    function parseUserData(bytes memory userData) internal pure returns (uint8 actionCode, bytes32 accessCode) {
        require(userData.length >= 33, "Invalid userData length");

        // Check if first byte is ASCII '0' or '1' (hex encoded)
        uint8 firstByte = uint8(userData[0]);
        if (firstByte == 0x30) {
            // ASCII '0'
            actionCode = 0;
        } else if (firstByte == 0x31) {
            // ASCII '1'
            actionCode = 1;
        } else if (firstByte == 0 || firstByte == 1) {
            // Raw bytes
            actionCode = firstByte;
        } else {
            revert("Invalid action code");
        }

        // Extract accessCode from remaining bytes
        assembly {
            accessCode := mload(add(userData, 33))
        }

        accessCode = bytes32(parseUint(abi.encodePacked(accessCode)));
    }

    function parseUint(bytes memory b) internal pure returns (uint256 result) {
        for (uint256 i = 1; i < b.length; i++) {
            require(b[i] >= 0x30 && b[i] <= 0x39, "Invalid character");
            result = result * 10 + (uint8(b[i]) - 48);
        }
    }
}
