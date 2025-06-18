"use client";

import useWeb3 from "@/hooks/useWeb3";

export default function ConnectButton() {
  const { account, connectWallet } = useWeb3();

  return (
    <div className="p-4">
      {account ? (
        <div className="text-green-600">
          Connected: {account.substring(0, 6)}...
          {account.substring(account.length - 4)}
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
