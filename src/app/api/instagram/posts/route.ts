import axios from 'axios';
import {logger, Cache} from '@lib';
import {ServerResponse} from '@helpers';
import {NextRequest} from 'next/server';

export const POST = async (request: NextRequest) => {
  const {after} = await request.json();

  const fetchPosts = async () => {
    const url = 'https://graph.instagram.com/v18.0/17841417789493733/media';
    const params = {
      fields: 'id,caption,media_type,media_url,permalink',
      access_token: process.env.NEXT_INSTAGRAM_TOKEN,
      limit: 9,
      after: after === 'unset' ? null : after,
    };

    const response = await axios.get(url, {params});

    return response.data;
  };

  try {
    if (!after) {
      return ServerResponse.success({});
    }

    const cachedPosts = await Cache.fetch(
      `instagram-posts;after=${after}`,
      fetchPosts,
      60 * 60
    );

    return ServerResponse.success(cachedPosts);
  } catch (error) {
    logger.error('Error fetching data from Instagram:', error);
    return ServerResponse.serverError('Failed to fetch data from Instagram');
  }
};
