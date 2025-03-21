"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface BusFormData {
  routeName: string;
  routeDescription: string;
  stopName: string;
  location: string;
  stopDescription: string;
  arrivalTime: string;
  departureTime: string;
  sequence: number;
}

const initialFormData: BusFormData = {
  routeName: "",
  routeDescription: "",
  stopName: "",
  location: "",
  stopDescription: "",
  arrivalTime: "",
  departureTime: "",
  sequence: 1,
};

const AddBusForm = () => {
  const [formData, setFormData] = useState<BusFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sequence" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("Submitting form data:", formData);

      const response = await fetch("/api/bus-schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Server response:", { status: response.status, data });

      if (!response.ok) {
        const errorMessage =
          data.error || data.details || "Failed to add bus schedule";
        console.error("Server error:", errorMessage);
        throw new Error(errorMessage);
      }

      console.log("Successfully added bus schedule:", data);
      setFormData(initialFormData);
      router.refresh();
      window.location.reload();
    } catch (err) {
      console.error("Form submission error details:", {
        error: err,
        message: err instanceof Error ? err.message : "Unknown error",
      });
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Bus Route</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Route Name*
            </label>
            <input
              type="text"
              name="routeName"
              value={formData.routeName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              placeholder="Enter route name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Route Description
            </label>
            <input
              type="text"
              name="routeDescription"
              value={formData.routeDescription}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Optional description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stop Name*
            </label>
            <input
              type="text"
              name="stopName"
              value={formData.stopName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              placeholder="Enter stop name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location*
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              placeholder="Enter location"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stop Description
            </label>
            <input
              type="text"
              name="stopDescription"
              value={formData.stopDescription}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Optional description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sequence*
            </label>
            <input
              type="number"
              name="sequence"
              value={formData.sequence}
              onChange={handleChange}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              placeholder="Enter sequence number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Arrival Time* (HH:MM)
            </label>
            <input
              type="time"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              pattern="[0-9]{2}:[0-9]{2}"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Departure Time* (HH:MM)
            </label>
            <input
              type="time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              pattern="[0-9]{2}:[0-9]{2}"
            />
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">* Required fields</p>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Adding..." : "Add Route"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBusForm;
