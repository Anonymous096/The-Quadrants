"use client";

import { Command } from "lucide-react";
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavSecondary } from "./nav-secondary";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Command,
    },
    {
      title: "Exam Preperation",
      url: "/dashboard/exam", // Updated URL from the second file
      icon: Command,
    },
    {
      title: "Interview Preperation",
      url: "/dashboard/interview-prep",
      icon: Command,
    },
    {
      title: "Bus Routing",
      url: "/bus-routing", // From the first file
      icon: Command,
    },
    {
      title: "Carpooling",
      url: "/carpooling", // From the first file
      icon: Command,
    },
    {
      title: "Comunity",
      url: "/comunity", // From the first file
      icon: Command,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Command,
    },
  ],
  projects: [
    {
      name: "Project 1",
      url: "/dashboard/project/1", // From the first file
      icon: Command,
    },
    {
      name: "Project 2",
      url: "/dashboard/project/2", // From the first file
      icon: Command,
    },
    {
      name: "General Posts",
      url: "/dashboard/posts", // From the second file
      icon: Command,
    },
  ],
  navSecondary: [
    {
      title: "Help",
      url: "/help",
      icon: Command,
    },
    {
      title: "Documentation",
      url: "/docs",
      icon: Command,
    },
  ],
};

export function NavLinks() {
  return (
    <>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Campus Buddy</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </>
  );
}