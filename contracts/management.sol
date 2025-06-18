// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

// All-or-Nothing Crowdfunding
contract CrowdfundingManagement {
    event ProjectCreated(
        address indexed owner,
        address projectAddress,
        string name,
        uint goal,
        uint deadline
    );

    CrowdfundingProject[] public projects;
    uint public counter;

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
        require(_labels.length != 0, "Labels must not be empty");

        CrowdfundingProject crowd = new CrowdfundingProject(
            projectName,
            projectDescription,
            msg.sender,
            goal,
            _labels,
            _values,
            deadline
        );

        emit ProjectCreated(
            msg.sender,
            address(crowd),
            projectName,
            goal,
            deadline
        );
        counter += 1;
        projects.push(crowd);
    }
}

contract CrowdfundingProject {
    event ContributionMade(
        address indexed contributor,
        uint amount,
        bool isFreeDonation
    );
    event ProjectCompleted(address indexed owner, bool successful);
    event Refunded(address indexed contributor, uint amount);

    string public name;
    string public description;
    address public owner;
    uint public goal;
    uint public balance;
    uint public deadline;

    struct Pledge {
        uint value;
        string label;
    }

    Pledge[] public pledges;

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
            pledges.push(Pledge({value: _values[i], label: _labels[i]}));
        }
    }

    function refundContributors() private {
        for (uint256 index = 0; index < contributions.length; index++) {
            if (contributions[index].value > 0) {
                (bool success, ) = payable(contributions[index].contributor)
                    .call{value: contributions[index].value}("");
                require(success, "Refund failed");
                balance -= contributions[index].value;
                emit Refunded(
                    address(contributions[index].contributor),
                    contributions[index].value
                );
            }
        }
    }

    function complete() public {
        bool deadlineReached = block.timestamp >= deadline;

        require(deadlineReached, "Deadline not reached yet");
        require(!isFinalized, "Project already finalized");

        isFinalized = true;

        if (goal > balance) {
            refundContributors();
            emit ProjectCompleted(owner, false);
            return;
        }

        emit ProjectCompleted(owner, true);
        payable(owner).transfer(address(this).balance);
    }

    function contribute(bool isFreeDonation) public payable {
        bool deadlineReached = block.timestamp >= deadline;

        require(!deadlineReached, "Completed campaign!");
        require(msg.value > 0, "Insufficient value");

        bool hasPledge = false;
        string memory pledgeLabel = "";

        for (uint i = 0; i < pledges.length; i++) {
            if (pledges[i].value == msg.value) {
                hasPledge = true;
                pledgeLabel = pledges[i].label;
                break;
            }
        }

        if (isFreeDonation) {
            balance += msg.value;
            emit ContributionMade(address(msg.sender), msg.value, true);
            return;
        }

        require(
            hasPledge,
            "Your value does not fit any of this campaign pledges"
        );

        balance += msg.value;

        contributions.push(
            Contribution({
                value: msg.value,
                contributor: address(msg.sender),
                pledge: pledgeLabel
            })
        );

        emit ContributionMade(address(msg.sender), msg.value, false);
    }
}
