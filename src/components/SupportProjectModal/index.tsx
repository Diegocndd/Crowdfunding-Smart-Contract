"use client";

import { useEffect, useState } from "react";
import Modal from "../Modal";
import { useWeb3 } from "@/contexts/web3";
import CrowdfundingProjectABI from "@/ABIs/CrowdfundingProject.json";
import Web3 from "web3";
import { FaWallet } from "react-icons/fa";

const SupportProjectModal = ({
  isOpen,
  onClose,
  contractAddress,
}: {
  isOpen: boolean;
  onClose: () => void;
  contractAddress: string;
}) => {
  const { web3, account, connectWallet } = useWeb3();

  const [pledges, setPledges] = useState<any[]>([]);
  const [selectedPledge, setSelectedPledge] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [projectContract, setProjectContract] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    if (loading) return;

    setPledges([]);
    setSelectedPledge(null);
    setCustomAmount("");
    setProjectContract(null);
    setLoading(false);
    onClose();
  };

  useEffect(() => {
    if (contractAddress) {
      (async () => {
        const w3 = new Web3(window.ethereum);

        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }],
        });

        const p = new w3.eth.Contract(CrowdfundingProjectABI, contractAddress);

        setProjectContract(p);
      })();
    }
  }, [contractAddress, web3.eth.Contract]);

  useEffect(() => {
    if (!projectContract) return;

    const fetchPledges = async () => {
      const pledgesArray = [];
      let index = 0;
      while (true) {
        try {
          const pledge = await projectContract.methods.pledges(index).call();
          if (Number(pledge.value) === 0) break;
          pledgesArray.push({
            label: pledge.label,
            value: pledge.value, // já está em wei
          });
          index++;
        } catch {
          break;
        }
      }
      setPledges(pledgesArray);
    };

    fetchPledges();
  }, [projectContract]);

  const handleDonate = async () => {
    if (!account) return;
    try {
      setLoading(true);

      const isFreeDonation = selectedPledge === null;
      const valueInWei = isFreeDonation
        ? customAmount
        : pledges[selectedPledge!].value;

      await projectContract.methods.contribute(isFreeDonation).send({
        from: account,
        value: valueInWei,
      });

      alert("Donation successful!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Donation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal width="35%" isOpen={isOpen} onClose={closeModal}>
      <h2 className="text-2xl font-bold mb-4">Donate to this project</h2>

      <div className="flex flex-col gap-4">
        {pledges.map((pledge, index) => (
          <button
            key={index}
            className={`p-3 rounded border ${
              selectedPledge === index
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200"
            }`}
            onClick={() => {
              setSelectedPledge(index);
              setCustomAmount("");
            }}
          >
            <span className="font-semibold">{pledge.value} wei</span> —{" "}
            {pledge.label}
          </button>
        ))}

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Custom amount in wei"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedPledge(null);
            }}
            className="w-full border border-slate-300 p-2 rounded"
          />
        </div>

        {account && (
          <button
            onClick={handleDonate}
            disabled={
              loading ||
              (!customAmount && selectedPledge === null) ||
              (customAmount !== "" && Number(customAmount) <= 0)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded"
          >
            {loading ? "Processing..." : "Donate"}
          </button>
        )}

        {!account && (
          <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded flex items-center gap-2 justify-center cursor-pointer"
          >
            <FaWallet />
            <span>Connect wallet</span>
          </button>
        )}
      </div>
    </Modal>
  );
};

export default SupportProjectModal;
