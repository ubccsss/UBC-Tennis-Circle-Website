"use client";
import { useEffect, useState } from "react";
import {
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
  HStack,
  Heading,
  AvatarGroup,
  Avatar,
  useDisclosure,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";
import { TennisEvent } from "@types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { useSearchParams } from "next/navigation";
import {
  LocationPinIcon,
  ClockIcon,
  SingleUserIcon,
  UserFriendsIcon,
} from "@icons";
import { getClientSession } from "@utils";
import { FiInstagram } from "react-icons/fi";

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
        id: "sold_out",
        title: "Unfortunately, this event just sold out.",
        status: "error",
      });
    }

    if (purchased === "true") {
      statusToast({
        id: "purchased",
        title: "You have already purchased this ticket.",
        status: "error",
      });
    }

    if (unsuccessfulPayment === "true") {
      statusToast({
        id: "unsuccessful_payment",
        title: "An error has occurred and you will be issued a refund.",
        status: "error",
      });
    }

    if (successfulPayment === "true") {
      statusToast({
        id: "successful_payment",
        title: "Successfully purchased ticket.",
        status: "success",
      });
    }
  }, [soldOut, statusToast, unsuccessfulPayment, successfulPayment, purchased]);

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

  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const purchaseTicket = async () => {
    const session = await getClientSession();
    try {
      setPurchaseLoading(true);

      if (!session) {
        router.push(`/login/?redirect=/events/detail/${params.id}`);
      }
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/events/ticket/purchase`,
        { event_id: params.id },
      );
      router.push(res.data.url);
    } catch (e) {
      console.error(e);
    }
    setPurchaseLoading(false);
  };

  const BuyTicketBox = ({ ...props }) => {
    return (
      <Flex
        borderRadius="8"
        p="4"
        border="1px"
        borderColor="brand.500"
        flexDir="column"
        gap="4"
        h="100%"
        minW={{ base: "unset", sm: "64" }}
        {...props}
      >
        <Heading as="h4" fontSize="xl" textAlign="center">
          Admission ${data.ticket_price}
        </Heading>
        <Button
          w="100%"
          colorScheme="brand"
          onClick={purchaseTicket}
          isLoading={purchaseLoading}
          loadingText="Reserving Ticket"
          isDisabled={
            (!data.reserved && data.available_tickets <= 0) || data.purchased
          }
        >
          {data.purchased
            ? "Purchased Ticket"
            : !data.reserved && data.available_tickets <= 0
              ? "Sold out"
              : "Buy Ticket"}
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
              h={{ base: "36", sm: "64" }}
              mb="2"
            />
            <HStack gap="8" alignItems="flex-start">
              <SkeletonText skeletonHeight="4" w="70%" noOfLines={4} />
              <Skeleton borderRadius="8" h="32" w="30%" />
            </HStack>
          </Flex>
        )}

        {data && (
          <>
            <Modal
              isOpen={isOpen}
              onClose={onClose}
              size={{ base: "full", sm: "md" }}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Attendees</ModalHeader>
                <ModalCloseButton />
                <ModalBody mb="4">
                  <Flex flexDir="column" gap="3">
                    {data.attendees.map((i, idx) => (
                      <>
                        <Flex
                          w="100%"
                          key={idx}
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
                              src={i.profile}
                              name={i.first_name}
                              size="sm"
                            />
                            <Text maxW="52" wordBreak="break-all">
                              {i.first_name} {i.last_name}
                            </Text>
                          </Flex>

                          <Flex
                            gap="2"
                            alignItems="center"
                            flexDir={{ base: "row-reverse", md: "row" }}
                          >
                            {i.instagram && (
                              <IconButton
                                as={Link}
                                colorScheme="pink"
                                icon={<Icon as={FiInstagram} fontSize="18" />}
                                aria-label="Instagram"
                                size="sm"
                                href={`https://www.instagram.com/${i.instagram}`}
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
                              <Text color="brand.500">Skill {i.skill}</Text>
                            </Flex>
                          </Flex>
                        </Flex>
                        <Divider
                          display={
                            idx === data.attendees.length - 1 ? "none" : "block"
                          }
                        />
                      </>
                    ))}
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
                    {format(parseISO(data.date), "EEEE, MMM d yyyy")}
                  </Text>
                  <Heading as="h1" size="xl">
                    {data.name}
                  </Heading>
                  <Text>{data.description}</Text>

                  <BuyTicketBox display={{ base: "flex", md: "none" }} my="4" />
                  <Box h="0.4" bg="gray.300" my="4" />
                  <Flex flexDir="column">
                    <Flex alignItems="center" gap="2" color="gray.500">
                      <ClockIcon />
                      <Text>
                        <b>Time: </b>
                        <Text display={{ base: "none", sm: "inline" }}>
                          {format(
                            parseISO(data.date),
                            "EEEE, MMM d yyyy, h:mm aaa",
                          )}
                        </Text>
                      </Text>
                    </Flex>
                    <Text display={{ base: "block", sm: "none" }}>
                      {format(
                        parseISO(data.date),
                        "EEEE, MMM d yyyy, h:mm aaa",
                      )}
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
                <BuyTicketBox display={{ base: "none", md: "flex" }} />
              </Flex>
            </Flex>
          </>
        )}
      </Container>
    </Container>
  );
};

export default EventDetail;
