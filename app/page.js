import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Clock, Code2, Layers, Sparkles, Wand2 } from "lucide-react";
import HubSearch from "@/components/home/HubSearch";
import LatestNotes from "@/components/home/LatestNotes";
import AuthorBox from "@/components/site/AuthorBox";
import { getAllTechStacks } from "@/lib/notesData";
import { CATEGORIES, getAllTemplates } from "@/lib/templates";
import { getAllPrompts } from "@/lib/prompts";
import { PARALLAX_DEMOS } from "@/lib/demos";

const SITE = "https://www.ravindranathjha.in";

export const metadata = {
  title: { absolute: "Free Coding Notes, UI Templates & AI Website Prompts — Ravindra Nath Jha" },
  description:
    "Free, in-depth programming notes for React, Next.js, Java, Python and AI, plus copy-paste UI templates, parallax website demos and AI prompts for building complete websites. Written by Ravindra Nath Jha (M.Tech AI, IIT Jodhpur).",
  alternates: { canonical: SITE },
};

const minutes = (lecture) => parseInt(lecture.readTime, 10) || 0;
const topicOf = (title) => (title.match(/Lecture \d+:\s*(.+)$/)?.[1] ?? title).trim();
const jsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

export default function Home() {
  const stacks = getAllTechStacks();
  const templates = getAllTemplates();
  const prompts = getAllPrompts();
  const demos = PARALLAX_DEMOS;
  const lectureCount = stacks.reduce((sum, stack) => sum + stack.lectures.length, 0);

  // Search index sent to the client: titles and links only
  const index = [
    ...stacks.flatMap((stack) =>
      stack.lectures.map((lecture) => ({
        kind: "lecture",
        title: topicOf(lecture.title),
        meta: `${stack.name} · Lecture ${lecture.number}`,
        href: `/notes/${stack.slug}/${lecture.slug}`,
      }))
    ),
    ...templates.map((t) => ({ kind: "template", title: t.name, meta: `${t.category} ${(t.tags || []).join(" ")}`, href: `/templates/${t.slug}` })),
    ...prompts.map((p) => ({ kind: "prompt", title: `${p.name} prompt`, meta: p.industry, href: `/prompts/${p.slug}` })),
    ...demos.map((d) => ({ kind: "demo", title: d.name, meta: `${d.category} parallax website`, href: d.href })),
  ];

  const stats = [
    { value: lectureCount, label: "Lectures", href: "/notes" },
    { value: templates.length, label: "UI templates", href: "/templates" },
    { value: prompts.length, label: "AI prompts", href: "/prompts" },
    { value: demos.length, label: "Parallax websites", href: "/templates#parallax-websites" },
  ];

  const featuredPrompts = prompts.filter((p) => !/portfolio|link-in-bio/.test(p.slug)).slice(0, 6);
  const pick = ["parallax-fashion", "parallax-pizza", "parallax-brew"];
  const featuredDemos = [...pick.map((slug) => demos.find((d) => d.slug === slug)).filter(Boolean), ...demos].filter(
    (d, i, all) => all.indexOf(d) === i
  ).slice(0, 3);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free coding notes, UI templates and AI website prompts",
    url: SITE,
    author: { "@type": "Person", name: "Ravindra Nath Jha", url: `${SITE}/about` },
    hasPart: stacks.map((stack) => ({
      "@type": "Course",
      name: `${stack.name} course notes`,
      url: `${SITE}/notes/${stack.slug}`,
      provider: { "@type": "Person", name: "Ravindra Nath Jha" },
    })),
  };

  return (
    <div className="hub">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />

      {/* Hero: what the site is, search, and size of the library */}
      <div className="hub-hero">
        <div className="hub-wrap hub-hero-grid">
          <div className="hub-hero-text">
            <span className="hub-badge">
              <Sparkles size={15} strokeWidth={2.2} aria-hidden="true" /> Free developer library · no sign-up
            </span>
            <h1>
              Learn to build modern websites, <span>step by step.</span>
            </h1>
            <p className="hub-lead">
              In-depth programming notes for React, Next.js, Java, Python and AI, plus copy-paste UI templates and tested AI
              prompts for building complete websites. Everything is free to read and use.
            </p>
            <HubSearch index={index} suggestions={["react hooks", "next.js routing", "pricing table", "3d", "portfolio"]} />
            <p className="hub-byline">
              Written by <Link href="/about">Ravindra Nath Jha</Link> · Full stack developer, M.Tech AI (IIT Jodhpur)
            </p>
          </div>

          <div className="hub-hero-art" aria-hidden="true">
            <div className="hub-art-card hub-art-a">
              <Image src={featuredDemos[0]?.image ?? "/demos/parallax-pizza/preview.jpg"} alt="" width={1440} height={900} sizes="420px" preload />
            </div>
            <div className="hub-art-card hub-art-b">
              <Image src={`/assets/images/prompts/${featuredPrompts[0].slug}.png`} alt="" width={1280} height={800} sizes="320px" />
            </div>
            <div className="hub-art-note">
              <span className="hub-art-icon">
                <BookOpen size={18} strokeWidth={2} />
              </span>
              <div>
                <strong>{lectureCount} lectures</strong>
                <small>React · Next.js · Java · Python · AI</small>
              </div>
            </div>
            <div className="hub-art-code">
              <span>{"<Link href=\"/notes\" />"}</span>
            </div>
          </div>
        </div>

        <div className="hub-wrap">
          <ul className="hub-stats">
            {stats.map((stat) => (
              <li key={stat.label}>
                <Link href={stat.href}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Courses */}
      <section className="hub-section" aria-labelledby="hub-courses">
        <div className="hub-wrap">
          <div className="hub-head">
            <div>
              <span className="svc-eyebrow">Free courses</span>
              <h2 id="hub-courses">
                Pick a course and <span>start reading</span>
              </h2>
              <p>Each course is a sequence of long-form lectures with runnable code, common mistakes and practice questions.</p>
            </div>
            <Link href="/notes" className="hub-more">
              All notes <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
          <div className="hub-courses">
            {stacks.map((stack) => {
              const hours = Math.max(1, Math.round(stack.lectures.reduce((s, l) => s + minutes(l), 0) / 60));
              return (
                <Link key={stack.slug} href={`/notes/${stack.slug}`} className="hub-course">
                  <span className="hub-course-icon">
                    <i className={stack.icon} style={{ color: stack.iconColor === "#ffffff" ? "#fff" : stack.iconColor }} aria-hidden="true" />
                  </span>
                  <span className="hub-course-badge">{stack.badge}</span>
                  <strong>{stack.name}</strong>
                  <span className="hub-course-meta">
                    <span>
                      <BookOpen size={14} strokeWidth={2} aria-hidden="true" /> {stack.lectures.length} lectures
                    </span>
                    <span>
                      <Clock size={14} strokeWidth={2} aria-hidden="true" /> {hours}+ hrs
                    </span>
                  </span>
                  <span className="hub-course-go">
                    Start course <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <LatestNotes />

      {/* Parallax websites */}
      <section className="hub-section hub-dark" aria-labelledby="hub-demos">
        <div className="hub-wrap">
          <div className="hub-head">
            <div>
              <span className="svc-eyebrow">Parallax websites</span>
              <h2 id="hub-demos">
                Complete websites you can <span>open and study</span>
              </h2>
              <p>Full scroll-animated sites built with GSAP and plain HTML, each with the prompt to rebuild it.</p>
            </div>
            <Link href="/templates#parallax-websites" className="hub-more hub-more-light">
              All {demos.length} websites <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
          <div className="hub-demos">
            {featuredDemos.map((demo) => (
              <a key={demo.slug} href={demo.href} target="_blank" rel="noopener noreferrer" className="hub-demo">
                <span className="hub-demo-shot">
                  <Image src={demo.image} alt={`${demo.name} parallax website preview`} width={1440} height={900} sizes="(max-width: 900px) 100vw, 33vw" />
                </span>
                <span className="hub-demo-cat">{demo.category}</span>
                <strong>{demo.name}</strong>
                <span className="hub-demo-go">
                  Open website <ArrowUpRight size={15} strokeWidth={2.2} aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* AI prompts */}
      <section className="hub-section" aria-labelledby="hub-prompts">
        <div className="hub-wrap">
          <div className="hub-head">
            <div>
              <span className="svc-eyebrow">AI website prompts</span>
              <h2 id="hub-prompts">
                Build a full website <span>from one prompt</span>
              </h2>
              <p>Detailed prompts for Claude, ChatGPT, Cursor and v0, with the tech stack, every section and follow-up prompts.</p>
            </div>
            <Link href="/prompts" className="hub-more">
              All {prompts.length} prompts <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
          <div className="hub-prompts">
            {featuredPrompts.map((prompt) => (
              <Link key={prompt.slug} href={`/prompts/${prompt.slug}`} className="hub-prompt">
                <span className="hub-prompt-shot">
                  <Image src={`/assets/images/prompts/${prompt.slug}.png`} alt={`${prompt.name} built from this prompt`} width={1280} height={800} sizes="(max-width: 900px) 100vw, 33vw" />
                </span>
                <span className="hub-prompt-body">
                  <span className="hub-demo-cat">{prompt.industry}</span>
                  <strong>{prompt.name}</strong>
                  <span className="hub-prompt-desc">{prompt.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Templates by category */}
      <section className="hub-section hub-tint" aria-labelledby="hub-templates">
        <div className="hub-wrap">
          <div className="hub-head">
            <div>
              <span className="svc-eyebrow">UI templates</span>
              <h2 id="hub-templates">
                Copy-paste components <span>with live previews</span>
              </h2>
              <p>Every template includes the full HTML, CSS and JavaScript and a step-by-step explanation of how it works.</p>
            </div>
            <Link href="/templates" className="hub-more">
              Browse templates <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
          <div className="hub-cats">
            {CATEGORIES.map((category, i) => {
              const Icon = [Layers, Sparkles, Wand2, Code2, BookOpen][i % 5];
              const count = templates.filter((t) => t.category === category.id).length;
              return (
                <Link key={category.id} href="/templates" className="hub-cat">
                  <span className="hub-cat-icon">
                    <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
                  </span>
                  <strong>{category.label}</strong>
                  <span>{category.description}</span>
                  <em>{count} templates</em>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who writes this */}
      <section className="hub-section" aria-label="About the author">
        <div className="hub-wrap hub-narrow">
          <AuthorBox label="Who writes this site" />
          <div className="hub-work">
            <div>
              <h2>Need a website or app built?</h2>
              <p>I also take on selected freelance projects: web and mobile apps, AI features and performance work.</p>
            </div>
            <div className="hub-work-links">
              <Link href="/projects" className="hub-btn hub-btn-ghost">
                See my projects
              </Link>
              <Link href="/contact" className="hub-btn">
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
