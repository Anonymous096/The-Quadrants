"use client";

import { useUser } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import FileUpload from "@/components/FileUpload";

export default function InterviewPage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto p-4 lg:p-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Upload Resume
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Upload your resume in PDF format to get started
          </p>
          <FileUpload />
        </div>
      </div>
    </div>
  );
}
