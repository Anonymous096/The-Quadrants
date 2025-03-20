// @ts-nocheck
import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import Sidebar from "./components/Sidebar.jsx";
import FinanceCard from "./components/FinanceCard.jsx";
import ExpenditureLog from "./components/ExpenditureLog.jsx";
import { dummyFinanceData } from "./data/dummyData.js";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

function HostelSection({ subsection, setSubsection }) {
  return (
    <div className="max-w-md mx-auto bg-white/30 dark:bg-gray-800/30 backdrop-blur-md p-6 rounded-lg shadow-lg border border-white/20 dark:border-gray-700/20">
      <h2 className="text-xl font-bold mb-4">Hostel</h2>
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${subsection === "roommateSelection" ? "bg-gray-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
          onClick={() => setSubsection("roommateSelection")}
        >
          Roommate Selection
        </button>
        <button
          className={`px-4 py-2 rounded ${subsection === "roommateShifting" ? "bg-gray-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
          onClick={() => setSubsection("roommateShifting")}
        >
          Roommate Shifting
        </button>
      </div>
      {subsection === "roommateSelection" ? (
        <div>
          <h3 className="text-lg font-semibold mb-2">Roommate Selection</h3>
          <p>Coming soon... Select your preferred roommates for your hostel.</p>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-2">Roommate Shifting</h3>
          <p>Coming soon... Request a room change within your hostel.</p>
        </div>
      )}
    </div>
  );
}

function DashboardApp() {
  const [activeSection, setActiveSection] = useState("collegeCreditCard");
  const [darkMode, setDarkMode] = useState(true);
  const [credits, setCredits] = useState(100);
  const [hostelSubsection, setHostelSubsection] = useState("roommateSelection");
  const deductCredits = (amount) => setCredits((prev) => prev - amount);

  const pageVariants = {
    initial: { opacity: 0, x: -100, scale: 0.95 },
    in: { opacity: 1, x: 0, scale: 1 },
    out: { opacity: 0, x: 100, scale: 0.95 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  const particlesOptions = {
    particles: {
      number: { value: 50, density: { enable: true, area: 800 } },
      color: { value: darkMode ? "#ffffff" : "#333333" },
      shape: { type: "circle" },
      opacity: { value: 0.3, random: true },
      size: { value: 3, random: true },
      move: { enable: true, speed: 1, direction: "none", random: true, outModes: "out" },
    },
    interactivity: {
      events: { onHover: { enable: true, mode: "repulse" }, onClick: { enable: true, mode: "push" } },
      modes: { repulse: { distance: 100 }, push: { quantity: 4 } },
    },
  };

  const renderSection = () => {
    switch (activeSection) {
      case "collegeCreditCard":
        return <FinanceCard credits={credits} deductCredits={deductCredits} />;
      case "expenditureLog":
        return <ExpenditureLog transactions={dummyFinanceData.transactions} />;
      case "notesAssistant":
        return (
          <div className="max-w-md mx-auto bg-white/30 dark:bg-gray-800/30 backdrop-blur-md p-6 rounded-lg shadow-lg border border-white/20 dark:border-gray-700/20">
            <h2 className="text-xl font-bold mb-4">Notes Assistant</h2>
            <p>Coming soon...</p>
          </div>
        );
      case "videoSearch":
        return (
          <div className="max-w-md mx-auto bg-white/30 dark:bg-gray-800/30 backdrop-blur-md p-6 rounded-lg shadow-lg border border-white/20 dark:border-gray-700/20">
            <h2 className="text-xl font-bold mb-4">Video Search</h2>
            <p>Coming soon...</p>
          </div>
        );
      case "noteHub":
        return (
          <div className="max-w-md mx-auto bg-white/30 dark:bg-gray-800/30 backdrop-blur-md p-6 rounded-lg shadow-lg border border-white/20 dark:border-gray-700/20">
            <h2 className="text-xl font-bold mb-4">Note Hub</h2>
            <p>Coming soon...</p>
          </div>
        );
      case "companyInfo":
        return (
          <div className="max-w-md mx-auto bg-white/30 dark:bg-gray-800/30 backdrop-blur-md p-6 rounded-lg shadow-lg border border-white/20 dark:border-gray-700/20">
            <h2 className="text-xl font-bold mb-4">Company Info</h2>
            <p>Coming soon...</p>
          </div>
        );
      case "resumeBuilder":
        return (
          <div className="max-w-md mx-auto bg-white/30 dark:bg-gray-800/30 backdrop-blur-md p-6 rounded-lg shadow-lg border border-white/20 dark:border-gray-700/20">
            <h2 className="text-xl font-bold mb-4">Resume Builder</h2>
            <p>Coming soon...</p>
          </div>
        );
      case "busRoutes":
        return (
          <div className="max-w-md mx-auto bg-white/30 dark:bg-gray-800/30 backdrop-blur-md p-6 rounded-lg shadow-lg border border-white/20 dark:border-gray-700/20">
            <h2 className="text-xl font-bold mb-4">Bus Routes</h2>
            <p>Coming soon...</p>
          </div>
        );
      case "hostel":
      case "roommateSelection":
      case "roommateShifting":
        return <HostelSection subsection={hostelSubsection} setSubsection={setHostelSubsection} />;
      case "carPool":
        return (
          <div className="max-w-md mx-auto bg-white/30 dark:bg-gray-800/30 backdrop-blur-md p-6 rounded-lg shadow-lg border border-white/20 dark:border-gray-700/20">
            <h2 className="text-xl font-bold mb-4">Car Pool</h2>
            <p>Coming soon...</p>
          </div>
        );
      default:
        return <FinanceCard credits={credits} deductCredits={deductCredits} />;
    }
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-100"}`}>
      <Sidebar
        setActiveSection={setActiveSection}
        activeSection={activeSection}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <motion.main
        className="relative flex-1 p-6 ml-64 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        key={activeSection}
      >
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particlesOptions}
          className="absolute inset-0 z-0"
        />
        <div className="relative z-10">
          <Suspense
            fallback={
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="spinner mx-auto"></div>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Loading...</p>
              </motion.div>
            }
          >
            {renderSection()}
          </Suspense>
        </div>
      </motion.main>
    </div>
  );
}

export default DashboardApp;