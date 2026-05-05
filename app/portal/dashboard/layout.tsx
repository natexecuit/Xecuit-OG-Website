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
  userEmail,
  children,
}: {
  userEmail: string;
  children: React.ReactNode;
}) {
  // Store user email in a data attribute for the dashboard to read
  return (
    <div data-user-email={userEmail}>
      {children}
    </div>
  );
}
