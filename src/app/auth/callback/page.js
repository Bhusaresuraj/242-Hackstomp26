'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isActive = true;

    const redirectAuthenticatedUser = async () => {
      const nextPath = searchParams.get('next') || '/Doctors';

      const { data, error } = await supabase.auth.getUser();

      if (!isActive) {
        return;
      }

      if (error || !data?.user) {
        setErrorMessage(error?.message || 'Unable to fetch authenticated user.');
        router.push('/login');
        return;
      }

      const fullName = data.user.user_metadata?.full_name || '';
      const email = data.user.email || '';
      const separator = nextPath.includes('?') ? '&' : '?';
      const targetUrl =
        `${nextPath}${separator}name=${encodeURIComponent(fullName)}` +
        `&email=${encodeURIComponent(email)}`;

      router.push(targetUrl);
    };

    redirectAuthenticatedUser();

    return () => {
      isActive = false;
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-50 px-4 text-teal-900">
      <div className="rounded-xl bg-white px-6 py-4 shadow-md">
        {errorMessage || 'Completing sign-in...'}
      </div>
    </div>
  );
}
