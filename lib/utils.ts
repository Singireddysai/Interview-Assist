import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings];
};

const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
};

export const parseTechStack = (input: string | string[]): string[] => {
  const raw = Array.isArray(input) ? input.join(",") : input;

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((t) => t.toLowerCase().trim());
    }
  } catch {}

  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\s,.-]/gi, "")
    .replace(/[\s.,-]*(and|&)[\s.,-]*/gi, ",")
    .replace(/[\s.-]+/g, ",")
    .split(",")
    .map((tech) => tech.trim())
    .filter((tech) => tech.length > 0);
};

export const getTechLogos = async (techInput: string[] | string) => {
  const techArray = parseTechStack(techInput);

  const logoURLs = techArray.map((tech) => {
    const normalized = tech
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg",
    }))
  );

  return results;
};

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};

export const getInterviewCover = (interviewRole: string): string => {
  const availableCovers = [
    "ai",
    "back-end",
    "cloud-developer",
    "data-science",
    "front-end",
    "full-stack",
    "machine-learning",
    "mobile-developer",
    "web-designing",
    "general",
  ];

  const normalize = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]/g, "");

  const normalizedRole = normalize(interviewRole);

  const coverMap: Record<string, string> = {};
  availableCovers.forEach((cover) => {
    coverMap[normalize(cover)] = cover;
  });

  const matchedCover = coverMap[normalizedRole] || "general";

  return `/interview-covers/${matchedCover}.jpg`;
};
