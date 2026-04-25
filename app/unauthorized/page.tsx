"use client";

import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
      <p className="text-zinc-500 mt-2">
        You are not authorized to view this page
      </p>

      <button
        onClick={() => router.push("/")}
        className="mt-6 px-5 py-2.5 bg-zinc-900 text-white rounded-lg text-sm"
      >
        Go Home
      </button>
    </div>
  );
}