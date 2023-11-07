import type { Metadata } from "next";
import { Chakra } from "@providers/chakra";

export const metadata: Metadata = {
  title: "UBC Tennis Circle",
  description: "A UBC organization",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <Chakra>
          {children}
        </Chakra>
      </body>
    </html>
  );
};

export default RootLayout;
