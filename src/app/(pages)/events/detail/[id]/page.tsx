'use client';
import {
  Container,
  Box,
  Image,
  Flex,
  Skeleton,
  SkeletonText,
  HStack,
  Heading,
} from '@chakra-ui/react';
import axios from 'axios';
import {TennisEvent} from '@types';
import {useQuery} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';

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
    <Container maxW="container.xl" py={{base: '32', lg: '20'}}>
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
              <Heading as="h1" position="absolute">
                {data.name}
              </Heading>
            </Flex>
          </Flex>
        )}
      </Container>
    </Container>
  );
};

export default EventDetail;
