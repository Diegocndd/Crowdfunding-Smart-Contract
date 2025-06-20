/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import CrowdfundingProjectABI from "@/ABIs/CrowdfundingProject.json";
import { useContract } from "@/contexts/contract";
import { useWeb3 } from "@/contexts/web3";
import { getDaysRemaining, getPercentage, reduceString } from "@/utils";

import { useEffect, useState } from "react";
import { BiSolidDonateHeart } from "react-icons/bi";
import { IoCopy } from "react-icons/io5";
import { LuClock } from "react-icons/lu";
import { RiHandCoinLine } from "react-icons/ri";

function formatNumber(num: number) {
  const str = num.toString();
  if (str.includes("e")) {
    const fixed = num.toFixed(20);
    return fixed.replace(/\.?0+$/, "");
  }
  return str;
}

export default function ProjectsList({
  setSelectedProject,
  setSupportModal,
}: any) {
  const { web3 } = useWeb3();
  const { contract } = useContract();

  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (!contract) return;

    async function fetchProjects() {
      if (!contract) return;
      try {
        const projArray = [];
        const totalProjects = await contract.methods.counter().call();

        for (let i = 0; i < Number(totalProjects); i++) {
          const projectAddress = await contract.methods.projects(i).call();

          const projectContract = new web3.eth.Contract(
            CrowdfundingProjectABI,
            // @ts-expect-error
            projectAddress
          );

          const name = await projectContract.methods.name().call();
          const deadline = await projectContract.methods.deadline().call();
          const goal = await projectContract.methods.goal().call();
          const balance = await projectContract.methods.balance().call();

          const description = await projectContract.methods
            .description()
            .call();

          projArray.push({
            address: projectAddress,
            name,
            description,
            deadline,
            goal,
            balance,
          });
        }

        setProjects(projArray);
      } catch (err) {
        console.error("Erro ao buscar projects:", err);
      }
    }

    fetchProjects();
  }, [contract]);

  return (
    <div className="text-slate-800 flex flex-col gap-4">
      {[...projects].map((proj, i) => (
        <div
          key={i}
          className="bg-white flex flex-col gap-1 border border-slate-200 shadow p-10 rounded-lg"
        >
          <span className="font-bold text-lg">{proj.name}</span>
          <div className="text-sm flex items-center gap-1">
            <span className="text-slate-400">
              {reduceString(proj.address, 20)}
            </span>
            <button
              onClick={() => {
                navigator.clipboard
                  .writeText(proj.address)
                  .then(() => {})
                  .catch((err) => {});
              }}
              className="cursor-pointer"
            >
              <IoCopy className="text-slate-700" />
            </button>
          </div>

          <p className="text-slate-800 mt-5">{proj.description}</p>

          <div className="text-slate-700 flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 text-slate-600">
              <RiHandCoinLine />
              <span>
                {formatNumber(
                  getPercentage(Number(proj.balance), Number(proj.goal))
                )}
                % funded
              </span>
            </div>
            ·
            <div className="flex items-center gap-1 text-slate-600">
              <LuClock />
              <span>{getDaysRemaining(Number(proj.deadline))} days left</span>
            </div>
          </div>

          <div>
            <button
              onClick={() => {
                setSelectedProject(proj.address);
                setSupportModal(true);
              }}
              className="cursor-pointer bg-slate-800 text-white rounded-md px-5 flex items-center gap-2 py-1 text-sm mt-6"
            >
              <BiSolidDonateHeart />
              <span>Back project</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
