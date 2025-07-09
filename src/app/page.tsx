"use client";

import LandingPage from './landing/page';

export default function Home() {
  // You can uncomment this to redirect directly to dashboard
  // const router = useRouter();
  // useEffect(() => {
  //   router.push('/dashboard');
  // }, [router]);

  // For now, show the landing page
  return <LandingPage />;
}
