'use client';
import React from 'react';
import {
  Container,
  Flex,
  Box,
  Image,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import {TennisBallIcon, UserFriendsIcon, CommentsIcon} from '@icons';
import axios from 'axios';
import {useQuery} from '@tanstack/react-query';
import {FiArrowRight} from 'react-icons/fi';
import {TeamMember} from '@types';
import {Skeleton} from '@chakra-ui/react';

// get featured team members
const getFeatured = async () => {
  const featured = await axios.get(
    `${process.env.NEXT_PUBLIC_HOSTNAME}/api/team/get-featured`
  );
  return featured.data;
};

const Home = () => {
  const {isPending, error, data} = useQuery<Array<TeamMember>>({
    queryKey: ['featured-team'],
    queryFn: getFeatured,
  });

  console.log(data);
  const stats = [
    {
      icon: UserFriendsIcon,
      title: '100+ Members',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      icon: CommentsIcon,
      title: 'A growing community',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      icon: TennisBallIcon,
      title: '15+ courts',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  ];

  return (
    <>
      <Container maxW="container.xl">
        <SimpleGrid columns={2} spacing="24" mt="12">
          <Image
            src="static/images/stock/hero.png"
            alt="tennis player"
            borderRadius="md"
          />
          <Flex
            flexDirection="column"
            gap="4"
            justifyContent="center"
            position="relative"
          >
            <Heading as="h1">Welcome to the UBC Tennis Circle!</Heading>
            <Text maxW="lg">
              Lorem ipsum dolor sit amet, officia excepteur ex fugiat
              reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit
              ex esse exercitation amet.
            </Text>
            <Box mt="2">
              <Button colorScheme="brand" rightIcon={<FiArrowRight />}>
                Join the Circle
              </Button>
            </Box>
            <Image
              position="absolute"
              bottom="24"
              right="24"
              src="static/images/illustrations/tennis-ball-yellow-lg.svg"
              w="16"
              alt="Tennis ball"
            />
          </Flex>
        </SimpleGrid>
      </Container>
      <Box w="100%" py="12" bg="brand.500" my="24">
        <Container maxW="container.xl">
          <SimpleGrid columns={3} spacing="12">
            {stats.map(i => (
              <Flex
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                textAlign="center"
                gap="2"
              >
                <Icon as={i.icon} color="white" fontSize="36" />
                <Heading as="h6" fontSize="24" color="white">
                  {i.title}
                </Heading>
                <Text color="white">{i.body}</Text>
              </Flex>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
      <Container maxW="container.xl" my="12">
        <SimpleGrid columns={2} spacing={24}>
          <Flex flexDirection="column" gap="4" justifyContent="center">
            <Heading as="h1">
              Find events and connect with other tennis players!
            </Heading>
            <Text>
              Lorem ipsum dolor sit amet, officia excepteur ex fugiat
              reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit
              ex esse exercitation amet. Nisi anim cupidatat excepteur officia.
              Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet
              voluptate voluptate dolor minim nulla est proident.
            </Text>
            <Box>
              <Button colorScheme="brand" rightIcon={<FiArrowRight />}>
                Browse Events
              </Button>
            </Box>
          </Flex>
          <Image
            src="static/images/stock/find-events-connect.png"
            alt="find events & connect"
            borderRadius="md"
          />
        </SimpleGrid>

        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          my="24"
          gap="2"
        >
          <Heading as="h3" textAlign="center">
            Meet the Team
          </Heading>
          <Text maxW="xl" textAlign="center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi a leo
            tempus, euismod purus vitae, blandit lectus.
          </Text>
          <Flex mt="8" gap="4" position="relative">
            {isPending &&
              Array(3)
                .fill(0, 0, 3)
                .map(() => <Skeleton w="80" h="96" borderRadius="md" />)}

            {data &&
              data.map(i => (
                <Box position="relative">
                  <Image
                    src={i.headshot}
                    alt={i.name}
                    objectFit="cover"
                    w="80"
                    h="96"
                    borderRadius="md"
                    filter="brightness(60%)"
                  />
                  <Box position="absolute" bottom="0" m="4">
                    <Text color="white" fontSize="xl" fontWeight="semibold">
                      {i.name}
                    </Text>
                    <Text color="white" fontSize="md" fontWeight={400}>
                      {i.role}
                    </Text>
                  </Box>
                </Box>
              ))}
          </Flex>
          <Button mt="8" colorScheme="brand" rightIcon={<FiArrowRight />}>
            View full team
          </Button>
        </Flex>
      </Container>
    </>
  );
};

export default Home;
