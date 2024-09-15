"use client";
import React from "react";
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
} from "@chakra-ui/react";
import { TennisBallIcon, UserFriendsIcon, CommentsIcon } from "@icons";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { FiArrowRight } from "react-icons/fi";
import { TeamMember } from "@types";
import { Skeleton } from "@chakra-ui/react";
import { Error } from "@components";
import NextLink from "next/link"

// get featured team members
const getFeatured = async () => {
  const featured = await axios.get(
    `${process.env.NEXT_PUBLIC_HOSTNAME}/api/team/get-featured`,
  );
  return featured.data;
};

const Home = () => {
  const { isPending, error, data } = useQuery<Array<TeamMember>>({
    queryKey: ["featured-team"],
    queryFn: getFeatured,
  });

  const stats = [
    {
      icon: CommentsIcon,
      title: "A growing community",
      body: "Connect, play, and grow with fellow tennis lovers.",
    },
    {
      icon: UserFriendsIcon,
      title: "100+ Members",
      body: "Join a thriving community of tennis enthusiasts at every skill level.",
    },
    {
      icon: TennisBallIcon,
      title: "Weekly sessions",
      body: "Sharpen your skills with regular, fun-filled practices.",
    },
  ];

  return (
    <>
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="24" mt="12">
          <Image
            src="static/images/stock/hero.png"
            alt="tennis player"
            borderRadius="md"
            display={{ base: "none", lg: "block" }}
          />
          <Flex
            flexDirection="column"
            gap="4"
            justifyContent="center"
            position="relative"
          >
            <Heading as="h1">Welcome to the UBC Tennis Circle!</Heading>
            <Text maxW="lg">
              Whether you&apos;re a seasoned player or just picking up a racket for the first time, our club offers a dynamic and inclusive community for tennis enthusiasts of all skill levels.
            </Text>
            <Box mt="2">
              <Button colorScheme="brand" rightIcon={<FiArrowRight />} as={NextLink} href="https://www.showpass.com/o/ams-tennis-circle-ubc/">
                Join the Circle
              </Button>
            </Box>
            <Image
              zIndex="-1"
              position="absolute"
              bottom={{ base: "-10", lg: "24" }}
              right={{ base: "0", lg: "24" }}
              src="static/images/illustrations/tennis-ball-yellow-sm.svg"
              w="16"
              alt="Tennis ball"
            />
          </Flex>
        </SimpleGrid>
      </Container>
      <Box w="100%" py="12" bg="brand.500" my="24">
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} gap="14">
            {stats.map((i, idx) => (
              <Flex
                key={idx}
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
                <Text color="white" maxW="64">
                  {i.body}
                </Text>
              </Flex>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
      <Container maxW="container.xl" my="12">
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 12, md: 14, lg: 24 }}
        >
          <Flex flexDirection="column" gap="4" justifyContent="center">
            <Heading as="h1">
              Find events and connect with other tennis players!
            </Heading>
            <Text mb="4">
              Whether you’re competing in friendly matches, joining social round-robins, or participating in club tournaments, UBC Tennis Circle offers something for everyone. Our events bring players together, helping you meet new people, form teams, and grow your tennis network. No matter your skill level, you&apos;ll find a welcoming and active community ready to rally with you both on and off the court!
            </Text>
            <Box>
              <Button colorScheme="brand" rightIcon={<FiArrowRight />} as={NextLink} href="https://www.showpass.com/o/ams-tennis-circle-ubc/">
                Browse Events
              </Button>
            </Box>
          </Flex>
          <Flex alignItems="center">
            <Image
              src="static/images/stock/find-events-connect.png"
              alt="find events & connect"
              borderRadius="md"
              height="100%"
              objectFit="cover"
            />
          </Flex>
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
          <Text maxW="lg" textAlign="center" >
            Get to know the passionate leaders who drive the UBC Tennis Circle forward!
          </Text>
          <Flex mt="8" flexDirection={{ base: "column", md: "row" }} w="100%">
            <Box>
              <Image
                src="static/images/illustrations/tennis-racket.svg"
                alt="tennis racket"
                position="absolute"
                left="-20"
                bottom="44"
                display={{ base: "none", md: "block" }}
              />
            </Box>

            {error && <Error />}

            {isPending && (
              <SimpleGrid
                w="100%"
                spacing="4"
                columns={{ base: 1, sm: 2, md: 4 }}
              >
                {Array(4)
                  .fill(0, 0, 4)
                  .map((_, idx) => (
                    <Skeleton h="96" w="100%" key={idx} />
                  ))}
              </SimpleGrid>
            )}
            {data && Array.isArray(data) && (
              <SimpleGrid spacing="4" columns={{ base: 1, sm: 2, md: 4 }}>
                {data.map((i, idx) => (
                  <Box position="relative" key={idx}>
                    <Image
                      src={i.headshot}
                      alt={i.name}
                      objectFit="cover"
                      w="3xl"
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
              </SimpleGrid>
            )}
          </Flex>
          <Button mt="8" colorScheme="brand" rightIcon={<FiArrowRight />} as={NextLink} href="/about">
            View full team
          </Button>
        </Flex>
      </Container>
    </>
  );
};

export default Home;
