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
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import NextLink from "next/link";

interface Link {
  name: string;
  href: string;
  mobileHref?: string;
}

const links: Array<Link> = [
  { name: "Home", href: "/" },
  { name: "About us", href: "/about" },
  { name: "Gallery", href: "/gallery", mobileHref: "https://www.instagram.com/ubctenniscircle/" },
  { name: "Contact", href: "/contact" },
];

interface NavbarContext {
  onToggle: () => void;
}

const NavbarContext = createContext<NavbarContext>({} as NavbarContext);

export const Navbar = () => {
  // state for mobile nav
  const { isOpen, onToggle } = useDisclosure();

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

  return (
    <NavbarContext.Provider value={{ onToggle }}>
      <Box as="nav" bg="white" w="100%" position="fixed" zIndex="500">
        <Box
          w="100%"
          borderBottomWidth={scrollPosition > 0 ? "2px" : "0px"}
          transition="ease-in-out border 0.1s"
        >
          <Container maxW="container.xl" ml="auto" mr="auto">
            <Flex w="100%" p="3" flexDirection="row">
              <Link display="block" href="/">
                <Img
                  src="/static/images/brand/logo.svg"
                  alt="Tennis Circle"
                  w="20"
                />
              </Link>
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
                <Button as={NextLink} href="https://www.showpass.com/o/ams-tennis-circle-ubc/" colorScheme="brand" >See Events</Button>
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
  const { onToggle } = useContext(NavbarContext);

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
              href={i.mobileHref ? i.mobileHref : i.href}
              key={i.mobileHref ? i.mobileHref : i.href}
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
          <VStack align="flex-start">
            <Button as={NextLink} w={{ base: "100%", sm: "xs" }} href="https://www.showpass.com/o/ams-tennis-circle-ubc/" colorScheme="brand">See Events</Button>
          </VStack>
        </VStack>
      </Box>
    </Container>
  );
};
