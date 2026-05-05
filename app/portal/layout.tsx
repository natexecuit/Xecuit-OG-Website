import type { Metadata } from "next";
import { PostHogProvider } from "@/app/components/PostHogProvider";
import { cookies } from "next/headers";
import { getSession } from "@/lib/portal/auth";

export const metadata: Metadata = {
  title: "Xecuit Counterparty Portal",
  description: "Secure access portal for Xecuit Holdings counterparties",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get user email from session for analytics
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('portal-session')?.value;
  const session = sessionToken ? getSession(sessionToken) : null;
  const userEmail = session?.email || '';

  return (
    <html lang="en">
      <body data-user-email={userEmail}>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
