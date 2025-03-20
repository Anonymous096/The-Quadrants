"use client";

import DashboardApp from "./DashboardApp.js";
import "./index.css";
import "./App.css";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbItem>
          <Link href="/dashboard" className="hover:text-primary">
            Dashboard
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <DashboardApp />
    </div>
  );
}