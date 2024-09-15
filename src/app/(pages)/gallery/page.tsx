"use client";
import {
  Link,
  Skeleton,
  Container,
  Text,
  Box,
  Center,
  VStack,
  SimpleGrid,
  Image,
  Flex,
  Heading,
  Icon,
} from "@chakra-ui/react";
import axios from "axios";
import { FiAlertCircle, FiInstagram } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";

const getPosts = async () => {
  const posts = await axios.get(
    `${process.env.NEXT_PUBLIC_HOSTNAME}/api/instagram/posts`,
  );
  return posts.data;
};

const Gallery = () => {
  const { isPending, error, data } = useQuery<
    Array<{ media_url: string; permalink: string; caption: string }>
  >({
    queryKey: ["instagram-posts"],
    queryFn: getPosts,
  });

  return (
    <Container maxW="container.xl">
      <Box mt="8">
        <Center>
          <VStack>
            <Heading as="h1" textAlign="center">
              View our recent posts
            </Heading>
            <Text maxW="lg" textAlign="center">
              Check out our latest updates and stay connected with the UBC Tennis Circle!
            </Text>
          </VStack>
        </Center>
      </Box>
      <Flex
        w="100%"
        justifyContent="center"
        my="12"
        alignItems="center"
        flexDir="column"
      >
        {error && (
          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            gap="2"
            w="100%"
          >
            <Icon as={FiAlertCircle} color="red.400" fontSize="28" />
            <Text maxW="64">An unexpected error has occurred</Text>
          </Flex>
        )}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap="6">
          {isPending &&
            new Array(9)
              .fill(null)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  borderRadius="8"
                  w={{ base: "100%", md: "72" }}
                  h={{ base: "100%", md: "72" }}
                />
              ))}

          {data &&
            data.map((post, index) => (
              <Box
                key={`post-${index}`}
                w={{ base: "100%", md: "72" }}
                h={{ base: "100%", md: "72" }}
                overflow="hidden"
                borderRadius="8"
              >
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={post.media_url}
                    alt={post.caption}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                  />
                </a>
              </Box>
            ))}
        </SimpleGrid>

        <Flex
          justifyContent="center"
          alignItems="center"
          pt="24"
          pb="16"
          flexDir="column"
        >
          <Icon as={FiInstagram} fontSize="28" color="brand.500" />
          <Link
            textAlign="center"
            mt="2"
            color="brand.600"
            textDecoration="underline"
            textUnderlineOffset="4px"
            href="https://www.instagram.com/ubctenniscircle"
            target="_blank"
          >
            See the rest on Instagram
          </Link>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Gallery;
