import type { Metadata } from "next";

import { Chakra } from "@providers";
import { ReactQueryProvider } from "@providers";

export const metadata: Metadata = {
  title: "UBC Tennis Circle",
  description: "A UBC organization",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <Chakra>
          <ReactQueryProvider>
          {children}
          </ReactQueryProvider>
        </Chakra>
      </body>
    </html>
  );
};

export default RootLayout;
