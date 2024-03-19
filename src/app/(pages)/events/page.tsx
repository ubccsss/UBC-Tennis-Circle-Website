"use client";
import {
  Container,
  Img,
  Text,
  Heading,
  Center,
  Skeleton,
  Flex,
  Image,
  Card,
  Stack,
  CardBody,
  HStack,
  Icon,
  Button,
  Avatar,
  AvatarGroup,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TennisEvent } from "@types";
import { format, parseISO } from "date-fns";
import { Error } from "@components";
import {
  LocationPinIcon,
  ClockIcon,
  SingleUserIcon,
  UserFriendsIcon,
} from "@icons";
import Link from "next/link";

// get all events
const getEvents = async () => {
  const events = await axios.get(
    `${process.env.NEXT_PUBLIC_HOSTNAME}/api/events/get-all`,
  );
  return events.data;
};

const Events = () => {
  const { isPending, error, data } = useQuery<Array<TennisEvent>>({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  return (
    <Container maxW="container.xl" py={{ base: "12", sm: "20" }}>
      <Flex flexDir="column">
        <Heading
          as="h1"
          fontWeight="500"
          lineHeight="43.2px"
          color="#3F3D3B"
          textAlign="center"
        >
          Browse Tennis Events
        </Heading>
        <Center>
          <Text textAlign="center">
            Come join us for a fun round of tennis!
          </Text>
        </Center>
      </Flex>
      {data && data.length === 0 && <NoEvents />}
      {isPending && (
        <Container maxW="container.md" mt="12">
          <Flex flexDir="column" gap="8">
            {Array(3)
              .fill(0)
              .map((_, idx) => (
                <Skeleton h="60" w="100%" borderRadius="8" key={idx} />
              ))}
          </Flex>
        </Container>
      )}

      {error && <Error mt="12" />}

      {data && data.length !== 0 && (
        <Container maxW="container.md" mt="12">
          {data.map((i, idx) => (
            <Card
              key={idx}
              direction={{ base: "column", md: "row" }}
              overflow="hidden"
              variant="outline"
              borderRadius="8"
              p="4"
              position="relative"
            >
              <Image
                objectFit="cover"
                maxW={{ base: "100%", md: "52" }}
                src={i.cover_image}
                alt="Caffe Latte"
                mr={{ base: "0", md: "4" }}
                borderRadius="4"
              />

              <Stack>
                <CardBody>
                  <Heading size="md" mb="2" fontSize="24">
                    {i.name}
                  </Heading>

                  <Flex flexDirection="column" mt="2" gap="2">
                    <Flex
                      alignItems={{ base: "flex-start", sm: "center" }}
                      flexDir={{ base: "column", sm: "row" }}
                    >
                      <Flex alignItems="center" gap="1">
                        <Icon as={ClockIcon} color="gray.500" fontSize="14" />
                        <Text fontWeight="semibold">Date:</Text>
                        <Text display={{ base: "none", sm: "block" }}>
                          {format(parseISO(i.date), "E, MMM d yyyy")}
                        </Text>
                      </Flex>
                      <Text display={{ base: "block", sm: "none" }}>
                        {format(parseISO(i.date), "E, MMM d yyyy")}
                      </Text>
                    </Flex>

                    <Flex
                      alignItems={{ base: "flex-start", sm: "center" }}
                      flexDir={{ base: "column", sm: "row" }}
                    >
                      <Flex alignItems="center" gap="1">
                        <Icon
                          as={LocationPinIcon}
                          color="gray.500"
                          fontSize="14"
                        />
                        <Text fontWeight="semibold">Location:</Text>
                        <Text display={{ base: "none", sm: "block" }}>
                          {i.location}
                        </Text>
                      </Flex>
                      <Text display={{ base: "block", sm: "none" }}>
                        {i.location}
                      </Text>
                    </Flex>

                    <Flex
                      alignItems={{ base: "flex-start", sm: "center" }}
                      flexDir={{ base: "column", sm: "row" }}
                    >
                      <Flex alignItems="center" gap="1">
                        <Icon
                          as={SingleUserIcon}
                          color="gray.500"
                          fontSize="14"
                        />
                        <Text fontWeight="semibold">Hosted by:</Text>
                        <Text display={{ base: "none", sm: "block" }}>
                          UBC Tennis Circle
                        </Text>
                      </Flex>
                      <Text display={{ base: "block", sm: "none" }}>
                        UBC Tennis Circle
                      </Text>
                    </Flex>

                    <Flex
                      alignItems={{ base: "flex-start", sm: "center" }}
                      flexDir={{ base: "column", sm: "row" }}
                    >
                      <Flex alignItems="center" gap="1">
                        <Icon
                          as={UserFriendsIcon}
                          color="gray.500"
                          fontSize="14"
                        />
                        <Text fontWeight="semibold">Attendees:</Text>
                        <AvatarGroup
                          size="xs"
                          max={3}
                          display={{ base: "none", sm: "flex" }}
                        >
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
                      </Flex>
                      <AvatarGroup
                        size="sm"
                        max={3}
                        display={{ base: "flex", sm: "none" }}
                      >
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
                    </Flex>
                  </Flex>
                </CardBody>
                <Button
                  as={Link}
                  href={`/events/detail/${i.id}`}
                  colorScheme="brand"
                  position={{ base: "relative", md: "absolute" }}
                  right={{ base: "unset", md: "4" }}
                  bottom={{ base: "unset", md: "4" }}
                >
                  Join Event
                </Button>
              </Stack>
            </Card>
          ))}
        </Container>
      )}
    </Container>
  );
};

const NoEvents = () => (
  <Container mt="200">
    <Center>
      <Heading
        as="h4"
        color="#15997E"
        textAlign="center"
        fontSize="24"
        maxW="96"
        fontWeight="medium"
      >
        Currently no events available, check back later!
      </Heading>
    </Center>

    <Img
      src="/static/images/illustrations/tennis-ball-yellow-events.svg"
      alt="Yellow Tennis Ball"
      borderRadius="lg"
      ml="auto"
      display={{ base: "none", md: "block" }}
    />
    <Img
      src="/static/images/illustrations/tennis-ball-green-events.svg"
      alt="Blue Tennis Ball"
      borderRadius="lg"
      mt={{ base: "12", md: "-4" }}
    />
    <Img
      src="/static/images/illustrations/tennis-ball-blue-events.svg"
      alt="Green Tennis Ball"
      ml="24"
      borderRadius="lg"
    />
  </Container>
);

export default Events;
