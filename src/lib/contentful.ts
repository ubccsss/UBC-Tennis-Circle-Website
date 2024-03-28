import { createClient as createCDAClient } from "contentful";
import { createClient as createCMAClient } from "contentful-management";

export const contentfulClient = createCDAClient({
  space: process.env.NEXT_CONTENTFUL_SPACE_ID!,
  accessToken: process.env.NEXT_CONTENTFUL_API_KEY!,
});

export const contentfulCMA = createCMAClient(
  {
    accessToken: process.env.NEXT_CONTENTFUL_CMA_TOKEN,
  },
  {
    type: "plain",
    defaults: {
      spaceId: process.env.NEXT_CONTENTFUL_SPACE_ID,
      environmentId: process.env.NEXT_CONTENTFUL_ENVIRONMENT,
    },
  },
);
