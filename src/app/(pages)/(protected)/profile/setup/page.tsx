'use client';
import {
  InputLeftElement,
  Input,
  InputGroup,
  InputRightElement,
  Container,
  Flex,
  VStack,
  Heading,
  Icon,
  Image,
  Button,
  Spacer,
  FormControl,
  FormErrorMessage,
  useToast,
  useDisclosure,
  ModalBody,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Text,
  Box,
  Skeleton,
} from '@chakra-ui/react';
import {AtSignIcon} from '@chakra-ui/icons';
import {FormatOptionLabelMeta, Select} from 'chakra-react-select';
import {FiArrowRight, FiCamera, FiInstagram} from 'react-icons/fi';
import z from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {DEFAULT_SERVER_ERR} from '@constants/error-messages';
import axios from 'axios';
import {useState, useCallback, useEffect} from 'react';
import {useDropzone, FileRejection} from 'react-dropzone';
import {getClientSession} from '@utils';
import {Controller, UseFormSetValue, useForm} from 'react-hook-form';
import {useRouter} from 'next/navigation';

const schema = z.object({
  skill: z.object({value: z.number(), label: z.string()}).optional(),
  instagram: z.string().optional(),
  profile: z.string().min(1), // should always have this
});

type Form = z.infer<typeof schema>;

const initialFormUpdate = async (setValue: UseFormSetValue<Form>) => {
  const session = await getClientSession();
  console.log(session);
  setValue('profile', session.user.profile);
};

const ProfileSetup = () => {
  const statusToast = useToast();

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    control,
    formState: {errors, isSubmitting},
  } = useForm<Form>({resolver: zodResolver(schema)});

  useEffect(() => {
    initialFormUpdate(setValue);
  }, []);

  const router = useRouter();

  const onSubmit = async ({skill, instagram, profile}: Form) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/auth/profile/setup`,
        {
          skill: skill?.value || 1,
          instagram,
          profile,
        }
      );

      router.push('/');
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

  const MAX_IMG_SIZE: number = 1024 ** 2 * 2;
  const [dropzoneError, setDropzoneError] = useState<string | boolean>(false);
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles.length !== 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onabort = () => console.error('file reading was aborted');
        reader.onerror = () => console.error('file reading has failed');
        reader.onload = () => {
          const binaryStr = reader.result as string;
          setValue('profile', binaryStr);
          setDropzoneError(false);
        };
        reader.readAsDataURL(file);
      }
      if (rejectedFiles.length !== 0) {
        const fileError = rejectedFiles[0];
        setDropzoneError(fileError.errors[0].code);
      }
    },
    []
  );

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/jpg': [],
      'image/svg+xml': [],
    },
    maxSize: MAX_IMG_SIZE,
  });

  const {isOpen, onOpen, onClose} = useDisclosure();

  const watched = watch();

  useEffect(() => {
    const getUserFromSession = async () => {
      const session = await getClientSession();
      return session;
    };

    const fetchSession = async () => {
      const session = await getUserFromSession();
      setValue('profile', session.user.profile);
    };

    fetchSession();
  }, []);

  interface SkillOptionSelect {
    value: number;
    label: string;
  }
  const SkillOption = (
    {value, label}: SkillOptionSelect,
    meta: FormatOptionLabelMeta<SkillOptionSelect>
  ) => {
    console.log(meta);
    const selected =
      meta.context === 'menu' && meta.selectValue?.[0]?.value === value;
    return (
      <Box w="100%">
        <Text color={selected ? 'white' : 'black'}>Skill {value}</Text>
        <Text fontSize="sm" color={selected ? 'white' : 'gray.500'} mt="-1">
          {label}
        </Text>
      </Box>
    );
  };

  console.log(watched);
  return (
    <Container maxW="container.xl" py={{base: '32', lg: '20'}}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex flexDirection="row" w="100%" justifyContent="center" gap="36">
          <VStack maxW="lg">
            <Heading as="h1" textAlign="center">
              Complete your profile
            </Heading>
            <Text textAlign="center">
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim
              sint cillum sint consectetur cupidatat.
            </Text>
            {watched.profile ? (
              <Box
                position="relative"
                as="button"
                mt="5"
                onClick={onOpen}
                type="button"
              >
                <Image src={watched.profile} boxSize="24" borderRadius="8" />
                <Flex
                  position="absolute"
                  bg="black"
                  w="100%"
                  justifyContent="center"
                  alignItems="center"
                  bottom="0"
                  borderBottomRadius="8"
                  py="2"
                  bgColor="rgb(0, 0, 0, 0.5)"
                >
                  <Icon as={FiCamera} color="white" />
                </Flex>
              </Box>
            ) : (
              <Skeleton w="24" h="24" borderRadius="8" mt="5" />
            )}
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader> </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl isInvalid={Boolean(errors.profile)}>
                    <Box mb="3">
                      {dropzoneError === 'file-invalid-type' && (
                        <Text color="red.500" fontSize="sm">
                          Image must be of either SVG, JPG, JPEG, or PNG format.
                        </Text>
                      )}
                      {dropzoneError === 'file-too-large' && (
                        <Text color="red.500" fontSize="sm">
                          Image must be less than 2 MB in size.
                        </Text>
                      )}
                    </Box>
                    <Box
                      {...getRootProps()}
                      w="100"
                      borderWidth={errors.profile ? 2 : 'thin'}
                      borderColor={errors.profile ? 'red.500' : 'gray.200'}
                      p={{base: '16', lg: '20'}}
                      borderRadius="10"
                    >
                      <input
                        {...getInputProps()}
                        accept="image/png, image/jpeg, image/jpg"
                      />
                      <VStack>
                        <Image
                          src={watched.profile}
                          w="auto"
                          maxW="72"
                          h="12"
                          objectFit="fill"
                          borderRadius="md"
                        />
                        <Text
                          color="gray.500"
                          textAlign="center"
                          display={{base: 'none', md: 'block'}}
                        >
                          Upload your new profile here
                        </Text>
                        <Text
                          color="gray.500"
                          textAlign="center"
                          display={{base: 'block', md: 'none'}}
                        >
                          Click here to upload new picture
                        </Text>
                      </VStack>
                    </Box>
                    <FormErrorMessage>
                      {errors?.profile?.message}
                    </FormErrorMessage>
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="red"
                    mr={3}
                    onClick={onClose}
                    variant="solid"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      console.log('Updated profile successfully');
                      setValue('profile', watched.profile);
                      onClose();
                    }}
                    colorScheme="brand"
                  >
                    Update Profile
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Flex
              justifyContent="center"
              flexDir="column"
              gap="4"
              mt="-4"
              w={{base: '100%', xs: '80'}}
            >
              <InputGroup size="lg" mt="10" zIndex={2} w="100%">
                <Controller
                  control={control}
                  name="skill"
                  render={({field: {onChange, onBlur, ref}}) => (
                    <FormControl isInvalid={Boolean(errors.skill)}>
                      <Select
                        ref={ref}
                        onChange={onChange}
                        onBlur={onBlur}
                        selectedOptionColorScheme="brand"
                        options={[
                          {value: 1, label: "I've never played before"},
                          {value: 2, label: "I'm a beginner player"},
                          {value: 3, label: "I'm an intermediate player"},
                          {value: 4, label: "I'm an advanced player"},
                        ]}
                        formatOptionLabel={SkillOption}
                        placeholder="Skill Level"
                        size={{base: 'md', sm: 'lg'}}
                        isSearchable={false}
                      />
                    </FormControl>
                  )}
                />
              </InputGroup>
              <FormErrorMessage>{errors?.skill?.message}</FormErrorMessage>
              <FormControl isInvalid={Boolean(errors.instagram)}>
                <InputGroup size={{base: 'md', sm: 'lg'}} w="100%">
                  <InputLeftElement pointerEvents="none">
                    <AtSignIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Instagram Username"
                    {...register('instagram')}
                  />

                  <InputRightElement pointerEvents="none">
                    <Icon as={FiInstagram} color="gray.500" />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors?.instagram?.message}
                </FormErrorMessage>
              </FormControl>

              <Flex mt={4} w="full">
                <Spacer />
                <Button onClick={skip} size="md" variant="outline">
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
            </Flex>
          </VStack>
        </Flex>
      </form>
    </Container>
  );
};

export default ProfileSetup;
