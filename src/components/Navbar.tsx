"use client";
import { useEffect, useState, createContext, useContext } from "react";
import {
  Box,
  Img,
  Flex,
  Spacer,
  Button,
  Stack,
  Link,
  Container,
  useDisclosure,
  IconButton,
  VStack,
  Collapse,
  Skeleton,
  HStack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { AuthComponent } from "./AuthComponent";
import axios from "axios";
import { authBroadcast } from "@broadcasts";

interface Link {
  name: string;
  href: string;
}

const links: Array<Link> = [
  { name: "Home", href: "/" },
  { name: "About us", href: "/about" },
  { name: "Events", href: "/events" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

const authButtonHrefs = {
  login: "/login",
  signup: "/signup",
  myAccount: "/profile/public",
};

interface NavbarContext {
  onToggle: () => void;
  logout: () => void;
  isLoggingOut: boolean;
}

const NavbarContext = createContext<NavbarContext>({} as NavbarContext);

export const Navbar = () => {
  // state for mobile nav
  const { isOpen, onToggle } = useDisclosure();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // on scroll, border will appear
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    const position = window.scrollY;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/auth/logout`);

      authBroadcast.postMessage("reload-auth");

      window.location.href = "/";
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <NavbarContext.Provider value={{ onToggle, logout, isLoggingOut }}>
      <Box as="nav" bg="white" w="100%" position="fixed" zIndex="500">
        <Box
          w="100%"
          borderBottomWidth={scrollPosition > 0 ? "2px" : "0px"}
          transition="ease-in-out border 0.1s"
        >
          <Container maxW="container.xl" ml="auto" mr="auto">
            <Flex w="100%" p="3" flexDirection="row">
              <Img
                src="/static/images/brand/logo.svg"
                alt="Tennis Circle"
                w="20"
              />
              <Spacer />
              <Flex display={{ base: "flex", lg: "none" }} alignItems="center">
                <IconButton
                  onClick={onToggle}
                  icon={
                    isOpen ? (
                      <CloseIcon w={3} h={3} />
                    ) : (
                      <HamburgerIcon w={5} h={5} />
                    )
                  }
                  variant={"ghost"}
                  aria-label={"Toggle Navigation"}
                />
              </Flex>
              <Stack
                spacing="8"
                direction="row"
                align="center"
                pl="24"
                display={{ base: "none", lg: "flex" }}
              >
                {links.map((i) => (
                  <Link
                    as={NextLink}
                    href={i.href}
                    key={i.href}
                    fontWeight="medium"
                    color="gray.500"
                    sx={{
                      ":hover": {
                        color: "brand.500",
                        textDecoration: "none",
                      },
                      ":focus": {
                        color: "brand.800",
                      },
                    }}
                  >
                    {i.name}
                  </Link>
                ))}
              </Stack>
              <Spacer display={{ base: "none", lg: "flex" }} />
              <Flex display={{ base: "none", lg: "flex" }} alignItems="center">
                <AuthComponent
                  unauthenticated={
                    <HStack spacing="4">
                      <Button as={NextLink} href={authButtonHrefs.login}>
                        Login
                      </Button>
                      <Button
                        colorScheme="brand"
                        as={NextLink}
                        href={authButtonHrefs.signup}
                      >
                        Sign up
                      </Button>
                    </HStack>
                  }
                  loading={
                    <HStack spacing="4">
                      <Skeleton>
                        <Button>My Account</Button>
                      </Skeleton>
                      <Skeleton>
                        <Button>Sign Out</Button>
                      </Skeleton>
                    </HStack>
                  }
                  authenticated={
                    <HStack spacing="4">
                      <Button
                        colorScheme="brand"
                        as={NextLink}
                        href={authButtonHrefs.myAccount}
                      >
                        My Account
                      </Button>
                      <Button
                        isDisabled={isLoggingOut}
                        isLoading={isLoggingOut}
                        onClick={logout}
                      >
                        Sign Out
                      </Button>
                    </HStack>
                  }
                />
              </Flex>
            </Flex>
          </Container>
        </Box>
        <Collapse in={isOpen} animateOpacity>
          <MobileNav />
        </Collapse>
      </Box>
    </NavbarContext.Provider>
  );
};

const MobileNav = () => {
  const { onToggle, logout, isLoggingOut } = useContext(NavbarContext);

  return (
    <Container
      maxW="container.xl"
      ml="auto"
      mr="auto"
      display={{ lg: "none" }}
      pb="8"
      borderBottomWidth="2px"
    >
      <Box px="5" pt="3" bg="white">
        <VStack align="left">
          {links.map((i) => (
            <Link
              as={NextLink}
              href={i.href}
              key={i.href}
              onClick={onToggle}
              fontWeight="medium"
              color="gray.500"
              py="2"
              sx={{
                ":hover": {
                  color: "brand.500",
                  textDecoration: "none",
                },
                ":focus": {
                  color: "brand.800",
                },
              }}
            >
              {i.name}
            </Link>
          ))}
          <AuthComponent
            loading={
              <VStack align="flex-start">
                <Button w={{ base: "100%", sm: "xs" }}>My Account</Button>
                <Button w={{ base: "100%", sm: "xs" }}>Sign Out</Button>
              </VStack>
            }
            unauthenticated={
              <VStack align="flex-start">
                <Button
                  w={{ base: "100%", sm: "xs" }}
                  as={NextLink}
                  href={authButtonHrefs.login}
                  onClick={onToggle}
                >
                  Login
                </Button>
                <Button
                  w={{ base: "100%", sm: "xs" }}
                  colorScheme="brand"
                  as={NextLink}
                  href={authButtonHrefs.signup}
                  onClick={onToggle}
                >
                  Sign up
                </Button>
              </VStack>
            }
            authenticated={
              <VStack align="flex-start">
                <Button
                  w={{ base: "100%", sm: "xs" }}
                  as={NextLink}
                  href={authButtonHrefs.login}
                  onClick={onToggle}
                  colorScheme="brand"
                >
                  My Account
                </Button>
                <Button
                  w={{ base: "100%", sm: "xs" }}
                  isDisabled={isLoggingOut}
                  isLoading={isLoggingOut}
                  onClick={() => {
                    logout();
                    onToggle();
                  }}
                >
                  Sign Out
                </Button>
              </VStack>
            }
          />
        </VStack>
      </Box>
    </Container>
  );
};
