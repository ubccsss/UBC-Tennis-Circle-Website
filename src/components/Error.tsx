import {Flex, Icon, Text, FlexProps} from '@chakra-ui/react';
import {FiAlertCircle} from 'react-icons/fi';

export const Error = (props: FlexProps) => (
  <Flex
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    textAlign="center"
    gap="2"
    {...props}
  >
    <Icon as={FiAlertCircle} color="red.400" fontSize="28" />
    <Text maxW="64">An unexpected error has occurred</Text>
  </Flex>
);
