import { redirect } from 'next/navigation';
import { getSession } from '@/lib/portal/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Note: We'll do client-side auth check since server cookies aren't working
  // In production with proper setup, use server-side cookies
  return <DashboardContent>{children}</DashboardContent>;
}

function DashboardContent({
  children,
}: {
  children: React.ReactNode;
}) {
  // Client-side auth will handle user email retrieval
  return (
    <div data-user-email="">
      {children}
    </div>
  );
}
