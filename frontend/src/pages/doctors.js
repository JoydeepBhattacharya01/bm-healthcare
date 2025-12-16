import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Doctors() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/book-doctor');
  }, [router]);

  return null;
}
