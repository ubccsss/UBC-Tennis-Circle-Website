'use client';
import {
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
} from '@chakra-ui/react';
import axios from 'axios';
import {FiAlertCircle} from 'react-icons/fi';
import {useQuery} from '@tanstack/react-query';

const getPosts = async () => {
  const posts = await axios.get(
    `${process.env.NEXT_PUBLIC_HOSTNAME}/api/instagram/posts`
  );
  return posts.data;
};

const Gallery = () => {
  const {isPending, error, data} = useQuery<
    Array<{media_url: string; permalink: string; caption: string}>
  >({
    queryKey: ['instagram-posts'],
    queryFn: getPosts,
  });

  return (
    <Container maxW="container.xl">
      <Box>
        <Center>
          <VStack>
            <Heading as="h1" textAlign="center">
              View our recent posts
            </Heading>
            <Text maxW="xl" textAlign="center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi a
              leo tempus, euismod purus vitae, blandit lectus.
            </Text>
          </VStack>
        </Center>
      </Box>
      <Flex w="100%" justifyContent="center" my="12">
        <SimpleGrid columns={{base: 1, sm: 2, lg: 3}} gap="6">
          {error && (
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              gap="2"
            >
              <Icon as={FiAlertCircle} color="red.400" fontSize="28" />
              <Text maxW="64">An unexpected error has occurred</Text>
            </Flex>
          )}
          {isPending &&
            new Array(9)
              .fill(null)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  borderRadius="8"
                  w={{base: '100%', md: '72'}}
                  h={{base: '100%', md: '72'}}
                />
              ))}

          {data &&
            data.map((post, index) => (
              <Box
                key={`post-${index}`}
                w={{base: '100%', md: '72'}}
                h={{base: '100%', md: '72'}}
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
      </Flex>
    </Container>
  );
};

export default Gallery;
