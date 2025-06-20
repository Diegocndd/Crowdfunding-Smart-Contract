# 🚀 Decentralized Crowdfunding Platform — Next.js + Solidity

This is a decentralized crowdfunding platform built with **Next.js (frontend)** and **Solidity smart contracts (backend)** deployed on the blockchain.

The smart contract follows an **All-or-Nothing crowdfunding model**, where funds are only transferred if the project reaches its goal before the deadline. Otherwise, contributors can claim refunds.

---

## ⚙️ How It Works

### 🔗 Smart Contract

The contract is located at: `contracts/Management.sol`

It consists of two main components:

- **CrowdfundingManagement**

  - Responsible for deploying new crowdfunding campaigns (projects).
  - Requires a small fee (`50 wei`) to create a project.
  - Emits an event `ProjectCreated` when a new campaign is created.
  - Stores all deployed projects in an array.

- **CrowdfundingProject**
  - Manages individual campaigns.
  - Accepts contributions with optional predefined pledges (labels with values) or free donations.
  - Follows an all-or-nothing rule:
    - If the goal is met by the deadline, the funds go to the project owner.
    - If the goal is not met, all contributors are refunded.
  - Emits:
    - `ContributionMade` on new donations.
    - `ProjectCompleted` when the campaign ends (successfully or not).
    - `Refunded` when users are refunded.

---

## 🌐 Frontend — Next.js dApp

The frontend is a fully decentralized application (dApp) built with Next.js and Ethers.js that allows users to:

- Create new crowdfunding campaigns.
- Contribute to existing campaigns with either predefined pledge amounts or custom donations.
- Monitor campaign progress in real-time.
- Claim refunds or finalize campaigns after deadlines.

---

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=YOUR_ALCHEMY_API_KEY
NEXT_PUBLIC_CONTRACT_ADDRESS=YOUR_DEPLOYED_MANAGEMENT_CONTRACT_ADDRESS
```

Alchemy is used as the blockchain infrastructure provider. It allows the frontend to connect to the Ethereum network (or other EVM-compatible networks) through reliable RPC endpoints.
