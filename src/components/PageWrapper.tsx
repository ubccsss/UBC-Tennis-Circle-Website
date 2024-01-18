'use client';
import {Box} from '@chakra-ui/react';

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper = ({children}: PageWrapperProps) => {
  // 272px is min height of footer
  return (
    <Box pt="28" minH="100vh">
      {children}
    </Box>
  );
};
