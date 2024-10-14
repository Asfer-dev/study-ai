import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toPusherKey(key: string) {
  return key.replace(/:/g, "__");
}

export function chatHrefConstructor(id1: string, id2: string) {
  const sortedIds = [id1, id2].sort();
  return `${sortedIds[0]}-${sortedIds[1]}`;
}

export const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export const bgColors: string[] = [
  "gray-400",
  "red-400",
  "orange-400",
  "amber-400",
  "lime-400",
  "green-400",
  "cyan-400",
  "blue-400",
  "indigo-400",
  "rose-400",
];

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomBgColor(): string {
  return bgColors[getRandomNumber(0, bgColors.length - 1)];
}

export function getFileTypeFromUrl(url: string): "image" | "video" | "unknown" {
  // Extract the file extension from the URL
  if (!url) {
    return "unknown";
  }
  const extension: string | undefined = url.split(".").pop()?.toLowerCase();

  // Define image and video extensions
  const imageExtensions: string[] = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "svg",
    "webp",
  ];
  const videoExtensions: string[] = [
    "mp4",
    "mov",
    "avi",
    "mkv",
    "webm",
    "flv",
    "wmv",
  ];

  if (extension && imageExtensions.includes(extension)) {
    return "image";
  } else if (extension && videoExtensions.includes(extension)) {
    return "video";
  } else {
    return "unknown";
  }
}
