"use client";
import NewProjectModal from "@/components/NewProjectModal";
import ProjectsList from "@/components/ProjectsList";
import SupportProjectModal from "@/components/SupportProjectModal";
import { useContract } from "@/contexts/contract";
import { useWeb3 } from "@/contexts/web3";
import { reduceString } from "@/utils";
import { useState } from "react";
import { FaPlus, FaWallet } from "react-icons/fa";

export default function Home() {
  const { connectWallet, account } = useWeb3();
  const { contract } = useContract();

  const [selectedProject, setSelectedProject] = useState("");
  const [supportModal, setSupportModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  return (
    <main className="relative flex min-h-screen bg-gray-100 flex-col items-center gap-12 py-10">
      {!account && (
        <button
          onClick={connectWallet}
          className="absolute flex items-center font-bold gap-2 cursor-pointer right-10 top-10 rounded-md px-8 py-2 text-white bg-blue-600 hover:bg-blue-700 transition-all"
        >
          <FaWallet />
          <span>Connect wallet</span>
        </button>
      )}

      {account && (
        <div className="absolute flex items-center font-bold gap-2 right-10 top-10 rounded-md px-8 py-2 text-blue-600 border-blue-600 border-2 bg-white">
          <FaWallet />
          <span>{reduceString(account, 15)}</span>
        </div>
      )}

      <button
        onClick={() => {
          setOpenModal(true);
        }}
        className="fixed cursor-pointer right-10 bottom-10 rounded-full p-5 text-white bg-blue-600"
      >
        <FaPlus size={20} />
      </button>

      <NewProjectModal isOpen={openModal} onClose={() => setOpenModal(false)} />

      <SupportProjectModal
        isOpen={supportModal}
        onClose={() => setSupportModal(false)}
        contractAddress={selectedProject}
      />

      <h1 className="font-bold text-3xl text-slate-800">
        Decentralized Crowdfunding Projects
      </h1>
      <div className="w-1/3">
        <ProjectsList
          setSelectedProject={setSelectedProject}
          setSupportModal={setSupportModal}
        />
      </div>
    </main>
  );
}
