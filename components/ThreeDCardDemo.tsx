"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Link from "next/link";
import { Session } from "inspector/promises";

interface SanityUser {
  _id: string;
  username?: string;
  email?: string;
  image?: string;
  Bio?: string;
}

export interface Project {
  _id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  user?: SanityUser;
  slug?: {
    _type: 'slug';
    current: string;
  };
  category?: string;
  details?: string;
}

interface ThreeDCardDemoProps {
  project: Project;
}

export function ThreeDCardDemo({ project }: ThreeDCardDemoProps) {
  return (
    <CardContainer className="inter-var h-[20rem]">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[22rem] h-[28rem] rounded-xl p-4 border mr-4">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          {project.title || "Untitled Project"}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          {project.description || "No description available"}
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <img
            src={project.imageUrl || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt={project.title || "Project thumbnail"}
          />
        </CardItem>
        <div className="flex justify-between items-center mt-8">
          <Link href={`/project/${project._id}`}>
            <CardItem
              translateZ={20}
              as="button"
              className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white cursor-pointer"
            >
              View Details →
            </CardItem>
          </Link>

          {project.user?.username && (
            <CardItem
                    translateZ={20}
                    as="button"
                    className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                >
                  <Link href={`/user/${encodeURIComponent(project.user.username)}`}>
                    {project.user.username}
                    
                  </Link>
                </CardItem>
          )}
        </div>
      </CardBody>
    </CardContainer>
  );
}