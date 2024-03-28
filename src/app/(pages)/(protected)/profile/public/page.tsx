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
  IconButton,
} from "@chakra-ui/react";
import { FiArrowRight, FiCamera, FiInstagram } from "react-icons/fi";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZOD_ERR, DEFAULT_SERVER_ERR } from "@constants/error-messages";
import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { getClientSession } from "@utils";
import { Controller, UseFormSetValue, useForm } from "react-hook-form";
import { AtSignIcon } from "@chakra-ui/icons";
import { FormatOptionLabelMeta, Select } from "chakra-react-select";
import { CloseIcon } from "@chakra-ui/icons";
import { useSearchParams } from "next/navigation";

const skillOptions = [
  { value: 1, label: "I've never played before" },
  { value: 2, label: "I'm a beginner player" },
  { value: 3, label: "I'm an intermediate player" },
  { value: 4, label: "I'm an advanced player" },
];

const schema = z.object({
  first_name: z.string().min(1, ZOD_ERR.REQ_FIELD),
  last_name: z.string().min(1, ZOD_ERR.REQ_FIELD),
  skill: z.number(),
  instagram: z
    .literal("")
    .or(
      z
        .string()
        .regex(
          /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/,
          "Invalid Instagram Username",
        ),
    ),
  profile: z.string().min(1),
});

type Form = z.infer<typeof schema>;

const initialFormUpdate = async (setValue: UseFormSetValue<Form>) => {
  const session = await getClientSession();
  setValue("profile", session.user.profile);
};

const AddInfo = () => {
  const statusToast = useToast();
  const searchParams = useSearchParams();
  const setup = searchParams.get("setup");

  const {
    handleSubmit,
    register,
    setValue,
    setFocus,
    watch,
    control,
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
          skill,
          instagram,
          profile,
        },
      );

      if (res.data) {
        statusToast({
          title: res.data.message,
          status: "success",
        });
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

  const [session, setSession] = useState({ user: { profile: "" } });

  const watched = watch();

  useEffect(() => {
    const getUserFromSession = async () => {
      const session = await getClientSession();
      return session;
    };

    const fetchSession = async () => {
      const session = await getUserFromSession();
      setSession(session);
      setValue("first_name", session.user.first_name);
      setValue("last_name", session.user.last_name);
      setValue("skill", session.user.skill);
      setValue("instagram", session.user.instagram);
      setValue("profile", session.user.profile);
    };

    fetchSession();
  }, [setValue]);

  interface SkillOptionSelect {
    value: number;
    label: string;
  }
  const SkillOption = (
    { value, label }: SkillOptionSelect,
    meta: FormatOptionLabelMeta<SkillOptionSelect>,
  ) => {
    const selected =
      meta.context === "menu" && meta.selectValue?.[0]?.value === value;
    return (
      <Box w="100%">
        <Text color={selected ? "white" : "black"}>Skill {value}</Text>
        <Text fontSize="sm" color={selected ? "white" : "gray.500"} mt="-1">
          {label}
        </Text>
      </Box>
    );
  };

  return (
    <Container maxW="container.xl" py={{ base: "32", lg: "20" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex flexDirection="row" w="100%" justifyContent="center" gap="36">
          <VStack width="450px">
            <Heading
              as="h1"
              textAlign={{ base: "left", sm: "center" }}
              w="100%"
            >
              {setup ? "Complete your profile" : "Update your profile"}
            </Heading>
            <Text textAlign={{ base: "left", sm: "center" }}>
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
                          Upload new profile picture
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
                    colorScheme="gray"
                    mr={3}
                    onClick={() => {
                      setValue("profile", session?.user?.profile);
                      onClose();
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={() => {
                      setValue("profile", watched.profile);
                      onClose();
                    }}
                    colorScheme="brand"
                  >
                    Select
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <SimpleGrid
              mt={6}
              columns={{ base: 1, sm: 2 }}
              spacing="4"
              w="100%"
            >
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
              <InputGroup size="lg" my="2" zIndex={2} w="100%">
                <Controller
                  control={control}
                  name="skill"
                  render={({ field: { onChange, onBlur, ref, value } }) => (
                    <FormControl isInvalid={Boolean(errors.skill)}>
                      <Select
                        ref={ref}
                        onChange={(e) => {
                          onChange(e.value);
                        }}
                        onBlur={onBlur}
                        selectedOptionColorScheme="brand"
                        options={skillOptions}
                        formatOptionLabel={SkillOption}
                        placeholder="Skill Level"
                        isSearchable={false}
                        isDisabled={isSubmitting}
                        value={skillOptions.find((e) => e.value === value)}
                      />
                    </FormControl>
                  )}
                />
              </InputGroup>
              <FormErrorMessage>{errors?.skill?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.instagram)}>
              <InputGroup size="lg" w="100%">
                <InputLeftElement pointerEvents="none">
                  <AtSignIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Instagram Username"
                  isDisabled={isSubmitting}
                  {...register("instagram")}
                />

                <InputRightElement
                  pointerEvents={watched.instagram !== "" ? "visible" : "none"}
                >
                  {watched.instagram !== "" ? (
                    <IconButton
                      aria-label="Clear"
                      icon={<CloseIcon color="gray.500" />}
                      size="sm"
                      variant="ghost"
                      isDisabled={isSubmitting}
                      onClick={() => {
                        setValue("instagram", "");
                        setFocus("instagram");
                      }}
                    />
                  ) : (
                    <Icon as={FiInstagram} color="gray.500" />
                  )}
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
                size={{ base: "lg", sm: "md" }}
                rightIcon={<Icon as={FiArrowRight} />}
                w={{ base: "100%", sm: "auto" }}
              >
                {setup ? "Complete" : "Update"} Profile
              </Button>
            </Flex>
          </VStack>
        </Flex>
      </form>
    </Container>
  );
};

export default AddInfo;
