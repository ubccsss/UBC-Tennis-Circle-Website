'use client';

import {useEffect, useState, useRef} from 'react';
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
  Spinner,
  Heading,
} from '@chakra-ui/react';
import axios from 'axios';

const Gallery = () => {
  const [posts, setPosts] = useState<
    Array<{
      id: string;
      permalink: string;
      media_url: string;
      caption: string;
    }>
  >([]);
  const [after, setAfter] = useState('unset');
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const loader = useRef(null);

  const skeletons = new Array(9)
    .fill(null)
    .map((_, index) => (
      <Skeleton key={index} rounded="lg" height="300px" width="300px" />
    ));

  const fetchPosts = async (afterParam: string) => {
    if (loading) return;
    if (after === undefined) return;
    setLoading(true);
    try {
      const res = await axios.post(
        '/api/instagram/posts',
        {after: afterParam},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!allLoaded) {
        setPosts(prevPosts => [...prevPosts, ...res.data.data]);
        setAfter(res.data.paging?.cursors?.after);
      }
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(after);
  }, []);

  useEffect(() => {
    if (after === undefined) {
      setAllLoaded(true);
    }

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(entries => {
      const [entry] = entries;
      if (entry.isIntersecting && !allLoaded && !loading) {
        fetchPosts(after);
      }
    }, options);

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [after, allLoaded, loading]);

  return (
    <Container maxW="container.xl">
      <Box>
        <Center>
          <VStack>
            <Heading as="h1">View our recent posts</Heading>
            <Text maxW="xl" textAlign="center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi a
              leo tempus, euismod purus vitae, blandit lectus.
            </Text>
          </VStack>
        </Center>
      </Box>
      <Flex w="100%" justifyContent="center" my="12">
        <SimpleGrid columns={3} gap="6" ref={loader}>
          {posts.length === 0
            ? skeletons
            : posts.map((post, index) => (
                <Box
                  key={`post-${index}`}
                  w="72"
                  h="72"
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
      {loading && (
        <Center>
          <Spinner color=":rand.500" />
        </Center>
      )}
    </Container>
  );
};

export default Gallery;
