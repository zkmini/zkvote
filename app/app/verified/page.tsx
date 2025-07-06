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
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-12 text-blue-800">
        Identity Verified
      </h1>
      <div className="flex flex-col sm:flex-row gap-6">
        <Link
          href="/create-poll"
          className="px-8 py-4 rounded-lg text-white font-semibold bg-green-500 hover:bg-green-600 transition-colors text-xl text-center"
        >
          Create Poll
        </Link>
        <Link
          href="/join-poll"
          className="px-8 py-4 rounded-lg text-white font-semibold bg-red-500 hover:bg-red-600 transition-colors text-xl text-center"
        >
          Join Poll
        </Link>
      </div>
    </div>
  );
}
