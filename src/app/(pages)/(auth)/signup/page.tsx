'use client';
import {useState} from 'react';
import {
  Container,
  VStack,
  Button,
  Heading,
  Input,
  useToast,
  SimpleGrid,
  Icon,
  Img,
  Box,
  FormControl,
  FormErrorMessage,
  useDisclosure,
  Flex,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Link,
  Text,
  HStack,
} from '@chakra-ui/react';
import {FiArrowRight, FiMail} from 'react-icons/fi';
import {Subheader} from '@components';
import {useForm} from 'react-hook-form';
import z from 'zod';
import axios from 'axios';
import {zodResolver} from '@hookform/resolvers/zod';
import {DEFAULT_SERVER_ERR, ZOD_ERR} from '@constants';
import {ExternalLinkIcon} from '@chakra-ui/icons';

const schema = z
  .object({
    first_name: z.string().min(1, ZOD_ERR.REQ_FIELD),
    last_name: z.string().min(1, ZOD_ERR.REQ_FIELD),
    email_address: z.string().email(ZOD_ERR.INVALID_EMAIL),
    password: z
      .string()
      .min(8, {message: 'Password must be at least 8 characters'})
      .max(256, {message: 'Password must be less than 256 characters'}),
    confirm_password: z.string().min(1, ZOD_ERR.REQ_FIELD),
  })
  .refine(data => data.password === data.confirm_password, {
    message: 'Does not match password field',
    path: ['confirm_password'],
  });

type Form = z.infer<typeof schema>;

const Signup = () => {
  const GOOGLE_AUTH_LINK = `${process.env.NEXT_PUBLIC_HOSTNAME}/api/auth/signup/google`;

  const statusToast = useToast();

  const {isOpen, onOpen, onClose} = useDisclosure();
  const [sentTo, setSentTo] = useState('');

  const {
    handleSubmit,
    register,
    formState: {errors, isSubmitting},
    getValues,
    reset,
  } = useForm<Form>({resolver: zodResolver(schema)});

  const onSubmit = async ({
    first_name,
    last_name,
    email_address,
    password,
  }: Form) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/auth/signup`, {
        first_name,
        last_name,
        email_address,
        password,
      });

      const formValues = getValues();
      setSentTo(formValues.email_address);

      onOpen();

      reset();
    } catch (e) {
      if (axios.isAxiosError(e)) {
        statusToast({
          title: e?.response?.data?.message || DEFAULT_SERVER_ERR,
          status: 'error',
        });
      }
    }
  };

  return (
    <Container maxW="container.xl" py={{base: '32', lg: '20'}}>
      <SimpleGrid
        columns={{base: 1, lg: 2}}
        px="4"
        alignItems="center"
        spacing="16"
      >
        <Box
          w="100%"
          h="100%"
          display={{base: 'none', lg: 'block'}}
          position="relative"
        >
          <Img
            src="/static/images/stock/signup.jpg"
            alt="Tennis Player"
            borderRadius="lg"
            width="100%"
            h="2xl"
            objectFit="cover"
            filter="brightness(50%)"
          />
          <Heading
            as="h3"
            size="xl"
            position="absolute"
            zIndex="2"
            top="8"
            left="8"
            mr="20"
            color="white"
          >
            A Tennis Community Awaits Your Serve
          </Heading>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack
            align="flex-start"
            spacing="19"
            w={{base: '100%', sm: 'max-content'}}
            mx="auto"
          >
            <Heading as="h1" size="2xl">
              Sign up
            </Heading>
            <Subheader mt="-2" mb="1">
              Register With The Tennis Circle
            </Subheader>
            <SimpleGrid w={{base: '100%', sm: 'sm'}} columns={2} spacing="4">
              <FormControl isInvalid={Boolean(errors.first_name)}>
                <Input
                  id="first_name"
                  placeholder="First Name"
                  disabled={isSubmitting}
                  w="100%"
                  size="lg"
                  {...register('first_name')}
                />
                <FormErrorMessage>
                  {errors?.first_name?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.last_name)}>
                <Input
                  id="last_name"
                  placeholder="Last Name"
                  disabled={isSubmitting}
                  w="100%"
                  size="lg"
                  {...register('last_name')}
                />
                <FormErrorMessage>
                  {errors?.last_name?.message}
                </FormErrorMessage>
              </FormControl>
            </SimpleGrid>
            <FormControl isInvalid={Boolean(errors.email_address)}>
              <Input
                id="email_address"
                type="email"
                placeholder="Email Address"
                disabled={isSubmitting}
                w={{base: '100%', sm: 'sm'}}
                size="lg"
                {...register('email_address')}
              />
              <FormErrorMessage>
                {errors?.email_address?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.password)}>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                disabled={isSubmitting}
                w={{base: '100%', sm: 'sm'}}
                size="lg"
                {...register('password')}
              />
              <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.password)}>
              <Input
                id="confirm_password"
                type="password"
                placeholder="Confirm Password"
                disabled={isSubmitting}
                w={{base: '100%', sm: 'sm'}}
                size="lg"
                {...register('confirm_password')}
              />
              <FormErrorMessage>
                {errors?.confirm_password?.message}
              </FormErrorMessage>
            </FormControl>
            <Button
              mt="2"
              colorScheme="brand"
              type="submit"
              isLoading={isSubmitting}
              loadingText="Signing up..."
              size="lg"
              rightIcon={<Icon as={FiArrowRight} />}
            >
              Continue
            </Button>
            <HStack>
              <Text>or </Text>
              <Link href={GOOGLE_AUTH_LINK}>
                Sign up with Google <ExternalLinkIcon mx="2px" />
              </Link>
            </HStack>
          </VStack>
        </form>
      </SimpleGrid>

      {/* Verify Email Modal*/}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent textAlign="center">
          <ModalCloseButton />
          <Flex
            position="relative"
            justifyContent="center"
            alignItems="center"
            mt="12"
          >
            <Box
              w="12"
              h="12"
              position="absolute"
              bg="blue.500"
              borderRadius="full"
            />
            <Icon as={FiMail} fontSize="24" color="white" zIndex={2} />
          </Flex>

          <ModalHeader fontSize="24">Verify your email address</ModalHeader>
          <ModalBody color="gray.500" mb="12" mt="-4">
            We have sent a verification link to <b>{sentTo}</b>. Please verify
            your account before logging in.
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Signup;
