'use client';
import {CacheProvider} from '@chakra-ui/next-js';
import {ChakraProvider, extendTheme, defineStyleConfig} from '@chakra-ui/react';

// Components
const Button = defineStyleConfig({
  defaultProps: {
    colorScheme: 'green',
    size: 'md',
  },
});

// Custom theme
const theme = extendTheme({
  colors: {
    black: {
      50: '#999897',
      100: '#868583',
      200: '#747270',
      300: '#61605e',
      400: '#504e4c',
      500: '#3f3d3b',
      600: '#353432',
      700: '#2c2b29',
      800: '#232221',
      900: '#1b1a19',
    },
    white: {
      50: '#fefefe',
      100: '#fafbfb',
      200: '#f8f9f8',
      300: '#f7f8f7',
      400: '#f5f7f6',
      500: '#f3f5f4',
      600: '#d3d5d4',
      700: '#b4b6b5',
      800: '#979897',
      900: '#7a7b7a',
    },
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
    green: {
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
    yellow: {
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
  components: {
    Button,
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
