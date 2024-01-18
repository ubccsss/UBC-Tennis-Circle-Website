'use client';
import {Container, VStack, Stack, Img, Link, Flex} from '@chakra-ui/react';
import {Subheader} from './Subheader';
import NextLink from 'next/link';

// Footer that is used for all pages
// TODO: Replace hrefs with real hrefs
export const Footer = () => {
  return (
    <Container
      maxW="container.xl"
      borderTopRightRadius="lg"
      borderTopLeftRadius="lg"
      p={{base: '6', sm: '12'}}
      minH="220px"
    >
      <Stack
        spacing={{base: '12', md: '16', lg: '24'}}
        direction={{base: 'column', md: 'row'}}
      >
        <Img src="/static/images/brand/logo.svg" w="24" />
        <VStack align="flex-start">
          <Subheader>Social Networks</Subheader>
          <VStack align="flex-start" color="gray.600">
            <Link as={NextLink} href="/">
              Twitter
            </Link>
            <Link as={NextLink} href="/">
              Youtube
            </Link>
            <Link as={NextLink} href="/">
              Instagram
            </Link>
            <Link as={NextLink} href="/">
              Facebook
            </Link>
          </VStack>
        </VStack>

        <VStack align="flex-start">
          <Subheader>Tennis Circle</Subheader>
          <VStack align="flex-start" color="gray.600">
            <Link as={NextLink} href="/">
              Homepage
            </Link>
            <Link as={NextLink} href="/">
              About us
            </Link>
            <Link as={NextLink} href="/">
              Events
            </Link>
            <Link as={NextLink} href="/">
              Gallery
            </Link>
          </VStack>
        </VStack>

        <VStack align="flex-start">
          <Subheader>Legal</Subheader>

          <VStack align="flex-start" color="gray.600">
            <Link as={NextLink} href="/">
              Terms of Use
            </Link>
            <Link as={NextLink} href="/">
              Privacy Policy
            </Link>
            <Link as={NextLink} href="/">
              Cookie Policy
            </Link>
          </VStack>
        </VStack>
      </Stack>
      <Flex justifyContent="center" mt="8" mb="-8" color="gray.400">
        &#169; 2024 UBC Tennis Circle
      </Flex>
    </Container>
  );
};
