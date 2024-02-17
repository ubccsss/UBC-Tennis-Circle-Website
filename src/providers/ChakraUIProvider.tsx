'use client';
import {CacheProvider} from '@chakra-ui/next-js';
import {ChakraProvider, extendTheme} from '@chakra-ui/react';

// Custom theme
const theme = extendTheme({
  components: {
    Heading: {
      baseStyle: {
        fontWeight: 600,
        color: '#3F3D3B',
      },
    },
    Text: {
      baseStyle: {
        color: 'gray.500',
      },
    },
  },
  colors: {
    navy: {
      50: '#8392b0',
      100: '#6c7ea1',
      200: '#556a91',
      300: '#405682',
      400: '#2b4272',
      500: '#172f63',
      600: '#122755',
      700: '#0e2047',
      800: '#0a193a',
      900: '#06122e',
    },
    brand: {
      50: '#9accbc',
      100: '#85c2b0',
      200: '#70b8a3',
      300: '#59ad96',
      400: '#3ea38a',
      500: '#15997e',
      600: '#11846d',
      700: '#0c705c',
      800: '#085d4c',
      900: '#054a3c',
    },
    accent: {
      50: '#ffdea7',
      100: '#ffd795',
      200: '#ffd081',
      300: '#ffc96b',
      400: '#ffc153',
      500: '#ffba33',
      600: '#dea12b',
      700: '#be8923',
      800: '#9e721c',
      900: '#805c14',
    },
  },
  fonts: {
    heading: 'Work Sans',
    body: 'Work Sans',
  },
});

export const ChakraUIProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <CacheProvider>
      <ChakraProvider
        theme={theme}
        toastOptions={{
          defaultOptions: {
            position: 'bottom-right',
            duration: 5000,
            isClosable: true,
          },
        }}
      >
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
};
