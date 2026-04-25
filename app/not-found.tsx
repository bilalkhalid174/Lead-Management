"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        {/* Semantic status code */}
        <p className="text-base font-semibold text-zinc-900">404</p>
        
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Page not found
        </h1>
        
        <p className="mt-6 text-base leading-7 text-zinc-600">
          Sorry, we couldn’t find the page you’re looking for.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            onClick={() => router.push("/")}
            className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-zinc-900 transition-colors active:scale-95"
          >
            Go back home
          </button>
          
        </div>
      </div>
    </main>
  );
}