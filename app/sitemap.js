import { getAllTechStacks } from "@/lib/notesData";
import { getAllTemplates } from "@/lib/templates";
import { getAllPrompts } from "@/lib/prompts";

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

  const libraryRoutes = [
    { url: `${baseUrl}/templates`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/prompts`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...getAllTemplates().map((template) => ({
      url: `${baseUrl}/templates/${template.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    })),
    ...getAllPrompts().map((prompt) => ({
      url: `${baseUrl}/prompts/${prompt.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    })),
  ];

  return [...staticRoutes, ...notesRoutes, ...libraryRoutes];
}
