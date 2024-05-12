"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function NotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md px-4 text-center">
        <GuitarIcon className="mx-auto h-24 w-24 text-gray-500 dark:text-gray-400" />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl">
          Oops! You&apos;ve hit a wrong note.
        </h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          What you&apos;re looking for doesn&apos;t exist. Let&apos;s get you
          back on track.
        </p>
        <div className="mt-6">
          <Button
            className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-700 dark:focus:ring-offset-gray-900"
            onClick={() => router.back()}
          >
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

function GuitarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m20 7 1.7-1.7a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0L17 4v3Z" />
      <path d="m17 7-5.1 5.1" />
      <circle cx="11.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M6 12a2 2 0 0 0 1.8-1.2l.4-.9C8.7 8.8 9.8 8 11 8c2.8 0 5 2.2 5 5 0 1.2-.8 2.3-1.9 2.8l-.9.4A2 2 0 0 0 12 18a4 4 0 0 1-4 4c-3.3 0-6-2.7-6-6a4 4 0 0 1 4-4" />
      <path d="m6 16 2 2" />
    </svg>
  );
}
