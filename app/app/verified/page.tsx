'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function VerifiedLanding() {
  const router = useRouter();

  // Redirect away if user wasn't verified via QR flow
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isVerified = localStorage.getItem('zkvote_verified') === 'true';
      if (!isVerified) {
        router.push('/not-verified');
      }
    }
  }, [router]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 text-gray-900">
      {/* Ballot emoji to the right of zkVote title */}
      <div className="flex flex-row items-center mb-16">
        <span className="text-4xl sm:text-5xl font-extrabold text-blue-800 drop-shadow-lg">zkVote</span>
        <span className="text-[2.5rem] sm:text-[3.5rem] ml-4" role="img" aria-label="Ballot">🗳️</span>
      </div>
      <div className="flex flex-col sm:flex-row gap-10 w-full max-w-3xl justify-center items-center">
        {/* Create Poll Tile */}
        <Link
          href="/create-poll"
          className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-green-400 to-green-600 shadow-xl rounded-2xl px-12 py-10 sm:px-16 sm:py-16 h-64 w-full sm:w-96 max-w-full transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl focus:outline-none"
        >
          <span className="text-3xl sm:text-4xl font-bold text-white mb-3">Create Poll</span>
          <span className="text-lg sm:text-xl text-green-100 font-medium text-center">Start a new poll and invite others to vote securely.</span>
        </Link>
        {/* Join Poll Tile */}
        <Link
          href="/join-poll"
          className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-red-400 to-red-600 shadow-xl rounded-2xl px-12 py-10 sm:px-16 sm:py-16 h-64 w-full sm:w-96 max-w-full transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl focus:outline-none"
        >
          <span className="text-3xl sm:text-4xl font-bold text-white mb-3">Join Poll</span>
          <span className="text-lg sm:text-xl text-red-100 font-medium text-center">Enter an access code to participate in an existing poll.</span>
        </Link>
      </div>
    </div>
  );
}
