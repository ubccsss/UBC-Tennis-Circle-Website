import {createClient} from 'contentful';

export const contentfulClient = createClient({
  space: process.env.NEXT_CONTENTFUL_SPACE_ID!,
  accessToken: process.env.NEXT_CONTENTFUL_API_KEY!,
});
