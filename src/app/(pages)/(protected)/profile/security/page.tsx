"use client";
import {
  Box,
  Img,
  Tabs,
  TabList,
  Tab,
  Button,
  Container,
  Flex,
  VStack,
  Heading,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalContent,
  FormControl,
  FormLabel,
  Input,
  useToast,
  FormErrorMessage,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogHeader,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { getClientSession } from "@utils/getClientSession";
import axios from "axios";
import { DEFAULT_SERVER_ERR } from "@constants/error-messages";
import { useEffect, useState } from "react";
import z from "zod";
import { ZOD_ERR } from "@constants/error-messages";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useRouter } from "next/navigation";
import { InfoIcon, LockIcon } from "@chakra-ui/icons";

const schema = z.object({
  email_address: z.string().email(ZOD_ERR.INVALID_EMAIL),
  password: z.string().min(1, ZOD_ERR.REQ_FIELD),
});

type Form = z.infer<typeof schema>;

const Security = () => {
  const router = useRouter();

  const [isPassword, setIsPassword] = useState<boolean>(null);

  const [isPasswordSubmitting, setIsPasswordSubmitting] =
    useState<boolean>(false);

  const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false);

  const getSession = async () => {
    const session = await getClientSession();
    return session;
  };

  useEffect(() => {
    const getSessionProvider = async () => {
      const session = await getSession();
      if (session?.user?.provider === "password") {
        setIsPassword(true);
      } else {
        setIsPassword(false);
      }
    };
    getSessionProvider();
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const statusToast = useToast();

  const resetEmailModal = useDisclosure();
  const deleteAccountModal = useDisclosure();
  const cancelRef = React.useRef(null);

  const handleResetPassword = async () => {
    try {
      setIsPasswordSubmitting(true);
      const session = await getSession();
      console.log(session.user.email_address);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/auth/password-reset`,
        {
          email_address: session.user.email_address,
        },
      );

      if (res.data) {
        statusToast({
          title: res.data.message,
          status: "success",
        });
      }
      setIsPasswordSubmitting(false);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        statusToast({
          title: e?.response?.data?.message || DEFAULT_SERVER_ERR,
          status: "error",
        });
      }
      setIsPasswordSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeletingAccount(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/auth/delete-account`,
      );

      if (res.data) {
        statusToast({
          title: res.data.message,
          status: "success",
        });
      }

      setIsDeletingAccount(false);
      window.location.href = "/";
    } catch (e) {
      if (axios.isAxiosError(e)) {
        statusToast({
          title: e?.response?.data?.message || DEFAULT_SERVER_ERR,
          status: "error",
        });
      }
      setIsDeletingAccount(false);
    }
  };

  const onSubmit = async ({ email_address, password }: Form) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/auth/email-reset`,
        {
          email_address,
          password,
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

  return (
    <Container maxW="container.xl" py={{ base: "32", lg: "20" }}>
      <Flex flexDirection="row" w="100%" justifyContent="center" gap="36">
        <VStack width="450px">
          <Tabs mt="-8" mb="4" defaultIndex={1} colorScheme="brand">
            <TabList>
              <Tab
                color="gray.600"
                onClick={() => router.push(`/profile/public`)}
              >
                <InfoIcon mr="2" />
                Profile
              </Tab>
              <Tab>
                <LockIcon mr="2" />
                Security
              </Tab>
            </TabList>
          </Tabs>
          <Heading as="h1" textAlign={{ base: "left", sm: "center" }} w="100%">
            Secure your account
          </Heading>
          <Text textAlign={{ base: "left", sm: "center" }}>
            Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint
            cillum sint consectetur cupidatat.
          </Text>

          <Flex
            gap={4}
            mt={4}
            w={{ base: "100%", sm: "80" }}
            flexDir="column"
            mx="auto"
          >
            {isPassword && (
              <>
                <Button
                  isLoading={isPasswordSubmitting}
                  flexGrow={1}
                  colorScheme="brand"
                  variant="outline"
                  _hover={{
                    bg: "gray.100",
                  }}
                  onClick={handleResetPassword}
                  size={{ base: "lg", sm: "md" }}
                >
                  Reset your password
                </Button>
                <Button
                  flexGrow={1}
                  colorScheme="brand"
                  variant="outline"
                  _hover={{
                    bg: "gray.100",
                  }}
                  onClick={resetEmailModal.onOpen}
                  size={{ base: "lg", sm: "md" }}
                >
                  Reset your email
                </Button>
              </>
            )}
            <Modal
              isOpen={resetEmailModal.isOpen}
              onClose={resetEmailModal.onClose}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Reset your email</ModalHeader>
                <ModalCloseButton />

                <form onSubmit={handleSubmit(onSubmit)}>
                  <ModalBody pb={6}>
                    <FormControl isInvalid={Boolean(errors.password)}>
                      <FormLabel>Confirm Password</FormLabel>
                      <Input
                        type="password"
                        placeholder="Your password"
                        disabled={isSubmitting}
                        {...register("password")}
                      />
                      <FormErrorMessage>
                        {errors?.password?.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl
                      mt={4}
                      isInvalid={Boolean(errors.email_address)}
                    >
                      <FormLabel>New Email</FormLabel>
                      <Input
                        type="email"
                        placeholder="Your new email"
                        disabled={isSubmitting}
                        {...register("email_address")}
                      />
                      <FormErrorMessage>
                        {errors?.email_address?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </ModalBody>

                  <ModalFooter>
                    <Button onClick={resetEmailModal.onClose}>Cancel</Button>
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      colorScheme="brand"
                      ml="2"
                    >
                      Confirm
                    </Button>
                  </ModalFooter>
                </form>
              </ModalContent>
            </Modal>
            {isPassword === false && (
              <Flex
                flexDir="column"
                textAlign="center"
                justifyContent="center"
                alignItems="center"
                mb="4"
              >
                <Img
                  src="https://upload.wikimedia.org/wikipedia/commons/8/8b/Google_2015_logo_colorless_mourning_period.svg"
                  w="36"
                  alt="Google"
                />
                <Text mt="2">Your account is managed by Google.</Text>
              </Flex>
            )}
            <Button
              flexGrow={1}
              colorScheme="red"
              variant="outline"
              size={{ base: "lg", sm: "md" }}
              onClick={deleteAccountModal.onOpen}
            >
              Delete my account
            </Button>
            <AlertDialog
              leastDestructiveRef={cancelRef}
              isOpen={deleteAccountModal.isOpen}
              onClose={deleteAccountModal.onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg">
                    Delete Account
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    <Text>
                      Are you sure? Your account cannot be recovered afterwards.
                    </Text>
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button
                      ref={cancelRef}
                      onClick={deleteAccountModal.onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      colorScheme="red"
                      variant="outline"
                      ml="2"
                      isLoading={isDeletingAccount}
                      onClick={handleDeleteAccount}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Flex>
        </VStack>
      </Flex>
    </Container>
  );
};

export default Security;
