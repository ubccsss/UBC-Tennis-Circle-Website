'use client';
import {Container} from '@chakra-ui/react';
import axios from 'axios';
import {useQuery} from '@tanstack/react-query';

// get all team members
const getFeatured = async () => {
  const featured = await axios.get(
    `${process.env.NEXT_PUBLIC_HOSTNAME}/api/team/get-all`
  );
  return featured.data;
};

const Home = () => {
  const {isPending, error, data} = useQuery({
    queryKey: ['team'],
    queryFn: getFeatured,
  });

  return <Container maxW="container.xl"></Container>;
};

export default Home;
