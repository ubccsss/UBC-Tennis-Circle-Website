import axios from "axios";
import { logger, Cache, connectToDatabase } from "@lib";
import { ServerResponse } from "@helpers";

const fetchPosts = async () => {
  await connectToDatabase();

  const res = await axios.post<{ token: string }>(
    `${process.env.NEXT_PUBLIC_HOSTNAME}/api/instagram/token/get`,
    {
      refresh_token: process.env.NEXT_INSTAGRAM_REFRESH_TOKEN,
    },
  );

  const params = {
    fields: "caption,media_url,permalink",
    access_token: res.data.token,
    limit: Number.MAX_SAFE_INTEGER,
  };

  const response = await axios.get(process.env.NEXT_INSTAGRAM_GRAPH_MEDIA_URL, {
    params,
  });

  const posts = await response.data;

  // see first 24 posts
  return { ...posts, data: posts.data.slice(0, 24) };
};

export const GET = async () => {
  try {
    const cachedPosts = await Cache.fetch(
      "instagram-posts",
      fetchPosts,
      24 * 60 * 60, // cache posts for a day
    );

    return ServerResponse.success(cachedPosts.data);
  } catch (error) {
    logger.error("Error fetching data from Instagram:", error);
    return ServerResponse.serverError("Failed to fetch data from Instagram");
  }
};
