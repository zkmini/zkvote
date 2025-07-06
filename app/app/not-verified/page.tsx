'use client';

import Link from 'next/link';

export default function NotVerified() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-4">
      <h1 className="text-4xl sm:text-5xl font-bold text-red-600 mb-8">
        USER NOT VERIFIED
      </h1>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold transition-colors"
      >
        VERIFY
      </Link>
    </div>
  );
}
