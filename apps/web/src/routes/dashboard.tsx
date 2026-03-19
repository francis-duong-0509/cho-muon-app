import { authClient } from '@/lib/auth-client';
import { Skeleton } from '@chomuon/ui/components/skeleton';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react';

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      navigate({to: "/login"});
    }
  }, [isPending, session, navigate]);

  if (isPending) {
    return (
      <div className='flex h-svh items-center justify-center'>
        <Skeleton className='h-8 w-32' />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <Outlet />
      </div>
    </div>
  );
}
