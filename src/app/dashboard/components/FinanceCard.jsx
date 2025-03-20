import React from "react";

export default function FinanceCard({ credits, deductCredits }) {
  return (
    <div className="w-full h-full bg-white/30 dark:bg-gray-800/30 backdrop-blur-md p-8 rounded-lg shadow-lg border border-white/20 dark:border-gray-700/20 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Student Credits</h2>
      <p className="text-4xl mb-6 text-gray-900 dark:text-white">{credits} Credits</p>
      <button
        onClick={() => deductCredits(10)}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg"
        disabled={credits < 10}
      >
        Use 10 Credits
      </button>
    </div>
  );
}