import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Tests() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/book-test');
  }, [router]);

  return null;
}
