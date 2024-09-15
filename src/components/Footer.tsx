'use client';
import { Container, VStack, Stack, Img, Link, Flex } from '@chakra-ui/react';
import { Subheader } from './Subheader';
import NextLink from 'next/link';

export const Footer = () => {
  return (
    <Container
      maxW="container.xl"
      borderTopRightRadius="lg"
      borderTopLeftRadius="lg"
      p={{ base: '6', sm: '12' }}
      minH="220px"
    >
      <Stack
        spacing={{ base: '12', md: '16', lg: '24' }}
        direction={{ base: 'column', md: 'row' }}
      >
        <Img src="/static/images/brand/logo.svg" w="24" />
        <VStack align="flex-start">
          <Subheader>Social Networks</Subheader>
          <VStack align="flex-start" color="gray.600">
            <Link as={NextLink} href="https://www.instagram.com/ubctenniscircle/?hl=en">
              Instagram
            </Link>
            <Link as={NextLink} href="https://www.facebook.com/groups/UBCTennisCircle">
              Facebook
            </Link>
            <Link as={NextLink} href="https://discord.com/invite/WHt4q3bnHF">
              Discord
            </Link>
          </VStack>
        </VStack>

        <VStack align="flex-start">
          <Subheader>Tennis Circle</Subheader>
          <VStack align="flex-start" color="gray.600">
            <Link as={NextLink} href="/">
              Homepage
            </Link>
            <Link as={NextLink} href="/about">
              About us
            </Link>
            <Link as={NextLink} href="https://www.showpass.com/o/ams-tennis-circle-ubc/">
              Events
            </Link>
            <Link as={NextLink} href="/gallery">
              Gallery
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
