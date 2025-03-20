import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWallet, FaChartLine, FaBook, FaVideo, FaFolder, FaBuilding, FaFileAlt, FaBus, FaCar, FaReceipt, FaUserGraduate, FaUsers, FaSun, FaMoon } from "react-icons/fa";
import { MdSchool, MdWork } from "react-icons/md";
import Link from "next/link";

export default function Sidebar({ darkMode, setDarkMode }) {
  const [financeOpen, setFinanceOpen] = useState(true);
  const [examPrepOpen, setExamPrepOpen] = useState(false);
  const [interviewPrepOpen, setInterviewPrepOpen] = useState(false);
  const [studentPortalOpen, setStudentPortalOpen] = useState(false);
  const [hostelOpen, setHostelOpen] = useState(false);

  const sidebarVariants = {
    open: { width: "16rem", transition: { duration: 0.3 } },
    closed: { width: "4rem", transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg z-20"
      initial="open"
      animate="open"
      variants={sidebarVariants}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            CampusBuddy
          </span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setFinanceOpen(!financeOpen)}
                className="flex items-center w-full p-2 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <FaWallet className="mr-2" />
                <span>Finance Management</span>
              </button>
              <AnimatePresence>
                {financeOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-4 space-y-1"
                  >
                    <li>
                      <Link href="/dashboard/finance" className="flex items-center p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <FaWallet className="mr-2" />
                        College Credit Card
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/expenditure" className="flex items-center p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <FaChartLine className="mr-2" />
                        Expenditure Log
                      </Link>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>

            <li>
              <button
                onClick={() => setExamPrepOpen(!examPrepOpen)}
                className="flex items-center w-full p-2 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <FaBook className="mr-2" />
                <span>Exam Prep</span>
              </button>
              <AnimatePresence>
                {examPrepOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-4 space-y-1"
                  >
                    <li>
                      <Link href="/dashboard/notes-assistant" className="flex items-center p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <FaBook className="mr-2" />
                        Notes Assistant
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/video-search" className="flex items-center p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <FaVideo className="mr-2" />
                        Video Search
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/note-hub" className="flex items-center p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <FaFolder className="mr-2" />
                        Note Hub
                      </Link>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>

            <li>
              <button
                onClick={() => setInterviewPrepOpen(!interviewPrepOpen)}
                className="flex items-center w-full p-2 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <MdWork className="mr-2" />
                <span>Interview Prep</span>
              </button>
              <AnimatePresence>
                {interviewPrepOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-4 space-y-1"
                  >
                    <li>
                      <Link href="/dashboard/company-info" className="flex items-center p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <FaBuilding className="mr-2" />
                        Company Info
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/resume-builder" className="flex items-center p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <FaFileAlt className="mr-2" />
                        Resume Builder
                      </Link>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>

            <li>
              <button
                onClick={() => setStudentPortalOpen(!studentPortalOpen)}
                className="flex items-center w-full p-2 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <MdSchool className="mr-2" />
                <span>Student Portal</span>
              </button>
              <AnimatePresence>
                {studentPortalOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-4 space-y-1"
                  >
                    <li>
                      <Link href="/dashboard/bus-routes" className="flex items-center p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <FaBus className="mr-2" />
                        Bus Routes
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/hostel" className="flex items-center p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <FaUsers className="mr-2" />
                        Hostel
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/car-pool" className="flex items-center p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <FaCar className="mr-2" />
                        Car Pool
                      </Link>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          </ul>
        </nav>
      </div>
    </motion.div>
  );
}