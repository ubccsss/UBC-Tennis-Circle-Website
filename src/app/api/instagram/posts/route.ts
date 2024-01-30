import axios from 'axios'
import { ServerResponse } from '@helpers'

export const POST = async (req, res) => {
  try { 
    const url = 'https://graph.instagram.com/v18.0/17841417789493733/media';
      const params = {
      fields: 'id,caption,media_type,media_url,permalink',
      access_token: process.env.NEXT_INSTAGRAM_TOKEN,
      limit: 9,
    };

    const response = await axios.get(url, { params });

    if (response.data.paging?.next) {
      delete response.data.paging.next;
    }

    return ServerResponse.success(response.data);
  } catch (error) {
    console.error('Error fetching data from Instagram:', error);
    return ServerResponse.serverError('Failed to fetch data from Instagram');
  }
}
