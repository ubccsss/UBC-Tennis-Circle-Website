'use client';
import {useState} from 'react';
import {
  Text,
  VStack,
  Heading,
  FormControl,
  FormErrorMessage,
  Input,
  Stack,
  Container,
  Box,
  Button,
  Icon,
  useToast,
  SimpleGrid,
  Img,
} from '@chakra-ui/react';
import {FiArrowRight, FiCheck} from 'react-icons/fi';
import {useForm} from 'react-hook-form';
import {ZOD_ERR} from '@constants/error-messages';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {DEFAULT_SERVER_ERR} from '@constants/error-messages';
import axios from 'axios';

const schema = z.object({
  email_address: z.string().email(ZOD_ERR.INVALID_EMAIL),
});

type Form = z.infer<typeof schema>;
const Page = () => {
  const statusToast = useToast();
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = async ({email_address}: Form) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/auth/password-reset`,
        {
          email_address,
        }
      );
      if (res.data) {
        statusToast({
          title: res.data.message,
          status: 'success',
        });
        setSubmitted(true);
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        statusToast({
          title: e?.response?.data?.message || DEFAULT_SERVER_ERR,
          status: 'error',
        });
      }
    }
  };

  const {
    handleSubmit,
    register,
    formState: {errors, isSubmitting},
  } = useForm<Form>({resolver: zodResolver(schema)});
  return (
    <>
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
              src="/static/images/stock/reset-password.jpg"
              alt="Tennis Player"
              borderRadius="lg"
              width="100%"
              h="2xl"
              objectFit="cover"
              filter="brightness(70%)"
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
              Reset your password, ace your next game
            </Heading>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack
              alignItems="flex-start"
              spacing="19"
              w={{base: '100%', sm: 'max-content'}}
              mx="auto"
            >
              <Heading as="h1" size="2xl">
                Reset password
              </Heading>
              <Text w={{base: '100%', sm: 'sm'}} color="gray.500">
                We will send a recovery link to your email address ensuring you
                get access to your account again soon.
              </Text>
              <FormControl isInvalid={Boolean(errors.email_address)}>
                <Stack>
                  <Input
                    id="email_address"
                    type="email"
                    placeholder="Email Address"
                    disabled={isSubmitting || submitted}
                    w={{base: '100%', sm: 'sm'}}
                    size="lg"
                    {...register('email_address')}
                  />
                </Stack>
                <FormErrorMessage>
                  {errors?.email_address?.message}
                </FormErrorMessage>
              </FormControl>
              <Button
                mt="2"
                colorScheme="brand"
                type="submit"
                loadingText="Submitting..."
                size="lg"
                rightIcon={<Icon as={submitted ? FiCheck : FiArrowRight} />}
                isLoading={isSubmitting}
                isDisabled={submitted}
              >
                {submitted ? 'Sent' : 'Submit'}
              </Button>
            </VStack>
          </form>
        </SimpleGrid>
      </Container>
    </>
  );
};

export default Page;
