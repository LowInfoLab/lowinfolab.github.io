export const SITE = {
  website: "https://lowinfolab.com", // replace this with your deployed domain
  base: "blog",
  author: "LowInfoLab",
  profile: "https://github.com/LowInfoLab",
  desc: "Exploring digital minimalism, the low information diet, and ideas for reducing information overload.",
  title: "LowInfoLab",
  ogImage: "",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/lowinfolab.github.io/blog/edit/main/",
  },
  dynamicOgImage: true,
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "America/Toronto", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
