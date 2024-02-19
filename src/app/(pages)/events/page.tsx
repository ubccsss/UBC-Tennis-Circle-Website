'use client';

import {Container, Img, Text, Heading, Flex, Center} from '@chakra-ui/react';

const Events = () => {
  return (
    <Container maxW="container.xl">
      <Container py={{base: '12', sm: '20'}}>
        <Center>
          <Heading
            as="h1"
            fontWeight="500"
            lineHeight="43.2px"
            color="#3F3D3B"
            textAlign="center"
          >
            Browse Tennis Events
          </Heading>
        </Center>
        <Center>
          <Text pb={{base: '200'}} textAlign="center">
            Come join us for a fun round of tennis!
          </Text>
        </Center>
        <Center>
          <Heading
            as="h4"
            color="#15997E"
            textAlign="center"
            fontSize="24"
            maxW="96"
          >
            Currently no events available, check back later!
          </Heading>
        </Center>

        <Img
          src="/static/images/illustrations/tennis-ball-yellow-events.svg"
          alt="Yellow Tennis Ball"
          borderRadius="lg"
          ml="auto"
          display={{base: 'none', md: 'block'}}
        />
        <Img
          src="/static/images/illustrations/tennis-ball-green-events.svg"
          alt="Blue Tennis Ball"
          borderRadius="lg"
          mt={{base: '12', md: '-4'}}
        />
        <Img
          src="/static/images/illustrations/tennis-ball-blue-events.svg"
          alt="Green Tennis Ball"
          ml="24"
          borderRadius="lg"
        />
      </Container>
    </Container>
  );
};

export default Events;
