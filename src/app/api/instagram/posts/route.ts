import axios from 'axios';
import {logger} from '@lib';
import {ServerResponse} from '@helpers';
import {NextRequest} from 'next/server';

export const POST = async (request: NextRequest) => {
  const {after} = await request.json();

  try {
    const url = 'https://graph.instagram.com/v18.0/17841417789493733/media';
    const params = {
      fields: 'id,caption,media_type,media_url,permalink',
      access_token: process.env.NEXT_INSTAGRAM_TOKEN,
      limit: 9,
      after: after,
    };

    const response = await axios.get(url, {params});

    if (response.data.paging?.next) {
      delete response.data.paging.next;
    }

    return ServerResponse.success(response.data);
  } catch (error) {
    logger.error('Error fetching data from Instagram:', error);
    return ServerResponse.serverError('Failed to fetch data from Instagram');
  }
};
