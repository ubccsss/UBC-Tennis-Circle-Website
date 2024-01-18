'use client';
import {Text, TextProps} from '@chakra-ui/react';

interface SubheaderProps extends TextProps {
  children: React.ReactNode;
}

export const Subheader = (props: SubheaderProps) => (
  <Text
    color="gray.400"
    textTransform="uppercase"
    letterSpacing="widest"
    fontWeight="bold"
    {...props}
  >
    {props.children}
  </Text>
);
