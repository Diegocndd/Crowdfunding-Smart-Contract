import { useState } from "react";
import Modal from "../Modal";
import { useWeb3 } from "@/contexts/web3";
import { useContract } from "@/contexts/contract";
import Web3 from "web3";
import CrowdfundingManagementABI from "@/ABIs/CrowdfundingManagement.json";

const CONTRACT_ADDRESS = "0x84aDe3C63BA0f64833102C014c4c39a412557c9A";
const NewProjectModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { web3, account } = useWeb3();
  const { contract } = useContract();

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [goalEther, setGoalEther] = useState("");
  const [labels, setLabels] = useState<string[]>([""]);
  const [values, setValues] = useState<string[]>([""]);
  const [deadlineDays, setDeadlineDays] = useState("30");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addLabelValue = () => {
    setLabels([...labels, ""]);
    setValues([...values, ""]);
  };

  const removeLabelValue = (index: number) => {
    setLabels(labels.filter((_, i) => i !== index));
    setValues(values.filter((_, i) => i !== index));
  };

  const updateLabel = (index: number, value: string) => {
    const newLabels = [...labels];
    newLabels[index] = value;
    setLabels(newLabels);
  };

  const updateValue = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
  };

  const createNewProject = async () => {
    if (!contract || !web3) return;

    if (!account) {
      alert("Connect your wallet!");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const from = account;

      if (!projectName || !projectDescription || !goalEther || !deadlineDays) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
      }

      const goal = web3.utils.toWei(goalEther, "ether");
      const filteredLabels = labels.filter((l) => l.trim() !== "");
      const filteredValues = values
        .filter((_, i) => labels[i]?.trim() !== "")
        .map((v) => Number(v));

      if (filteredLabels.length !== filteredValues.length) {
        setError("Labels and values must match.");
        setLoading(false);
        return;
      }

      const deadline =
        Math.floor(Date.now() / 1000) + 60 * 60 * 24 * Number(deadlineDays);

      const w3 = new Web3(window.ethereum);

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }],
      });

      const _contract = new w3.eth.Contract(
        CrowdfundingManagementABI,
        CONTRACT_ADDRESS
      );

      const receipt = await _contract.methods
        .createProject(
          projectName,
          projectDescription,
          goal,
          filteredLabels,
          filteredValues,
          deadline
        )
        .send({
          from,
          value: "50",
        });

      setLoading(false);
      onClose();
      setProjectName("");
      setProjectDescription("");
      setGoalEther("");
      setLabels([""]);
      setValues([""]);
      setDeadlineDays("30");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError("Failed to create project.");
      console.error(err);
    }
  };

  return (
    <Modal width="35%" isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="flex flex-col gap-3">
        <label className="flex flex-col">
          Project Name
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="border rounded px-3 py-2 mt-1"
            placeholder="Enter project name"
          />
        </label>

        <label className="flex flex-col">
          Project Description
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="border rounded px-3 py-2 mt-1 resize-none"
            placeholder="Brief description"
            rows={3}
          />
        </label>

        <label className="flex flex-col">
          Goal (in ETH)
          <input
            type="number"
            min="0"
            step="0.01"
            value={goalEther}
            onChange={(e) => setGoalEther(e.target.value)}
            className="border rounded px-3 py-2 mt-1"
            placeholder="e.g. 1.5"
          />
        </label>

        <div>
          <p className="font-semibold mb-1">Labels and Values</p>
          {labels.map((label, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                value={label}
                onChange={(e) => updateLabel(i, e.target.value)}
                placeholder="Label"
                className="border rounded px-2 py-1 flex-1"
              />
              <input
                type="number"
                min="0"
                value={values[i]}
                onChange={(e) => updateValue(i, e.target.value)}
                placeholder="Value"
                className="border rounded px-2 py-1 w-24"
              />
              {labels.length > 1 && (
                <button
                  onClick={() => removeLabelValue(i)}
                  className="text-red-600 font-bold px-2"
                  type="button"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addLabelValue}
            type="button"
            className="text-blue-600 hover:underline text-sm"
          >
            + Add label
          </button>
        </div>

        <label className="flex flex-col">
          Deadline (days from now)
          <input
            type="number"
            min="1"
            value={deadlineDays}
            onChange={(e) => setDeadlineDays(e.target.value)}
            className="border rounded px-3 py-2 mt-1"
          />
        </label>

        <button
          onClick={createNewProject}
          disabled={loading}
          className={`mt-4 px-4 py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </div>
    </Modal>
  );
};

export default NewProjectModal;
