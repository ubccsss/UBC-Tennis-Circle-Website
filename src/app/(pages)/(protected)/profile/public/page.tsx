"use client";
import {
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
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
} from "@chakra-ui/react";
import { FiArrowRight, FiCamera, FiInstagram } from "react-icons/fi";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZOD_ERR, DEFAULT_SERVER_ERR } from "@constants/error-messages";
import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { getClientSession } from "@utils";
import { UseFormSetValue, useForm } from "react-hook-form";

const schema = z.object({
  first_name: z.string().min(1, ZOD_ERR.REQ_FIELD),
  last_name: z.string().min(1, ZOD_ERR.REQ_FIELD),
  skill: z.string().min(1, ZOD_ERR.REQ_FIELD),
  instagram: z.string().min(1, ZOD_ERR.REQ_FIELD),
  profile: z.string().min(1),
});

type Form = z.infer<typeof schema>;

const initialFormUpdate = async (setValue: UseFormSetValue<Form>) => {
  const session = await getClientSession();
  setValue("profile", session.user.profile);
};

const AddInfo = () => {
  const statusToast = useToast();

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  useEffect(() => {
    initialFormUpdate(setValue);
  }, [setValue]);

  const onSubmit = async ({
    first_name,
    last_name,
    skill,
    instagram,
    profile,
  }: Form) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/auth/profile`,
        {
          first_name,
          last_name,
          skill: parseInt(skill),
          instagram,
          profile,
        },
      );

      if (res.data) {
        statusToast({
          title: res.data.message,
          status: "success",
        });
        window.location.href = "/profile/public";
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        statusToast({
          title: e?.response?.data?.message || DEFAULT_SERVER_ERR,
          status: "error",
        });
      }
    }
  };

  const MAX_IMG_SIZE: number = 1024 ** 2 * 2;
  const [dropzoneError, setDropzoneError] = useState<string | boolean>(false);
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles.length !== 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onabort = () => console.error("file reading was aborted");
        reader.onerror = () => console.error("file reading has failed");
        reader.onload = () => {
          const binaryStr = reader.result as string;
          setValue("profile", binaryStr);
          setDropzoneError(false);
        };
        reader.readAsDataURL(file);
      }
      if (rejectedFiles.length !== 0) {
        const fileError = rejectedFiles[0];
        setDropzoneError(fileError.errors[0].code);
      }
    },
    [setValue],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
      "image/svg+xml": [],
    },
    maxSize: MAX_IMG_SIZE,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const watched = watch();

  useEffect(() => {
    const getUserFromSession = async () => {
      const session = await getClientSession();
      return session;
    };

    const fetchSession = async () => {
      const session = await getUserFromSession();
      console.log(session.user);
      setValue("first_name", session.user.first_name);
      setValue("last_name", session.user.last_name);
      setValue("skill", session.user.skill);
      setValue("instagram", session.user.instagram);
      setValue("profile", session.user.profile);
    };

    fetchSession();
  }, [setValue]);

  return (
    <Container maxW="container.xl" py={{ base: "32", lg: "20" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex flexDirection="row" w="100%" justifyContent="center" gap="36">
          <VStack width="450px">
            <Heading as="h1" textAlign="center">
              Update your profile
            </Heading>
            <Text textAlign="center">
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim
              sint cillum sint consectetur cupidatat.
            </Text>
            {watched.profile ? (
              <Box
                position="relative"
                as="button"
                mt="10"
                onClick={onOpen}
                type="button"
              >
                <Image
                  src={watched.profile}
                  boxSize="24"
                  borderRadius="8"
                  alt="Profile"
                />
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
              <Skeleton w="24" h="24" borderRadius="8" />
            )}
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader> </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl isInvalid={Boolean(errors.profile)}>
                    <Box mb="3">
                      {dropzoneError === "file-invalid-type" && (
                        <Text color="red.500" fontSize="sm">
                          Image must be of either SVG, JPG, JPEG, or PNG format.
                        </Text>
                      )}
                      {dropzoneError === "file-too-large" && (
                        <Text color="red.500" fontSize="sm">
                          Image must be less than 2 MB in size.
                        </Text>
                      )}
                    </Box>
                    <Box
                      {...getRootProps()}
                      w="100"
                      borderWidth={errors.profile ? 2 : "thin"}
                      borderColor={errors.profile ? "red.500" : "gray.200"}
                      p={20}
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
                          maxW="48"
                          h="12"
                          objectFit="fill"
                          borderRadius="md"
                          alt="profile"
                        />
                        <Text color="gray.500" textAlign="center">
                          Upload your new profile here
                        </Text>
                      </VStack>
                    </Box>
                    <FormErrorMessage>
                      {errors?.profile?.message}
                    </FormErrorMessage>
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="red" mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      console.log("Updated profile successfully");
                      setValue("profile", watched.profile);
                      onClose();
                    }}
                    variant="ghost"
                  >
                    Update Profile
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <SimpleGrid mt={6} columns={2} spacing="4">
              <FormControl isInvalid={Boolean(errors.first_name)}>
                <Input
                  id="first_name"
                  placeholder="First Name"
                  disabled={isSubmitting}
                  w="100%"
                  size="lg"
                  {...register("first_name")}
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
                  {...register("last_name")}
                />
                <FormErrorMessage>
                  {errors?.last_name?.message}
                </FormErrorMessage>
              </FormControl>
            </SimpleGrid>
            <FormControl isInvalid={Boolean(errors.skill)}>
              <InputGroup size="lg">
                <Select
                  color="gray.500"
                  placeholder="Skill level"
                  {...register("skill")}
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
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.300"
                  fontSize="1.2em"
                >
                  @
                </InputLeftElement>
                <Input
                  placeholder="Instagram Username"
                  {...register("instagram")}
                />

                <InputRightElement pointerEvents="none">
                  <Icon as={FiInstagram} color="gray.500" />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors?.instagram?.message}</FormErrorMessage>
            </FormControl>
            <Flex mt={5} w="full">
              <Spacer />
              <Button
                colorScheme="brand"
                type="submit"
                isLoading={isSubmitting}
                loadingText="Updating ..."
                size="md"
                rightIcon={<Icon as={FiArrowRight} />}
                marginLeft={2}
              >
                Update Profile
              </Button>
            </Flex>
          </VStack>
        </Flex>
      </form>
    </Container>
  );
};

export default AddInfo;
