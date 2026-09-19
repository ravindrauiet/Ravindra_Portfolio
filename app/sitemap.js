import { getAllTechStacks } from "@/lib/notesData";

export default function sitemap() {
  const baseUrl = "https://ravindranathjha.in";

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/skills`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/experience`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/notes`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const stacks = getAllTechStacks();
  const notesRoutes = [];

  for (const stack of stacks) {
    notesRoutes.push({
      url: `${baseUrl}/notes/${stack.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    });

    for (const lecture of stack.lectures) {
      notesRoutes.push({
        url: `${baseUrl}/notes/${stack.slug}/${lecture.slug}`,
        lastModified: new Date(lecture.date),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return [...staticRoutes, ...notesRoutes];
}
