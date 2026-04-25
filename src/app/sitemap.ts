import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://kampisos.aynu.io/ja",
      lastModified: new Date(),
    },
    {
      url: "https://kampisos.aynu.io/ja/about",
      lastModified: new Date(),
    },
  ];
}
