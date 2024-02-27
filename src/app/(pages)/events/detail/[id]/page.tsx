'use client';
import {
  Box,
  Container,
  Button,
  Text,
  Image,
  Flex,
  Skeleton,
  SkeletonText,
  HStack,
  Heading,
  AvatarGroup,
  Avatar,
} from '@chakra-ui/react';
import axios from 'axios';
import {TennisEvent} from '@types';
import {useQuery} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {format, parseISO} from 'date-fns';
import {
  LocationPinIcon,
  ClockIcon,
  SingleUserIcon,
  UserFriendsIcon,
} from '@icons';

const EventDetail = ({params}: {params: {id: string}}) => {
  const router = useRouter();

  const getEvent = async () => {
    const event = await axios.post(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/api/events/detail`,
      {
        id: params.id,
      }
    );

    return event.data;
  };

  const {isPending, error, data} = useQuery<TennisEvent>({
    queryKey: [`event-${params.id}`],
    queryFn: getEvent,
    retry: 0,
  });

  if (error) {
    router.push('/not-found');
  }

  return (
    <Container maxW="container.xl" py={{base: '12'}}>
      <Container maxW="container.lg">
        {isPending && (
          <Flex flexDirection="column" gap="4">
            <Skeleton borderRadius="8" w="100%" h="96" mb="2" />
            <HStack gap="8" alignItems="flex-start">
              <SkeletonText skeletonHeight="4" w="70%" noOfLines={4} />
              <Skeleton borderRadius="8" h="32" w="30%" />
            </HStack>
          </Flex>
        )}

        {data && (
          <Flex flexDirection="column" gap="4">
            <Flex
              position="relative"
              justifyContent="center"
              alignItems="center"
            >
              <Image
                src={data.cover_image}
                alt="Cover image"
                w="100%"
                h="96"
                objectFit="cover"
                borderRadius="8"
              />
              <Flex
                zIndex={2}
                h="96"
                position="absolute"
                bg="black"
                w="100%"
                justifyContent="center"
                alignItems="center"
                bottom="0"
                py="2"
                bgColor="rgb(0, 0, 0, 0.5)"
                borderRadius="8"
              />
            </Flex>
            <Flex gap="16" mt="8">
              <Flex flexDir="column" gap="2">
                <Text mb="-2">
                  {format(parseISO(data.date), 'EEEE, MMM d yyyy')}
                </Text>
                <Heading as="h1" size="xl">
                  {data.name}
                </Heading>
                <Text>{data.description}</Text>
                <Box h="0.4" bg="gray.300" my="4" />
                <Flex>
                  <Flex alignItems="center" gap="2" color="gray.500">
                    <ClockIcon />
                    <Text>
                      <b>Time: </b>
                      {format(
                        parseISO(data.date),
                        'EEEE, MMM d yyyy, h:mm aaa'
                      )}
                    </Text>
                  </Flex>
                </Flex>

                <Flex>
                  <Flex alignItems="center" gap="2" color="gray.500">
                    <LocationPinIcon />
                    <Text>
                      <b>Location: </b>
                      {data.location}
                    </Text>
                  </Flex>
                </Flex>

                <Flex>
                  <Flex alignItems="center" gap="2" color="gray.500">
                    <SingleUserIcon />
                    <Text>
                      <b>Hosted by: </b>
                      UBC Tennis Circle
                    </Text>
                  </Flex>
                </Flex>

                <Flex>
                  <Flex alignItems="center" gap="2" color="gray.500">
                    <UserFriendsIcon />
                    <Text>
                      <b>Attendees: </b>
                    </Text>
                    <AvatarGroup size="sm" max={3}>
                      <Avatar
                        name="Segun Adebayo"
                        src="https://bit.ly/sage-adebayo"
                      />
                      <Avatar
                        name="Kent Dodds"
                        src="https://bit.ly/kent-c-dodds"
                      />
                      <Avatar
                        name="Prosper Otemuyiwa"
                        src="https://bit.ly/prosper-baba"
                      />
                      <Avatar
                        name="Christian Nwamba"
                        src="https://bit.ly/code-beast"
                      />
                    </AvatarGroup>
                    <Button
                      size="sm"
                      colorScheme="brand"
                      variant="ghost"
                      _hover={{
                        bg: 'gray.100',
                      }}
                    >
                      View attendee list
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
              <Flex
                borderRadius="8"
                p="4"
                border="1px"
                borderColor="brand.500"
                w="xl"
                flexDir="column"
                gap="4"
                h="100%"
              >
                <Heading as="h4" fontSize="xl" textAlign="center">
                  Admission ${data.ticket_price}
                </Heading>
                <Button w="100%" colorScheme="brand">
                  Buy Ticket
                </Button>
              </Flex>
            </Flex>
          </Flex>
        )}
      </Container>
    </Container>
  );
};

export default EventDetail;
