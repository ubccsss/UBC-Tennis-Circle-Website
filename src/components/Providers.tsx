'use client';
import {ChakraUIProvider, FontImport, ReactQueryProvider} from '@providers';

// Combines all providers into one wrapper component
export const Providers = ({children}: {children: React.ReactNode}) => {
  return (
    <ChakraUIProvider>
      <FontImport />
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </ChakraUIProvider>
  );
};
