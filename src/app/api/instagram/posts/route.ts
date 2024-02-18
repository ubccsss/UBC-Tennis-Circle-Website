import axios from 'axios';
import {logger, Cache} from '@lib';
import {ServerResponse} from '@helpers';

const fetchPosts = async () => {
  const url = 'https://graph.instagram.com/v18.0/17841417789493733/media';
  const params = {
    fields: 'caption,media_url,permalink',
    access_token: process.env.NEXT_INSTAGRAM_TOKEN,
    limit: Number.MAX_SAFE_INTEGER,
  };

  const response = await axios.get(url, {params});

  return response.data;
};

export const GET = async () => {
  try {
    const cachedPosts = await Cache.fetch(
      'instagram-posts',
      fetchPosts,
      60 * 60
    );

    return ServerResponse.success(cachedPosts.data);
  } catch (error) {
    logger.error('Error fetching data from Instagram:', error);
    return ServerResponse.serverError('Failed to fetch data from Instagram');
  }
};
