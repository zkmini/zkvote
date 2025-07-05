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
    error Poll__UserNotOldEnough();
    error Poll_UserWithInvalidNationality();

    // State Variables
    address private immutable GOVERNOR;

    string private title;
    State private state;

    string[] private options;
    mapping(uint256 option => uint256 voteCounter) public votes;

    address[] private participantList;
    mapping(address paticipant => bool isRegistered) public isRegistered;
    mapping(address paticipant => bool hasVoted) public hasVoted;

    uint256 private startTime;
    uint256 private endTime;
    uint256 private duration;

    mapping(string country => bool isAllowed) private countriesAllowed;

    address private immutable OWNER;

    // Events
    event PollStarted(uint256 indexed startTime, uint256 indexed endTime);
    event PollEnded(uint256 indexed endTime);
    event ParticipantAdded(address indexed participant);
    event ParticipantVerified(address indexed participant);
    event VoteCasted(address indexed voter, uint256 indexed option);

    // Modifiers
    modifier onlyOwner() {
        if (msg.sender != OWNER) {
            revert Poll__NotAnOwner();
        }
        _;
    }

    modifier onlyGovernor() {
        if (msg.sender != GOVERNOR) {
            revert Poll__NotAGovernor();
        }
        _;
    }

    modifier inState(State expected) {
        if (state != expected) {
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
    constructor(
        string memory _title,
        string[] memory _options,
        uint256 _duration,
        address _owner,
        string[] memory _countries
    ) {
        if (_options.length < 2) {
            revert Poll__OptionCountMustBeGreaterThanTwo();
        }

        if (_duration == 0) {
            revert Poll__MustLastLongerThanZero();
        }

        title = _title;
        options = _options;
        GOVERNOR = msg.sender;
        OWNER = _owner;
        state = State.CREATED;
        duration = _duration;
        endTime = 0;
        startTime = 0;
        for (uint256 i = 0; i < _countries.length; i++) {
            countriesAllowed[_countries[i]] = true;
        }
    }

    // Management
    /**
     * @notice Activate the poll. Sets startTime and endTime, moves state to Active.
     */
    function start() external onlyOwner inState(State.CREATED) {
        startTime = block.timestamp;
        endTime = block.timestamp + duration;

        state = State.ACTIVE;
        emit PollStarted(startTime, endTime);
    }

    /**
     * @notice Add a participant
     * @param _participant Address to register
     */
    function addParticipant(address _participant, string memory _country) external onlyGovernor {
        if (isRegistered[_participant]) {
            revert Poll__UserAlreadyRegistered();
        }

        if (!(countriesAllowed[_country])) {
            revert Poll_UserWithInvalidNationality();
        }

        isRegistered[_participant] = true;
        participantList.push(_participant);
        emit ParticipantAdded(_participant);
    }

    // Voting
    /**
     * @notice Cast your vote once poll is Active.
     * @param _option Index of the chosen option
     */
    function castVote(address _voter, uint256 _option) external inState(State.ACTIVE) {
        if (isRegistered[_voter]) {
            revert Poll__UserAlreadyRegistered();
        }

        if (hasVoted[_voter]) {
            revert Poll__UserAlreadyVoted();
        }

        if (!(_option < options.length)) {
            revert Poll__InvalidOption();
        }

        hasVoted[_voter] = true;
        votes[_option] += 1;
        emit VoteCasted(_voter, _option);
    }

    /**
     * @notice End the poll. Can be called by manager or automatically by timestamp.
     */
    function end() external inState(State.ACTIVE) {
        state = State.ENDED;
        emit PollEnded(block.timestamp);
    }

    // Views
    /**
     * @notice Returns the vote counts for each option once poll has Ended.
     */
    function getResults() external view inState(State.ENDED) returns (uint256[] memory) {
        uint256 len = options.length;
        uint256[] memory results = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            results[i] = votes[i];
        }
        return results;
    }

    /**
     * @notice Retrieve number of registered participants.
     */
    function participantCount() external view returns (uint256) {
        return participantList.length;
    }

    /**
     * @notice Retrieve the list of option labels.
     */
    function getOptions() external view returns (string[] memory) {
        return options;
    }

    /**
     * @notice Retrieve the timestamp when voting ends
     */
    function getEndTime() external view returns (uint256) {
        return endTime;
    }

    /**
     * @notice Retrieve the participants
     */
    function getRegisteredParticipants() external view returns (address[] memory) {
        return participantList;
    }

    /**
     * @notice Retrieve the information weather a participant has voted already
     */
    function hasUserVoted(address _voter) external view returns (bool) {
        return hasVoted[_voter];
    }
}
