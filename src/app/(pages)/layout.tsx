import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UBC Tennis Circle",
  description: "A UBC organization",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
