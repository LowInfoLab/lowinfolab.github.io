import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);

  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    xmlns: { media: "http://search.yahoo.com/mrss/" }, // needed for <media:content>
    items: sortedPosts.map(({ data, id, filePath }) => {
      const imageUrl = data.coverImage ? `${SITE.website}${data.coverImage}` : null;

      return {
        link: getPath(id, filePath),
        title: data.title,
        // Inline featured image inside description
        description: imageUrl
          ? `<img src="${imageUrl}" alt="${data.title}" /><br/>${data.description}`
          : data.description,
        pubDate: new Date(data.modDatetime ?? data.pubDatetime),

        // Add <media:content> for feed readers
        customData: imageUrl
          ? `<media:content url="${imageUrl}" medium="image" />`
          : "",
      };
    }),
  });
}
