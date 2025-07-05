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

    constructor(address identityVerificationHubV2Address, uint256 scope)
        SelfVerificationRoot(identityVerificationHubV2Address, scope)
    {
        pollCount = 0;
    }

    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData // actionType,accessCode,address
    ) internal override {
        (string memory actionType, bytes32 accessCode, address participant) =
            abi.decode(userData, (string, bytes32, address));

        address pollAddress = codeToPollAddress[accessCode];

        Poll pollContract = Poll(pollAddress);

        if (keccak256(bytes(actionType)) == keccak256(bytes("register-user"))) {
            pollContract.addParticipant(participant, output.nationality);
        } else if (keccak256(bytes(actionType)) == keccak256(bytes("create-poll"))) {
            isVerified[participant] = true;
        }
    }

    function getConfigId(
        bytes32 destinationChainId,
        bytes32 userIdentifier,
        bytes memory userDefinedData // actionType,accessCode
    ) public view override returns (bytes32) {
        (string memory actionType, bytes32 accessCode) = abi.decode(userDefinedData, (string, bytes32));
        if (keccak256(bytes(actionType)) == keccak256(bytes("register-user"))) {
            address pollAddr = codeToPollAddress[accessCode];
            return configIds[pollAddr];
        } else if (keccak256(bytes(actionType)) == keccak256(bytes("create-poll"))) {
            return DEFAULT_VERIFICATION_CONFIG_ID;
        }

        revert("Invalid action type");
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
}
