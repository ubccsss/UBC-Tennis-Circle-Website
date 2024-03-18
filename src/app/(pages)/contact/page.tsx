'use client';
import {
  Container,
  VStack,
  Button,
  Heading,
  Input,
  Img,
  Flex,
  FormControl,
  FormErrorMessage,
  Stack,
  Icon,
  useToast,
  Textarea,
  Text,
} from '@chakra-ui/react';
import {FiArrowRight} from 'react-icons/fi';
import {z} from 'zod';
import {ZOD_ERR, DEFAULT_SERVER_ERR} from '@constants/error-messages';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import axios from 'axios';

const schema = z.object({
  name: z.string().min(1, ZOD_ERR.REQ_FIELD),
  email_address: z.string().email(ZOD_ERR.INVALID_EMAIL),
  message: z.string().min(1, ZOD_ERR.REQ_FIELD).max(700, {
    message: 'Your message is too long',
  }),
});

type Form = z.infer<typeof schema>;

const Contact = () => {
  const statusToast = useToast();

  const {
    handleSubmit,
    register,
    formState: {errors, isSubmitting},
    watch,
  } = useForm<Form>({resolver: zodResolver(schema)});

  const onSubmit = async ({name, email_address, message}: Form) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/contact`,
        {
          name,
          email_address,
          message,
        }
      );

      if (res.data) {
        statusToast({
          title: res.data.message,
          status: 'success',
        });
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

  const watched = watch();

  return (
    <Container maxW="container.xl" py={{base: '32', lg: '20'}}>
      <Flex flexDirection="row" w="100%" justifyContent="center" gap="36">
        <Img
          sizes="lg"
          src="/static/images/illustrations/question-mark.svg"
          alt="Solar Panel"
          borderRadius="lg"
          display={{base: 'none', lg: 'block'}}
          ml="24"
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack
            align="flex-start"
            w={{base: '100%', sm: 'max-content'}}
            spacing="19"
          >
            <Heading as="h1" size="2xl">
              Have any Questions?
            </Heading>
            <Text color="gray.500" mt="-2" mb="1">
              Contact us below and we will try our best
              <br></br>to get back to you as soon as possible
            </Text>
            <FormControl isInvalid={Boolean(errors.name)}>
              <Stack spacing={4}>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  disabled={isSubmitting}
                  w={{base: '100%', sm: 'sm'}}
                  size="lg"
                  {...register('name')}
                />
              </Stack>
              <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.email_address)}>
              <Stack spacing={4}>
                <Input
                  id="email_address"
                  type="email"
                  placeholder="Email Address"
                  disabled={isSubmitting}
                  w={{base: '100%', sm: 'sm'}}
                  size="lg"
                  {...register('email_address')}
                />
              </Stack>
              <FormErrorMessage>
                {errors?.email_address?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.message)}>
              <Stack spacing={4}>
                <Textarea
                  id="message"
                  h="36"
                  placeholder="Message"
                  disabled={isSubmitting}
                  w={{base: '100%', sm: 'sm'}}
                  size="lg"
                  {...register('message')}
                />
              </Stack>
              {errors?.message?.message ? (
                <FormErrorMessage>{errors?.message?.message}</FormErrorMessage>
              ) : (
                <Text
                  color={
                    watched?.message?.length > 700 ? 'red.500' : 'gray.500'
                  }
                  fontSize="sm"
                  mt="2"
                >
                  {watched.message
                    ? `${700 - watched.message.length} characters remaining`
                    : `${700} characters remaining`}
                </Text>
              )}
            </FormControl>
            <Button
              mt="2"
              colorScheme="brand"
              type="submit"
              loadingText="Submitting..."
              size="lg"
              rightIcon={<Icon as={FiArrowRight} />}
              isLoading={isSubmitting}
            >
              Send Message
            </Button>
          </VStack>
        </form>
      </Flex>
    </Container>
  );
};

export default Contact;
