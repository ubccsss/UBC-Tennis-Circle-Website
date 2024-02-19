'use client';
import {
  Skeleton,
  Container,
  Flex,
  Heading,
  Text,
  Box,
  Image,
  SimpleGrid,
} from '@chakra-ui/react';
import axios from 'axios';
import {Error} from '@components';
import {useQuery} from '@tanstack/react-query';
import {TeamMember} from '@types';

// get all team members
const getFeatured = async () => {
  const featured = await axios.get(
    `${process.env.NEXT_PUBLIC_HOSTNAME}/api/team/get-all`
  );
  return featured.data;
};

const About = () => {
  const {isPending, error, data} = useQuery<Array<TeamMember>>({
    queryKey: ['team'],
    queryFn: getFeatured,
  });

  return (
    <Container maxW="container.xl">
      <Flex flexDirection="column" gap="16" mt="12" mb="24">
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDir="column"
          gap="4"
        >
          <Heading as="h1" textAlign="center">
            Welcome to the Circle
          </Heading>
          <Text textAlign="center" maxW="xl">
            Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint
            cillum sint consectetur cupidatat.
          </Text>
        </Flex>

        <SimpleGrid
          columns={{base: 1, md: 2}}
          spacing={{base: 12, md: 14, lg: 24}}
        >
          <Image
            src="static/images/stock/who-we-are.png"
            alt="team photo"
            borderRadius="md"
            display={{base: 'none', md: 'block'}}
            height="100%"
            objectFit="cover"
          />
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
          </Flex>
          <Image
            src="static/images/stock/who-we-are.png"
            alt="team photo"
            borderRadius="md"
            display={{base: 'block', md: 'none'}}
            height="100%"
            objectFit="cover"
          />
        </SimpleGrid>

        <SimpleGrid
          columns={{base: 1, md: 2}}
          spacing={{base: 12, md: 14, lg: 24}}
        >
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
          </Flex>
          <Image
            src="static/images/stock/our-mission.png"
            alt="our mission"
            borderRadius="md"
            height="100%"
            objectFit="cover"
          />
        </SimpleGrid>
      </Flex>
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
        <Flex mt="8" flexDirection={{base: 'column', md: 'row'}} w="100%">
          <Box>
            <Image
              src="static/images/illustrations/tennis-racket.svg"
              alt="tennis racket"
              position="absolute"
              left="-20"
              bottom="44"
              display={{base: 'none', md: 'block'}}
            />
          </Box>

          {error && <Error />}

          {isPending && (
            <SimpleGrid w="100%" spacing="4" columns={{base: 1, sm: 2, md: 4}}>
              {Array(4)
                .fill(0, 0, 4)
                .map(() => (
                  <Skeleton h="96" w="100%" />
                ))}
            </SimpleGrid>
          )}
          {data && (
            <SimpleGrid spacing="4" columns={{base: 1, sm: 2, md: 4}}>
              {data.map(i => (
                <Box position="relative">
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
      </Flex>
    </Container>
  );
};

export default About;
