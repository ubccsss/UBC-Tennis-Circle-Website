'use client';

import {Container, Img, Text, Flex, Center} from '@chakra-ui/react';

const Events = () => {
  return (
    <Container maxW="container.xl">
      <Container py={[0, 20]}>
        <Center>
          <Text
            as="b"
            fontSize="36px"
            fontWeight="500"
            lineHeight="43.2px"
            color="#3F3D3B"
            align="center"
          >
            Browse currently available tennis events
          </Text>
        </Center>
        <Center>
          <Text pt={{base: '5'}} pb={{base: '200'}}>
            Come join us for a fun round of tennis!
          </Text>
        </Center>
        <Center>
          <Text
            font="Work Sans"
            fontWeight="500"
            fontSize="4xl"
            color="#15997E"
          >
            More events coming soon!
          </Text>
        </Center>

        <Img
          sizes="sm"
          src="/static/images/illustrations/tennis-ball-yellow-events.svg"
          alt="Yellow Tennis Ball"
          borderRadius="lg"
          display={{base: 'none', lg: 'block'}}
          ml="37em"
          mt="-2em"
        />
        <Img
          sizes="sm"
          src="/static/images/illustrations/tennis-ball-green-events.svg"
          alt="Blue Tennis Ball"
          borderRadius="lg"
          display={{base: 'none', lg: 'block'}}
          mt="2em"
        />
        <Img
          sizes="sm"
          src="/static/images/illustrations/tennis-ball-blue-events.svg"
          alt="Green Tennis Ball"
          borderRadius="lg"
          display={{base: 'none', lg: 'block'}}
          ml="-6em"
          mt="-6em"
        />
      </Container>
    </Container>
  );
};

export default Events;
