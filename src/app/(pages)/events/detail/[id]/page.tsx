"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  InputGroup,
  InputLeftElement,
  Link,
  Icon,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast,
  Container,
  Button,
  Text,
  Image,
  Flex,
  Skeleton,
  SkeletonText,
  Heading,
  AvatarGroup,
  Avatar,
  useDisclosure,
  IconButton,
  Divider,
  FlexProps,
  VStack,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { PublicEventUser, TennisEvent } from "@types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { format, parseISO, addHours } from "date-fns";
import { useSearchParams } from "next/navigation";
import { rangeHours } from "@utils";
import {
  LocationPinIcon,
  ClockIcon,
  SingleUserIcon,
  UserFriendsIcon,
} from "@icons";
import { SearchIcon } from "@chakra-ui/icons";
import { getClientSession } from "@utils";
import { FiInstagram } from "react-icons/fi";
import { useDebounce } from "@uidotdev/usehooks";
import Fuse from "fuse.js";

const EventDetail = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const statusToast = useToast();
  const searchParams = useSearchParams();

  const soldOut = searchParams.get("sold-out");
  const unsuccessfulPayment = searchParams.get("unsuccessful-payment");
  const successfulPayment = searchParams.get("successful-payment");
  const purchased = searchParams.get("purchased");

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (soldOut === "true") {
      statusToast({
        title: "Unfortunately, this slot just sold out.",
        status: "error",
      });
      router.push(`/events/detail/${params.id}`);
    }

    if (purchased === "true") {
      statusToast({
        id: "purchased",
        title: "You have already purchased this ticket.",
        status: "error",
      });
      router.push(`/events/detail/${params.id}`);
    }

    if (unsuccessfulPayment === "true") {
      statusToast({
        id: "unsuccessful_payment",
        title: "An error has occurred and you will be issued a refund.",
        status: "error",
      });
      router.push(`/events/detail/${params.id}`);
    }

    if (successfulPayment === "true") {
      statusToast({
        id: "successful_payment",
        title: "Successfully purchased ticket.",
        status: "success",
      });
      router.push(`/events/detail/${params.id}`);
    }
  }, [
    soldOut,
    statusToast,
    unsuccessfulPayment,
    successfulPayment,
    purchased,
    params.id,
    router,
  ]);

  const getEvent = async () => {
    const event = await axios.post(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/api/events/detail`,
      {
        id: params.id,
      },
    );

    return event.data;
  };

  const { isPending, error, data } = useQuery<TennisEvent>({
    queryKey: [`event-${params.id}`],
    queryFn: getEvent,
    retry: 0,
  });

  if (error) {
    router.push("/not-found");
  }

  console.log(data);

  interface BuyTicketBoxProps extends FlexProps {
    time: string;
    timeSlot: number;
  }

  const [purchaseLoading, setPurchaseLoading] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebounce(searchInput, 350);
  const [attendees, setAttendees] = useState([]);

  const fuse = useMemo(
    () =>
      new Fuse(data?.attendees, {
        keys: ["first_name", "last_name"],
      }),
    [data?.attendees],
  );

  useEffect(() => {
    if (data) {
      if (debouncedSearchInput === "") {
        setAttendees(data?.attendees);
      } else {
        const searchQuery = fuse.search(debouncedSearchInput);
        const flattenedQuery = searchQuery.map((i) => i.item);
        setAttendees(flattenedQuery);
      }
    }
  }, [data, debouncedSearchInput, fuse]);

  const purchaseTicket = async (timeSlot: number) => {
    const session = await getClientSession();
    try {
      setPurchaseLoading(timeSlot);

      if (!session) {
        router.push(`/login/?redirect=/events/detail/${params.id}`);
      }
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/events/ticket/purchase`,
        { event_id: params.id, time_slot: timeSlot },
      );

      if (res.data?.url) {
        router.push(res.data.url);
      } else {
        statusToast({
          id: "failure",
          title: "An unexpected error has occurred",
          status: "error",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const AttendeeRow = React.memo(
    ({ attendee }: { attendee: PublicEventUser }) => {
      return (
        <Flex
          w="100%"
          alignItems={{ base: "flex-start", md: "center" }}
          gap="2"
          justifyContent={{
            base: "flex-start",
            md: "space-between",
          }}
          flexDir={{ base: "column", md: "row" }}
        >
          <Flex
            gap="2"
            alignItems={{ base: "flex-start", md: "center" }}
            flexDir={{ base: "column", md: "row" }}
          >
            <Avatar
              src={attendee.profile}
              name={attendee.first_name}
              size="sm"
            />
            <VStack alignItems="flex-start" gap="-8">
              <Text maxW="52" wordBreak="break-all">
                {attendee.first_name} {attendee.last_name}
              </Text>
              <Text
                maxW="52"
                wordBreak="break-all"
                fontSize="12"
                mt="-0.5"
                fontWeight="medium"
              >
                {attendee.time}
              </Text>
            </VStack>
          </Flex>

          <Flex
            gap="2"
            alignItems="center"
            flexDir={{ base: "row-reverse", md: "row" }}
          >
            {attendee.instagram && (
              <IconButton
                as={Link}
                colorScheme="pink"
                icon={<Icon as={FiInstagram} fontSize="18" />}
                aria-label="Instagram"
                size="sm"
                href={`https://www.instagram.com/${attendee.instagram}`}
                target="_blank"
              />
            )}
            <Flex
              border="2px"
              borderColor="brand.500"
              px="3"
              borderRadius="md"
              fontSize="14"
              fontWeight="medium"
              alignItems="center"
              h="32px"
            >
              <Text color="brand.500">Skill {attendee.skill}</Text>
            </Flex>
          </Flex>
        </Flex>
      );
    },
  );

  AttendeeRow.displayName = "AttendeeRow";

  const BuyTicketBox = ({ time, timeSlot, ...props }: BuyTicketBoxProps) => {
    const slotObj = data.time_slots[timeSlot];

    return (
      <Flex
        borderRadius="8"
        p="4"
        border="1px"
        borderColor="brand.500"
        flexDir="column"
        gap="4"
        h="100%"
        minW={{ base: "100%", sm: "64" }}
        {...props}
      >
        <Text fontSize="lg" textAlign="center" mb="-2" fontWeight="medium">
          {time}
        </Text>
        <Button
          w="100%"
          colorScheme="brand"
          onClick={() => {
            purchaseTicket(timeSlot);
          }}
          isLoading={purchaseLoading && purchaseLoading === timeSlot}
          loadingText="Reserving Ticket"
          isDisabled={
            data.status === "closed" ||
            (purchaseLoading && purchaseLoading !== timeSlot) ||
            (!slotObj.reserved && slotObj.available_tickets <= 0) ||
            slotObj.purchased
          }
        >
          {slotObj.purchased
            ? "Purchased Ticket"
            : data.status === "closed"
              ? "Sale Closed"
              : !slotObj.reserved && slotObj.available_tickets <= 0
                ? "Sold out"
                : `Purchase ($${data.ticket_price})`}
        </Button>
      </Flex>
    );
  };

  return (
    <Container maxW="container.xl" py={{ base: "12" }}>
      <Container maxW="container.lg">
        {isPending && (
          <Flex flexDirection="column" gap="4">
            <Skeleton
              borderRadius="8"
              w="100%"
              h={{ base: "72", sm: "80" }}
              mb="2"
            />
            <Flex gap="8" flexDir={{ base: "column", md: "row" }}>
              <VStack w={{ base: "100%", md: "70%" }}>
                <SkeletonText
                  skeletonHeight="8"
                  noOfLines={1}
                  w="100%"
                  mb="4"
                />
                <SkeletonText skeletonHeight="4" noOfLines={8} w="100%" />
              </VStack>
              <VStack w={{ base: "100%", md: "30%" }} gap="4">
                <Skeleton borderRadius="8" h="32" w="100%" />
                <Skeleton borderRadius="8" h="32" w="100%" />
              </VStack>
            </Flex>
          </Flex>
        )}

        {data && (
          <>
            <Modal
              isOpen={isOpen}
              onClose={onClose}
              size={{ base: "full", sm: "md" }}
              scrollBehavior="inside"
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Attendees</ModalHeader>
                <ModalCloseButton />
                <ModalBody mb="4" mt="-2">
                  <Flex flexDir="column" gap="3">
                    <InputGroup mb="2">
                      <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.300" />
                      </InputLeftElement>
                      <Input
                        placeholder="Search attendees"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                    </InputGroup>
                    {attendees.map((i: PublicEventUser, idx) => (
                      <>
                        <AttendeeRow key={i._id} attendee={i} />
                        <Divider
                          display={
                            idx === attendees.length - 1 ? "none" : "block"
                          }
                        />
                      </>
                    ))}
                    {attendees.length === 0 && (
                      <Text mx="auto" textAlign="center">
                        No Results
                      </Text>
                    )}
                  </Flex>
                </ModalBody>
              </ModalContent>
            </Modal>
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
                  h={{ base: "64", md: "96" }}
                  objectFit="cover"
                  borderRadius="8"
                />
                <Flex
                  zIndex={2}
                  h={{ base: "64", md: "96" }}
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
              <Flex gap="16" mt="8" w="100%">
                <Flex flexDir="column" gap="2" w="100%">
                  <Text mb="-2">
                    {format(parseISO(data.date), "EEEE, MMM d yyyy")}
                  </Text>
                  <Heading as="h1" size="xl">
                    {data.name}
                  </Heading>
                  <Text>{data.description}</Text>

                  <Flex flexDir="column">
                    <BuyTicketBox
                      time={rangeHours(data.date, 1)}
                      display={{ base: "flex", md: "none" }}
                      my="4"
                      timeSlot={1}
                    />
                    <BuyTicketBox
                      time={rangeHours(data.date, 1, 1)}
                      display={{ base: "flex", md: "none" }}
                      my="4"
                      timeSlot={2}
                    />
                  </Flex>
                  <Box h="0.4" bg="gray.300" my="4" />
                  <Flex flexDir="column">
                    <Flex alignItems="center" gap="2" color="gray.500">
                      <ClockIcon />
                      <Text>
                        <b>Time: </b>
                        <Text display={{ base: "none", sm: "inline" }}>
                          {format(parseISO(data.date), "EEEE, MMM d yyyy, ")}
                          {rangeHours(data.date)}
                        </Text>
                      </Text>
                    </Flex>
                    <Text display={{ base: "block", sm: "none" }}>
                      {format(parseISO(data.date), "EEEE, MMM d yyyy, h:mmaaa")}{" "}
                      - {format(addHours(parseISO(data.date), 2), "h:mmaaa")}
                    </Text>
                  </Flex>

                  <Flex flexDir="column">
                    <Flex alignItems="center" gap="2" color="gray.500">
                      <LocationPinIcon />
                      <Text>
                        <b>Location: </b>
                        <Text display={{ base: "none", sm: "inline" }}>
                          {data.location}
                        </Text>
                      </Text>
                    </Flex>
                    <Text display={{ base: "block", sm: "none" }}>
                      {data.location}
                    </Text>
                  </Flex>

                  <Flex flexDir="column">
                    <Flex alignItems="center" gap="2" color="gray.500">
                      <SingleUserIcon />
                      <Text>
                        <b>Hosted by: </b>
                        <Text display={{ base: "none", sm: "inline" }}>
                          UBC Tennis Circle
                        </Text>
                      </Text>
                    </Flex>
                    <Text display={{ base: "block", sm: "none" }}>
                      UBC Tennis Circle
                    </Text>
                  </Flex>

                  <Flex
                    flexDir="column"
                    display={data.attendees.length > 0 ? "flex" : "none"}
                  >
                    <Flex alignItems="center" gap="2" color="gray.500">
                      <UserFriendsIcon />
                      <Text>
                        <b>Attendees: </b>
                      </Text>
                      <Flex display={{ base: "none", sm: "flex" }}>
                        <AvatarGroup size="sm" max={3}>
                          {data.attendees.map((i, idx) => (
                            <Avatar
                              name={`${i.first_name} ${i.last_name}`}
                              src={i.profile}
                              key={idx}
                            />
                          ))}
                        </AvatarGroup>
                        <Button
                          size="sm"
                          colorScheme="brand"
                          variant="ghost"
                          _hover={{
                            bg: "gray.100",
                          }}
                          ml="1"
                          onClick={onOpen}
                        >
                          View attendee list
                        </Button>
                      </Flex>
                    </Flex>
                    <Flex
                      display={{ base: "flex", sm: "none" }}
                      flexDir="column"
                    >
                      <AvatarGroup size="sm" max={3}>
                        {data.attendees.map((i, idx) => (
                          <Avatar name={i.name} src={i.profile} key={idx} />
                        ))}
                      </AvatarGroup>
                      <Button
                        size="sm"
                        mt="4"
                        colorScheme="brand"
                        variant="outline"
                        _hover={{
                          bg: "gray.100",
                        }}
                        onClick={onOpen}
                      >
                        View attendee list
                      </Button>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex
                  flexDir="column"
                  gap="4"
                  display={{ base: "none", md: "flex" }}
                >
                  <Box>
                    <BuyTicketBox
                      time={rangeHours(data.date, 1)}
                      timeSlot={1}
                    />
                  </Box>
                  <Box>
                    <BuyTicketBox
                      time={rangeHours(data.date, 1, 1)}
                      timeSlot={2}
                    />
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          </>
        )}
      </Container>
    </Container>
  );
};

export default EventDetail;
