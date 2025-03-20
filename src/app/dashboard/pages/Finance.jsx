"use client";

import { useState, useCallback } from "react";
import FinanceCard from "../components/FinanceCard.jsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function FinancePage() {
  const [credits, setCredits] = useState(100);
  const deductCredits = (amount) => setCredits((prev) => prev - amount);
  const [darkMode] = useState(true); // Assuming dark mode is enabled; you can pass this from a parent if needed

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

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

  return (
    <div className="relative flex flex-col h-full p-6">
      <Particles
        id="tsparticles-finance"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />
      <div className="relative z-10 flex flex-col h-full">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <Link href="/dashboard" className="hover:text-primary">
              Dashboard
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="text-muted-foreground">Finance</span>
          </BreadcrumbItem>
        </Breadcrumb>
        <div className="flex-1">
          <FinanceCard credits={credits} deductCredits={deductCredits} />
        </div>
      </div>
    </div>
  );
}