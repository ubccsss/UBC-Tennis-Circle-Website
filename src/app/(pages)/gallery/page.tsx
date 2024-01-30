'use client';

import {useEffect, useState, useRef} from 'react';
import {
  Container,
  Text,
  Box,
  Center,
  VStack,
  SimpleGrid,
  Image,
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
  const [after, setAfter] = useState(null);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);

  const fetchPosts = async (afterParam = null) => {
    if (loading) return;
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
      console.log(res);
      setPosts(prevPosts => [...prevPosts, ...res.data.data]);
      setAfter(res.data.paging?.cursors?.after);
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(entries => {
      const [entry] = entries;
      if (entry.isIntersecting && after) {
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
  }, [after, loading]);

  return (
    <Container maxW="container.xl">
      <Box>
        <Center>
          <VStack>
            <Text fontSize="2xl">View our recent posts</Text>
            <Text fontSize="sm">Come join us for a fun round of tennis!</Text>
          </VStack>
        </Center>
      </Box>
      <Container maxW="container.lg" py="28">
        <SimpleGrid columns={3} spacing={6}>
          {posts.map((post, index) =>
            posts.length === index + 1 ? (
              <Box
                key={`post-${index}`}
                ref={loader}
                w="300px"
                h="300px"
                rounded="lg"
                overflow="hidden"
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
            ) : (
              <Box
                key={`post-${index}`}
                w="300px"
                h="300px"
                rounded="lg"
                overflow="hidden"
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
            )
          )}
        </SimpleGrid>
      </Container>
      {loading && <Center>Loading more posts...</Center>}
    </Container>
  );
};

export default Gallery;
