import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xecuit Counterparty Portal",
  description: "Secure access portal for Xecuit Holdings counterparties",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
