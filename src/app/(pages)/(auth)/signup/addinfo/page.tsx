'use client';

import {
  Input,
  InputGroup,
  InputRightElement,
  Container,
  Flex,
  VStack,
  Heading,
  Icon,
  Image,
  Select,
  Button,
  Spacer,
  FormControl,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import {useSearchParams} from 'next/navigation';
import {FiArrowRight, FiInstagram} from 'react-icons/fi';
import z from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {ZOD_ERR, DEFAULT_SERVER_ERR} from '@constants/error-messages';
import axios from 'axios';

const schema = z.object({
  skill: z.string().min(1, ZOD_ERR.REQ_FIELD),
  instagram: z.string().min(1, ZOD_ERR.REQ_FIELD),
});

type Form = z.infer<typeof schema>;

const AddInfo = () => {
  const statusToast = useToast();
  const params = useSearchParams();
  const id = params.get('id');
  const picture = params.get('picture');

  const {
    handleSubmit,
    register,
    formState: {errors, isSubmitting},
  } = useForm<Form>({resolver: zodResolver(schema)});

  const onSubmit = async ({skill, instagram}: Form) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/addinfo`,
        {
          id,
          skill: parseInt(skill),
          instagram,
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

  const skip = () => {
    window.location.href = '/';
  };

  return (
    <Container maxW="container.xl" py={{base: '32', lg: '20'}}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex flexDirection="row" w="100%" justifyContent="center" gap="36">
          <VStack width="450px">
            <Heading as="h1" size="2xl">
              Create your profile
            </Heading>
            <Image src={picture!} mt="10" boxSize="80px" />
            <FormControl isInvalid={Boolean(errors.skill)}>
              <InputGroup size="lg" mt="10">
                <Select
                  color="gray.500"
                  placeholder="Skill level"
                  {...register('skill')}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </Select>
              </InputGroup>
              <FormErrorMessage>{errors?.skill?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.instagram)}>
              <InputGroup size="lg">
                <Input
                  placeholder="Instagram Username"
                  {...register('instagram')}
                />

                <InputRightElement pointerEvents="none">
                  <Icon as={FiInstagram} color="gray.500" />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors?.instagram?.message}</FormErrorMessage>
            </FormControl>
            <Flex mt={5} w="full">
              <Spacer />
              <Button onClick={skip} colorScheme="brand" size="md">
                Skip
              </Button>
              <Button
                colorScheme="brand"
                type="submit"
                isLoading={isSubmitting}
                loadingText="Updating ..."
                size="md"
                rightIcon={<Icon as={FiArrowRight} />}
                marginLeft={2}
              >
                Continue
              </Button>
            </Flex>
          </VStack>
        </Flex>
      </form>
    </Container>
  );
};

export default AddInfo;
