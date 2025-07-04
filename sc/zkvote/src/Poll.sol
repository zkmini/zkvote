// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title Poll
 * @notice A simple on‑chain poll contract that supports
 *         participant registration, voting, and result retrieval.
 */
contract Poll {
    // Types
    enum State {
        CREATED,
        ACTIVE,
        ENDED
    }

    // Errors
    error Poll__NotExpectedState();
    error Poll__OptionCountMustBeGreaterThanTwo();
    error Poll__MustLastLongerThanZero();
    error Poll__NotVerified();
    error Poll__NotAnOwner();
    error Poll__UserAlreadyRegistered();
    error Poll__UserAlreadyVerified();
    error Poll__NotAGovernor();
    error Poll__UserAlreadyVoted();
    error Poll__InvalidOption();

    // State Variables
    address private immutable i_governor;

    string private s_title;
    State private s_state;

    string[] private s_options;
    mapping(uint256 option => uint256 voteCounter) public s_votes;

    address[] private s_participantList;
    mapping(address paticipant => bool isRegistered) public s_isRegistered;
    mapping(address participant => bool isVerified) public s_isVerified;
    mapping(address paticipant => bool hasVoted) public s_hasVoted;

    uint256 private s_startTime;
    uint256 private s_endTime;
    uint256 private s_duration;

    address private immutable i_owner;

    // Events
    event PollStarted(uint256 indexed startTime, uint256 indexed endTime);
    event PollEnded(uint256 indexed endTime);
    event ParticipantAdded(address indexed participant);
    event ParticipantVerified(address indexed participant);
    event VoteCasted(address indexed voter, uint256 indexed option);

    // Modifiers
    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert Poll__NotAnOwner();
        }
        _;
    }

    modifier onlyGovernor() {
        if (msg.sender != i_governor) {
            revert Poll__NotAGovernor();
        }
        _;
    }

    modifier inState(State expected) {
        if (s_state != expected) {
            revert Poll__NotExpectedState();
        }
        _;
    }

    // Constructor
    /**
     * @param _title    The poll title
     * @param _options  The array of option labels
     * @param _duration Duration in seconds for which the poll runs once started
     */
    constructor(string memory _title, string[] memory _options, uint256 _duration, address _owner) {
        if (_options.length < 2) {
            revert Poll__OptionCountMustBeGreaterThanTwo();
        }

        if (_duration == 0) {
            revert Poll__MustLastLongerThanZero();
        }

        s_title = _title;
        s_options = _options;
        i_governor = msg.sender;
        i_owner = _owner;
        s_state = State.CREATED;
        s_duration = _duration;
        s_endTime = 0;
        s_startTime = 0;
    }

    // Management
    /**
     * @notice Activate the poll. Sets startTime and endTime, moves state to Active.
     */
    function start() external onlyOwner inState(State.CREATED) {
        s_startTime = block.timestamp;
        s_endTime = block.timestamp + s_duration;

        s_state = State.ACTIVE;
        emit PollStarted(s_startTime, s_endTime);
    }

    /**
     * @notice Add a participant
     * @param _participant Address to register
     */
    function addParticipant(address _participant) external onlyGovernor {
        if (s_isRegistered[_participant]) {
            revert Poll__UserAlreadyRegistered();
        }

        s_isRegistered[_participant] = true;
        s_participantList.push(_participant);
        emit ParticipantAdded(_participant);
    }

    /**
     * @notice Sets @param _participant as verified
     */
    function verifyParticipant(address _participant) external onlyGovernor {
        if (s_isVerified[_participant]) {
            revert Poll__UserAlreadyVerified();
        }

        s_isVerified[_participant] = true;
        emit ParticipantVerified(_participant);
    }

    // Voting
    /**
     * @notice Cast your vote once poll is Active.
     * @param _option Index of the chosen option
     */
    function castVote(address _voter, uint256 _option) external inState(State.ACTIVE) {
        if (s_isRegistered[_voter]) {
            revert Poll__UserAlreadyRegistered();
        }

        if (s_hasVoted[_voter]) {
            revert Poll__UserAlreadyVoted();
        }

        if (!(_option < s_options.length)) {
            revert Poll__InvalidOption();
        }

        s_hasVoted[_voter] = true;
        s_votes[_option] += 1;
        emit VoteCasted(_voter, _option);
    }

    /**
     * @notice End the poll. Can be called by manager or automatically by timestamp.
     */
    function end() external inState(State.ACTIVE) {
        s_state = State.ENDED;
        emit PollEnded(block.timestamp);
    }

    // Views
    /**
     * @notice Returns the vote counts for each option once poll has Ended.
     */
    function getResults() external view inState(State.ENDED) returns (uint256[] memory) {
        uint256 len = s_options.length;
        uint256[] memory results = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            results[i] = s_votes[i];
        }
        return results;
    }

    /**
     * @notice Retrieve number of registered participants.
     */
    function participantCount() external view returns (uint256) {
        return s_participantList.length;
    }

    /**
     * @notice Retrieve the list of option labels.
     */
    function getOptions() external view returns (string[] memory) {
        return s_options;
    }

    /**
     * @notice Retrieve the timestamp when voting ends
     */
    function getEndTime() external view returns (uint256) {
        return s_endTime;
    }

    /**
     * @notice Retrieve the participants
     */
    function getRegisteredParticipants() external view returns (address[] memory) {
        return s_participantList;
    }

    /**
     * @notice Retrieve the information weather a participant has voted already
     */
    function hasVoted(address _voter) external view returns (bool) {
        return s_hasVoted[_voter];
    }
}
