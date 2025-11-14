import { H3Event } from "h3";
import RSS from "rss";

export default eventHandler(async (event: H3Event) => {
  const siteUrl = "https://www.bokukoha.dev";

  const posts = await queryCollection(event, "blog")
    .order("date", "DESC")
    .where("draft", "=", "0")
    .select("title", "path", "description", "date")
    .all();

  const feed = new RSS({
    title: "ぼくこは.dev - Blog RSS",
    description: "Latest posts from ぼくこは.dev",
    site_url: siteUrl,
    feed_url: `${siteUrl}/rss.xml`,
    language: "ja",
  });

  for (const post of posts) {
    feed.item({
      title: post.title,
      description: post.description || "",
      url: siteUrl + post.path,
      date: post.date,
    });
  }

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
});
