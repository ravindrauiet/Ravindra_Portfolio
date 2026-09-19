export const nextjsData = {
  id: "nextjs",
  slug: "nextjs",
  name: "Next.js",
  icon: "fas fa-cubes",
  iconColor: "#ffffff",
  badge: "Full-Stack Framework",
  description: "Learn Next.js 16+ App Router, React Server Components (RSC), Server Actions, API Routes, and SSG/SSR performance tuning.",
  totalLectures: 1,
  lectures: [
    {
      slug: "lecture-1",
      number: 1,
      title: "Next.js App Router, Server Components & Dynamic Routing",
      summary: "Explore file-system routing, server vs client components, metadata SEO API, and server-side rendering advantages.",
      readTime: "15 min read",
      difficulty: "Intermediate",
      date: "2026-09-19",
      sections: [
        {
          heading: "1. Next.js App Router vs. Pages Router",
          content: `Next.js introduces the App Router built on React Server Components (RSC). Key benefits include:
• **Default Server Components**: Components render on the server by default, reducing client-side JavaScript bundle sizes.
• **Nested Layouts & Templates**: Shared UI wrappers across routes without unnecessary re-renders.
• **Colocated Data Fetching**: Fetch data directly inside async Server Components using standard fetch() with automatic caching.`
        },
        {
          heading: "2. Server Components vs. Client Components",
          content: `• **Server Components (Default)**: Best for data fetching, backend security, reducing client bundle size, and SEO indexing. Cannot use React hooks (\`useState\`, \`useEffect\`) or browser event listeners.
• **Client Components (\`"use client"\`)**: Needed for interactive elements, event listeners (\`onClick\`, \`onChange\`), custom hooks, and browser APIs.`,
          codeSnippet: `// Server Component with Direct Data Fetching (app/projects/page.js)
import React from 'react';

export const metadata = {
  title: 'Projects | Full Stack Showcase',
};

export default async function ProjectsPage() {
  const res = await fetch('https://api.example.com/projects', { next: { revalidate: 3600 } });
  const projects = await res.json();

  return (
    <div className="container">
      <h1>My Projects</h1>
      {projects.map((proj) => (
        <div key={proj.id} className="project-card">
          <h3>{proj.title}</h3>
        </div>
      ))}
    </div>
  );
}`
        },
        {
          heading: "3. Dynamic Routing & Layout Architecture",
          content: `The App Router relies on folder-based conventions:
• \`app/page.js\` -> Home page (\`/\`)
• \`app/notes/page.js\` -> Notes hub (\`/notes\`)
• \`app/notes/[techStack]/page.js\` -> Dynamic Tech Stack Route (\`/notes/react\`)
• \`app/notes/[techStack]/[lectureSlug]/page.js\` -> Dynamic Lecture Route (\`/notes/react/lecture-1\`)`
        },
        {
          heading: "4. Summary & Production Tips",
          content: `• Keep components as Server Components by default; add \`"use client"\` at the very top of files only when interactivity is required.
• Leverage Next.js built-in \`Script\`, \`Image\`, and \`Font\` components for optimal Core Web Vitals scores.`
        }
      ]
    }
  ]
};
