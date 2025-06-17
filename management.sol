// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

// All-or-Nothing Crowdfunding
contract CrowdfundingManagement {
    mapping(address => CrowdfundingProject) public projects;

    function createProject(
        string memory projectName,
        string memory projectDescription,
        uint goal,
        string[] memory _labels,
        uint[] memory _values,
        uint deadline
    ) public payable {
        require(msg.value == 50 wei, "Insufficient fee");
        require(
            _labels.length == _values.length,
            "Mismatched labels and values"
        );
        require(_labels.length == 0, "Labels must not be empty");

        CrowdfundingProject crowd = new CrowdfundingProject(
            projectName,
            projectDescription,
            address(msg.sender),
            goal,
            _labels,
            _values,
            deadline
        );

        projects[address(msg.sender)] = crowd;
    }
}

contract CrowdfundingProject {
    string public name;
    string public description;
    address public owner;
    uint public goal;
    uint public balance;
    uint public deadline;
    mapping(uint => string) public pledges;

    bool public isFinalized = false;

    struct Contribution {
        uint value;
        string pledge;
        address contributor;
    }

    Contribution[] public contributions;

    constructor(
        string memory _name,
        string memory _description,
        address _owner,
        uint _goal,
        string[] memory _labels,
        uint[] memory _values,
        uint _deadline
    ) {
        name = _name;
        description = _description;
        owner = _owner;
        goal = _goal;
        deadline = _deadline;

        for (uint i = 0; i < _values.length; i++) {
            pledges[_values[i]] = _labels[i];
        }
    }

    modifier checkDeadline() {
        require(block.timestamp >= deadline, "Deadline passed");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Restricted to owner!");
        _;
    }

    function refundContributors() private {
        for (uint256 index = 0; index < contributions.length; index++) {
            if (contributions[index].value > 0) {
                (bool success, ) = payable(contributions[index].contributor)
                    .call{value: contributions[index].value}("");
                require(success, "Refund failed");
            }
        }
    }

    function complete() public {
        bool deadlineReached = block.timestamp >= deadline;

        require(!deadlineReached, "Deadline not reached yet");
        require(!isFinalized, "Project already finalized");

        isFinalized = true;

        if (goal > balance) {
            refundContributors();
            return;
        }

        payable(owner).transfer(address(this).balance);
    }

    function contribute(bool isFreeDonation) public payable checkDeadline {
        bool deadlineReached = block.timestamp >= deadline;
        require(deadlineReached, "Completed campaign!");
        require(msg.value > 0, "Insufficient value");

        bool hasPledge = bytes(pledges[msg.value]).length != 0;

        if (isFreeDonation) {
            balance += msg.value;
            return;
        }

        require(
            hasPledge,
            "Your value does not fit any of this campaign pledges"
        );

        contributions.push(
            Contribution({
                value: msg.value,
                contributor: address(msg.sender),
                pledge: pledges[msg.value]
            })
        );
    }
}
