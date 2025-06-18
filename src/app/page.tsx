"use client";
import ConnectButton from "@/components/ConnectButton";
import ProjectsList from "@/components/ProjectsList";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-gray-100 flex-col items-center gap-12 py-10">
      <h1 className="font-bold text-3xl text-slate-800">
        Crowdfunding Projects
      </h1>
      <div className="w-1/3">
        <ProjectsList />
      </div>
    </main>
  );
}
