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
<<<<<<< HEAD
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
    uint256 private duration = 0;

    mapping(string country => bool isAllowed) private countriesAllowed;

    address private immutable OWNER;
=======

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
>>>>>>> ff935c8 (initial Poll setup)

    // Events
    event PollStarted(uint256 indexed startTime, uint256 indexed endTime);
    event PollEnded(uint256 indexed endTime);
    event ParticipantAdded(address indexed participant);
    event ParticipantVerified(address indexed participant);
    event VoteCasted(address indexed voter, uint256 indexed option);

    // Modifiers
    modifier onlyOwner() {
<<<<<<< HEAD
        if (msg.sender != OWNER) {
=======
        if (msg.sender != i_owner) {
>>>>>>> ff935c8 (initial Poll setup)
            revert Poll__NotAnOwner();
        }
        _;
    }

    modifier onlyGovernor() {
<<<<<<< HEAD
        if (msg.sender != GOVERNOR) {
=======
        if (msg.sender != i_governor) {
>>>>>>> ff935c8 (initial Poll setup)
            revert Poll__NotAGovernor();
        }
        _;
    }

    modifier inState(State expected) {
<<<<<<< HEAD
        if (state != expected) {
=======
        if (s_state != expected) {
>>>>>>> ff935c8 (initial Poll setup)
            revert Poll__NotExpectedState();
        }
        _;
    }

    // Constructor
    /**
     * @param _title    The poll title
     * @param _options  The array of option labels
<<<<<<< HEAD
     * @ param _duration Duration in seconds for which the poll runs once started
     */
    constructor(
        string memory _title,
        string[] memory _options,
        //uint256 _duration,
        address _owner,
        string[] memory _countries
    ) {
=======
     * @param _duration Duration in seconds for which the poll runs once started
     */
    constructor(string memory _title, string[] memory _options, uint256 _duration, address _owner) {
>>>>>>> ff935c8 (initial Poll setup)
        if (_options.length < 2) {
            revert Poll__OptionCountMustBeGreaterThanTwo();
        }

<<<<<<< HEAD
        // if (_duration == 0) {
        //     revert Poll__MustLastLongerThanZero();
        // }

        title = _title;
        options = _options;
        GOVERNOR = msg.sender;
        OWNER = _owner;
        state = State.CREATED;
        //duration = _duration;
        endTime = 0;
        startTime = 0;
        for (uint256 i = 0; i < _countries.length; i++) {
            countriesAllowed[_countries[i]] = true;
        }
=======
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
>>>>>>> ff935c8 (initial Poll setup)
    }

    // Management
    /**
     * @notice Activate the poll. Sets startTime and endTime, moves state to Active.
     */
    function start() external onlyOwner inState(State.CREATED) {
<<<<<<< HEAD
        startTime = block.timestamp;
        endTime = block.timestamp + duration;

        state = State.ACTIVE;
        emit PollStarted(startTime, endTime);
=======
        s_startTime = block.timestamp;
        s_endTime = block.timestamp + s_duration;

        s_state = State.ACTIVE;
        emit PollStarted(s_startTime, s_endTime);
>>>>>>> ff935c8 (initial Poll setup)
    }

    /**
     * @notice Add a participant
     * @param _participant Address to register
     */
<<<<<<< HEAD
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
=======
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
>>>>>>> ff935c8 (initial Poll setup)
    }

    // Voting
    /**
     * @notice Cast your vote once poll is Active.
     * @param _option Index of the chosen option
     */
    function castVote(address _voter, uint256 _option) external inState(State.ACTIVE) {
<<<<<<< HEAD
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
=======
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
>>>>>>> ff935c8 (initial Poll setup)
        emit VoteCasted(_voter, _option);
    }

    /**
     * @notice End the poll. Can be called by manager or automatically by timestamp.
     */
    function end() external inState(State.ACTIVE) {
<<<<<<< HEAD
        state = State.ENDED;
=======
        s_state = State.ENDED;
>>>>>>> ff935c8 (initial Poll setup)
        emit PollEnded(block.timestamp);
    }

    // Views
    /**
     * @notice Returns the vote counts for each option once poll has Ended.
     */
    function getResults() external view inState(State.ENDED) returns (uint256[] memory) {
<<<<<<< HEAD
        uint256 len = options.length;
        uint256[] memory results = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            results[i] = votes[i];
=======
        uint256 len = s_options.length;
        uint256[] memory results = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            results[i] = s_votes[i];
>>>>>>> ff935c8 (initial Poll setup)
        }
        return results;
    }

    /**
     * @notice Retrieve number of registered participants.
     */
    function participantCount() external view returns (uint256) {
<<<<<<< HEAD
        return participantList.length;
=======
        return s_participantList.length;
>>>>>>> ff935c8 (initial Poll setup)
    }

    /**
     * @notice Retrieve the list of option labels.
     */
    function getOptions() external view returns (string[] memory) {
<<<<<<< HEAD
        return options;
=======
        return s_options;
>>>>>>> ff935c8 (initial Poll setup)
    }

    /**
     * @notice Retrieve the timestamp when voting ends
     */
    function getEndTime() external view returns (uint256) {
<<<<<<< HEAD
        return endTime;
=======
        return s_endTime;
>>>>>>> ff935c8 (initial Poll setup)
    }

    /**
     * @notice Retrieve the participants
     */
    function getRegisteredParticipants() external view returns (address[] memory) {
<<<<<<< HEAD
        return participantList;
=======
        return s_participantList;
>>>>>>> ff935c8 (initial Poll setup)
    }

    /**
     * @notice Retrieve the information weather a participant has voted already
     */
<<<<<<< HEAD
    function hasUserVoted(address _voter) external view returns (bool) {
        return hasVoted[_voter];
=======
    function hasVoted(address _voter) external view returns (bool) {
        return s_hasVoted[_voter];
>>>>>>> ff935c8 (initial Poll setup)
    }
}
