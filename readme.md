# Crowdfunding Smart Contracts

A decentralized crowdfunding system implemented with Ethereum smart contracts written in Solidity.

## Description

This project allows users to create crowdfunding campaigns with customizable goals, deadlines, and reward tiers. Each campaign is an individual smart contract, ensuring transparency, security, and autonomy.

## Features

- Create crowdfunding projects with name, description, goal, deadline, and reward tiers.
- Users can contribute with either free donations or fixed reward pledges.
- Track contributions and campaign balance.
- Automatic refunds to supporters if the funding goal is not reached by the deadline.
- Secure contract self-destruction after campaign ends, handling refunds and cleanup.

## How to Use

1. Deploy the `CrowdfundingManagement` contract.
2. Create a project via `createProject`, providing parameters like name, description, goal, deadline, and reward tiers.
3. Support a project by sending Ether to the campaign contract via the `contribute` function.
4. After the deadline:
   - If goal is met, funds are released to the owner.
   - If goal is not met, supporters can claim refunds.
5. The manager can destroy the contract after campaign completion, processing refunds and clearing state.

## Notes

- A fixed fee (e.g., 50 wei) is charged for project creation.
- Contributions can be linked to specific reward tiers with fixed amounts.

## License

MIT License
