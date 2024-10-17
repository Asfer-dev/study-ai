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

export const formatDate = (createdAt: string): string => {
  const date = new Date(createdAt); // Convert the createdAt string to a Date object

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  // // Define options for formatting the date
  // const options: Intl.DateTimeFormatOptions = {
  //   year: "numeric",
  //   month: "long", // Use 'short' for abbreviated month names
  //   day: "numeric",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   hour12: true, // Set to false for 24-hour format
  // };

  // // Return the formatted date string
  // return date.toLocaleDateString("en-US", options);

  // Get month, day, year, hours, and minutes
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM"; // Determine AM/PM

  // Return the formatted date string
  return `${month}/${day}/${year}, ${hours}:${minutes} ${ampm}`;
};

export const getFileSizeInMB = (fileSizeStr: string): string => {
  const fileSizeInBytes = Number(fileSizeStr); // Convert the input string to a number

  if (isNaN(fileSizeInBytes) || fileSizeInBytes < 0) {
    throw new Error("Invalid file size"); // Handle invalid input
  }

  const fileSizeInMB = fileSizeInBytes / (1024 * 1024); // Convert bytes to MB

  return fileSizeInMB.toFixed(2) + " MB"; // Return size formatted to 2 decimal places
};

export function timeAgo(createdAt: string): string {
  const postDate = new Date(createdAt);
  const now = new Date();

  // Get the time difference in milliseconds
  const diffInMs = now.getTime() - postDate.getTime();

  // Convert the difference to minutes, hours, and days
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Handle cases
  if (diffInMinutes < 1) {
    return "just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }
}
