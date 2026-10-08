export const lecture15 = {
  slug: "lecture-15",
  number: 15,
  title: "Complete Next.js Course — Lecture 15: Databases End to End — Drizzle, Prisma & MongoDB",
  summary: "Connect a real database to Next.js 16: choosing a database and host, connection management for dev hot-reload and serverless, Drizzle ORM schema and migrations, type-safe queries, joins, transactions, pagination and search, caching queries with 'use cache' and tags, CRUD with Server Actions, preventing SQL injection and N+1 queries, plus Prisma and MongoDB/Mongoose equivalents.",
  readTime: "33 min read",
  difficulty: "Advanced",
  date: "2026-10-08",
  sections: [
    {
      heading: "1. Where the Database Fits in a Next.js App",
      content: `In earlier lectures we called functions like \`getPosts()\` and \`db.post.create()\`. This lecture builds the real thing behind them.
The architecture we'll use:
• **Database** — PostgreSQL (or MongoDB) running on a managed host.
• **ORM / query builder** — type-safe code to read and write data (Drizzle, Prisma or Mongoose).
• **Data Access Layer** (\`lib/data/*\`, Lecture 12) — the only place that imports the database client. It verifies sessions, checks permissions and returns safe DTOs.
• **Server Components** call DAL functions to **read**; **Server Actions** call them to **write**.
• **Caching** wraps expensive reads with \`"use cache"\` and tags them so writes can invalidate them (Lecture 7).
Because all of this runs on the server, there's **no REST API to build** for your own UI, and database credentials never reach the browser.`
    },
    {
      heading: "2. Choosing a Database and a Host",
      content: `**SQL vs. document database:**
• **PostgreSQL** — relational, strong consistency, joins, constraints, transactions, JSON columns when you need flexibility. The safest default for most apps.
• **MySQL / MariaDB** — relational, widely hosted, very similar trade-offs.
• **MongoDB** — document database; flexible schemas, natural fit for nested data and for teams coming from the MERN stack.
• **SQLite** — a file-based database; perfect for local development, prototypes and small single-server apps (also via hosted variants like Turso).
**Managed hosts** (no servers to maintain): **Neon**, **Supabase**, **Vercel Marketplace Postgres** providers, **AWS RDS**, **PlanetScale**, **MongoDB Atlas**.
**Choosing an access layer:**
• **Drizzle ORM** — SQL-like, lightweight, schema in TypeScript/JavaScript, excellent serverless support. Used for the main examples here.
• **Prisma ORM** — schema language + generated client, great developer experience and tooling (Prisma Studio).
• **Mongoose** — the classic ODM for MongoDB with schemas and validation.
• **Raw drivers** (\`pg\`, \`mysql2\`, \`mongodb\`) — maximum control, more boilerplate.`
    },
    {
      heading: "3. Connection Management: Hot Reload and Serverless",
      content: `Two connection problems catch almost every team:
**1. Development hot reload.** Every time you save a file, Next.js re-evaluates modules. If your database module creates a new connection pool each time, you quickly hit "too many connections". **Fix:** store the client on \`globalThis\` in development so it's reused across reloads.
**2. Serverless scaling.** On serverless platforms, each function instance opens its own connections. A traffic spike can create hundreds of instances and exhaust the database's connection limit. **Fixes:**
• Use your host's **connection pooler** (e.g. a pooled connection string, PgBouncer, Supabase Supavisor).
• Or an **HTTP / WebSocket driver** designed for serverless (e.g. Neon's serverless driver).
• Keep pool sizes small (\`max: 5–10\`) per instance.
Also: keep the database **in the same region** as your server functions — a cross-continent query adds 100–200ms to every request.`,
      codeSnippet: `// lib/db/index.js — one pool, reused across hot reloads
import "server-only";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const globalForDb = globalThis;

const pool =
  globalForDb.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL, // use the POOLED url in production
    max: 10,
  });

if (process.env.NODE_ENV !== "production") globalForDb.pgPool = pool;

export const db = drizzle({ client: pool });`
    },
    {
      heading: "4. Setting Up Drizzle ORM with PostgreSQL",
      content: `Install the ORM, the Postgres driver and \`drizzle-kit\` (the CLI for migrations), add your connection string to \`.env.local\`, and create a config file that tells drizzle-kit where your schema lives and where to write migrations.
For a free cloud database, create a project on Neon or Supabase and copy its connection string. For local development, Postgres in Docker works well: \`docker run -e POSTGRES_PASSWORD=dev -p 5432:5432 postgres\`.`,
      codeSnippet: `# Install
npm install drizzle-orm pg
npm install -D drizzle-kit

# .env.local (never committed)
DATABASE_URL=postgresql://user:password@host:5432/portfolio

// drizzle.config.mjs
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.js",
  out: "./drizzle",                 // generated SQL migrations
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL },
});

// package.json scripts
// "db:generate": "drizzle-kit generate",   create a migration from schema changes
// "db:migrate":  "drizzle-kit migrate",    apply pending migrations
// "db:push":     "drizzle-kit push",       sync schema directly (prototyping only)
// "db:studio":   "drizzle-kit studio"      browse data in a web UI`
    },
    {
      heading: "5. Designing the Schema",
      content: `With Drizzle, the schema is plain code. Each \`pgTable\` call defines a table; column helpers define types and constraints.
Schema design habits that pay off:
• **Primary keys** — UUIDs (\`defaultRandom()\`) are safe to expose in URLs; serial integers are compact but guessable.
• **\`notNull()\`** on everything that must exist; **\`unique()\`** where duplicates are a bug (emails, slugs).
• **Foreign keys** with \`references()\` and an \`onDelete\` rule, so orphaned rows can't exist.
• **Timestamps** — \`createdAt\` / \`updatedAt\` on every table; you'll want them for sorting and debugging.
• **Indexes** on columns you filter or sort by often (\`authorId\`, \`publishedAt\`, \`slug\`).`,
      codeSnippet: `// lib/db/schema.js
import { pgTable, uuid, text, varchar, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    published: boolean("published").notNull().default(false),
    likes: integer("likes").notNull().default(0),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("posts_author_idx").on(table.authorId),
    index("posts_created_idx").on(table.createdAt),
  ]
);`
    },
    {
      heading: "6. Migrations: Evolving the Schema Safely",
      content: `A **migration** is a versioned SQL file that changes the database schema — create a table, add a column, add an index. Migrations are committed to git, so every environment (your laptop, staging, production) goes through the same changes in the same order.
The workflow:
1. Edit \`schema.js\` (e.g. add a \`coverImage\` column).
2. Run \`npm run db:generate\` → drizzle-kit compares the schema with previous migrations and writes a new SQL file into \`drizzle/\`.
3. **Read the generated SQL** — especially for renames and drops, which can lose data.
4. Run \`npm run db:migrate\` to apply it locally; commit the file.
5. In production, run migrations **before** the new code starts serving traffic (a release step in CI or your host's build command).
\`drizzle-kit push\` skips migration files and syncs the schema directly — handy while prototyping, but don't use it on production data.
**Safe changes:** add nullable columns or columns with defaults first, deploy code that writes them, backfill, then add \`NOT NULL\`. Never rename a column in one step while old code is still running.`,
      codeSnippet: `# After adding  coverImage: text("cover_image")  to posts
npm run db:generate
# → drizzle/0003_add_cover_image.sql
#   ALTER TABLE "posts" ADD COLUMN "cover_image" text;

npm run db:migrate     # apply locally, then commit the SQL file

# Production build command (example)
# "build": "drizzle-kit migrate && next build"`
    },
    {
      heading: "7. Type-Safe Queries: Select, Insert, Update, Delete",
      content: `Drizzle's query builder reads like SQL, so what you write is what runs. Filters come from \`drizzle-orm\` helpers: \`eq\`, \`ne\`, \`and\`, \`or\`, \`gt\`, \`lt\`, \`like\`, \`ilike\` (case-insensitive), \`inArray\`, \`isNull\`, and \`desc\`/\`asc\` for ordering.
• **Select only the columns you need** — less data over the wire and no accidental leaks (never select \`passwordHash\` for display).
• **\`.returning()\`** gives back inserted or updated rows in one round trip (PostgreSQL).
• All values are sent as **parameters**, so these queries are safe from SQL injection.`,
      codeSnippet: `// lib/data/posts.js
import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";

// SELECT id, slug, title, created_at FROM posts WHERE published = true ORDER BY created_at DESC LIMIT 10
export function getLatestPosts() {
  return db
    .select({ id: posts.id, slug: posts.slug, title: posts.title, createdAt: posts.createdAt })
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt))
    .limit(10);
}

export async function getPostBySlug(slug) {
  const [post] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return post ?? null;
}

export async function createPost({ title, slug, body, authorId }) {
  const [post] = await db.insert(posts).values({ title, slug, body, authorId }).returning();
  return post;
}

export async function updatePost(id, authorId, data) {
  const [post] = await db
    .update(posts)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(posts.id, id), eq(posts.authorId, authorId))) // only the author's own post
    .returning();
  return post ?? null;
}

export function deletePost(id, authorId) {
  return db.delete(posts).where(and(eq(posts.id, id), eq(posts.authorId, authorId)));
}`
    },
    {
      heading: "8. Joins and Avoiding the N+1 Problem",
      content: `The **N+1 problem**: you fetch 20 posts (1 query), then loop and fetch each post's author (20 more queries). It's invisible in development with 3 rows and painfully slow in production.
**Fix:** fetch related data in **one query** with a join, or in **two queries** (all posts, then all their authors with \`inArray\`) and combine in memory.
Drizzle also offers a **relational query API** (\`db.query.posts.findMany({ with: { author: true } })\`) once you define relations — check the Drizzle docs for the version you install, as this API has evolved.`,
      codeSnippet: `import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts, users } from "@/lib/db/schema";

// ❌ N+1: one query for posts + one per post for its author
// const list = await db.select().from(posts);
// for (const p of list) p.author = await getUser(p.authorId);

// ✅ One query with a join
export function getPostsWithAuthors() {
  return db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      authorName: users.name,          // only safe author fields
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt));
}`
    },
    {
      heading: "9. Transactions: All or Nothing",
      content: `A **transaction** groups several writes so they either **all succeed or all fail**. Use one whenever a partial write would leave inconsistent data: transferring credits, placing an order and decrementing stock, creating a user and their default workspace.
Inside \`db.transaction(async (tx) => { ... })\`, use \`tx\` instead of \`db\`. If the callback throws, everything is rolled back.
Keep transactions **short** — no slow external API calls inside them, because they hold database locks.`,
      codeSnippet: `// lib/data/orders.js
import "server-only";
import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, products } from "@/lib/db/schema";

export async function placeOrder(userId, productId, quantity) {
  return db.transaction(async (tx) => {
    // Decrement stock only if enough is available (atomic check + update)
    const [product] = await tx
      .update(products)
      .set({ stock: sql\`\${products.stock} - \${quantity}\` })
      .where(and(eq(products.id, productId), gte(products.stock, quantity)))
      .returning({ id: products.id, price: products.price });

    if (!product) throw new Error("Out of stock"); // → rollback

    const [order] = await tx
      .insert(orders)
      .values({ userId, productId, quantity, total: product.price * quantity })
      .returning();

    return order;
  });
}`
    },
    {
      heading: "10. Pagination and Search",
      content: `Never load an entire table into a page. Two pagination styles:
• **Offset pagination** (\`LIMIT 10 OFFSET 20\`) — simple, supports "page 3 of 12", but gets slow on deep pages and can skip/duplicate rows when data changes.
• **Cursor (keyset) pagination** (\`WHERE created_at < :lastSeen\`) — fast at any depth and stable; ideal for feeds and infinite scroll.
For **search**, \`ilike\` works for small tables. For real search across large text, use PostgreSQL **full-text search** (\`to_tsvector\` / \`to_tsquery\`) or a search service (Meilisearch, Algolia, Typesense).
Read \`page\` and \`q\` from \`searchParams\` (a Promise) and **validate** them — they come straight from the URL.`,
      codeSnippet: `// lib/data/posts.js
import { and, count, desc, eq, ilike, lt } from "drizzle-orm";

const PAGE_SIZE = 10;

// Offset pagination with search
export async function searchPosts({ q = "", page = 1 }) {
  const where = and(eq(posts.published, true), q ? ilike(posts.title, "%" + q + "%") : undefined);

  const [rows, [{ total }]] = await Promise.all([
    db.select().from(posts).where(where).orderBy(desc(posts.createdAt))
      .limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(posts).where(where),
  ]);

  return { rows, total, pages: Math.ceil(total / PAGE_SIZE) };
}

// Cursor pagination for an infinite feed
export function getFeedPage(cursor) {
  return db.select().from(posts)
    .where(cursor ? lt(posts.createdAt, new Date(cursor)) : undefined)
    .orderBy(desc(posts.createdAt))
    .limit(PAGE_SIZE);
}

// app/blog/page.js
// const { q = "", page = "1" } = await searchParams;
// const result = await searchPosts({ q, page: Math.max(1, Number(page) || 1) });`
    },
    {
      heading: "11. Caching Database Reads with \"use cache\" and Tags",
      content: `Database reads are the most common thing worth caching. With Cache Components (Lecture 7):
• Wrap **shared, public** reads in \`"use cache"\` with a \`cacheLife\` profile and \`cacheTag\`.
• **Writes** call \`updateTag\` (in Server Actions, for read-your-writes) or \`revalidateTag(tag, "max")\` (e.g. from a webhook).
• **Never cache per-user private data under a shared key.** If a read depends on the user, pass the user ID as an argument (it becomes part of the cache key) — or don't cache it.
• Results must be **serializable** — Drizzle returns plain objects, so this works out of the box. Dates are serializable too.
Without Cache Components, use \`unstable_cache\` with the same \`tags\` and \`revalidate\` ideas, or rely on route-level ISR.`,
      codeSnippet: `// lib/data/posts.js
import { cacheLife, cacheTag } from "next/cache";

export async function getPublishedPost(slug) {
  "use cache";
  cacheLife("days");
  cacheTag("posts", "post-" + slug);
  const [post] = await db.select().from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.published, true)))
    .limit(1);
  return post ?? null;
}

export async function getPostList() {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");
  return getPostsWithAuthors();
}`
    },
    {
      heading: "12. CRUD with Server Actions",
      content: `Writes go through Server Actions that: **authenticate → validate → authorize → write → revalidate → respond**. This is the full stack in one function — no API route, no client fetch code.`,
      codeSnippet: `// app/actions/posts.js
"use server";
import { z } from "zod";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { createPost, updatePost, deletePost } from "@/lib/data/posts";

const PostSchema = z.object({
  title: z.string().trim().min(3).max(200),
  body: z.string().trim().min(20),
});

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export async function createPostAction(prevState, formData) {
  const { userId } = await verifySession();                    // 1. authenticate
  const parsed = PostSchema.safeParse(Object.fromEntries(formData)); // 2. validate
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  let post;
  try {
    post = await createPost({ ...parsed.data, slug: slugify(parsed.data.title), authorId: userId });
  } catch (err) {
    if (err.code === "23505") return { errors: { title: ["A post with this title already exists"] } }; // unique violation
    throw err;
  }

  updateTag("posts");                                          // 3. revalidate
  redirect("/blog/" + post.slug);                              // 4. respond
}

export async function deletePostAction(postId) {
  const { userId } = await verifySession();
  await deletePost(postId, userId);                            // WHERE id AND author_id → authorization
  updateTag("posts");
}`
    },
    {
      heading: "13. Security: SQL Injection and Least Privilege",
      content: `• **SQL injection** happens when user input is concatenated into a SQL string: \`"SELECT * FROM users WHERE email = '" + email + "'"\`. An attacker sends \`' OR '1'='1\` and reads every row. ORMs and query builders **parameterize** values automatically. When you write raw SQL in Drizzle, use the \`sql\` tagged template — interpolated values become parameters. **Never** use \`sql.raw()\` with user input.
• **Authorization in the query** — include ownership in the \`WHERE\` clause (\`id = :id AND author_id = :userId\`) so a forged ID can't touch another user's data.
• **Least-privilege database users** — the app's runtime user shouldn't be able to drop tables; use a separate, more privileged user for migrations.
• **Secrets** — \`DATABASE_URL\` is a server-only env var (no \`NEXT_PUBLIC_\`), never logged, never committed.
• **Backups** — enable automated backups and point-in-time recovery on your host, and test a restore once.`,
      codeSnippet: `import { sql } from "drizzle-orm";

// ✅ Safe: the value is sent as a parameter ($1)
const rows = await db.execute(sql\`SELECT id, title FROM posts WHERE title ILIKE \${"%" + q + "%"}\`);

// ❌ Dangerous: user input becomes part of the SQL text
// await db.execute(sql.raw("SELECT * FROM posts WHERE title LIKE '%" + q + "%'"));`
    },
    {
      heading: "14. The Same Ideas with Prisma",
      content: `**Prisma** is the other very popular ORM. Concepts map one-to-one:
• **Schema** — written in \`schema.prisma\` using Prisma's own language (models, fields, relations, \`@unique\`, \`@default\`, \`@relation\`).
• **Migrations** — \`npx prisma migrate dev\` (development) creates and applies SQL migrations; \`npx prisma migrate deploy\` applies them in production.
• **Client** — a generated, fully typed client: \`prisma.post.findMany({ where, select, include, orderBy, take, skip })\`, \`create\`, \`update\`, \`delete\`, and \`prisma.$transaction(...)\`.
• **Relations** — \`include: { author: true }\` loads related records without N+1.
• **Prisma Studio** — \`npx prisma studio\` to browse data.
• Use the same **\`globalThis\` singleton** pattern for the client in development.
**Version note:** Prisma 7 changed how the client is generated and configured (generator output path, a \`prisma.config\` file and driver adapters). Follow the official Prisma + Next.js guide for the exact setup of the version you install — the query API below is unchanged.`,
      codeSnippet: `// prisma/schema.prisma (models)
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        String   @id @default(uuid())
  slug      String   @unique
  title     String
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId  String
  createdAt DateTime @default(now())
  @@index([authorId])
}

// Queries (lib/data/posts.js) — prisma is your configured client singleton
const latest = await prisma.post.findMany({
  where: { published: true },
  select: { id: true, slug: true, title: true, author: { select: { name: true } } },
  orderBy: { createdAt: "desc" },
  take: 10,
});`
    },
    {
      heading: "15. MongoDB with Mongoose (for MERN Developers)",
      content: `If you come from the MERN stack, MongoDB works perfectly with Next.js — Next.js simply replaces the Express server.
Key differences from a long-running Express app:
• **Cache the connection** on \`globalThis\` — otherwise hot reload and serverless instances open new connections constantly.
• **Avoid model recompilation errors** ("Cannot overwrite model once compiled") by reusing \`mongoose.models.Post\` if it exists.
• **Convert documents to plain objects** with \`.lean()\` before passing them to Client Components or \`"use cache"\` — Mongoose documents have methods and \`ObjectId\`s that aren't serializable. Convert \`_id\` to a string.
• Use **MongoDB Atlas** with network access configured for your host.`,
      codeSnippet: `// lib/mongodb.js
import "server-only";
import mongoose from "mongoose";

const cached = globalThis.mongoose ?? (globalThis.mongoose = { conn: null, promise: null });

export async function connectDB() {
  if (cached.conn) return cached.conn;
  cached.promise ??= mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  cached.conn = await cached.promise;
  return cached.conn;
}

// models/Post.js
import mongoose from "mongoose";
const PostSchema = new mongoose.Schema(
  { title: { type: String, required: true }, slug: { type: String, unique: true }, published: Boolean },
  { timestamps: true }
);
export default mongoose.models.Post || mongoose.model("Post", PostSchema);

// lib/data/posts.js
export async function getLatestPosts() {
  await connectDB();
  const docs = await Post.find({ published: true }).sort({ createdAt: -1 }).limit(10).lean();
  return docs.map((d) => ({ ...d, _id: d._id.toString() })); // plain, serializable objects
}`
    },
    {
      heading: "16. Summary",
      content: `• The database sits behind a server-only **Data Access Layer**; Server Components read through it and Server Actions write through it.
• PostgreSQL is a safe default; MongoDB suits document-shaped data and MERN teams. Use a managed host in the same region as your app.
• Reuse one connection pool via \`globalThis\` in development; use pooled connections or serverless drivers in production.
• Drizzle: schema in code, \`drizzle-kit generate\` + \`migrate\` for versioned migrations, type-safe \`select/insert/update/delete\` with \`.returning()\`.
• Avoid N+1 with joins; use transactions for all-or-nothing writes; paginate with offset or cursors; validate URL params.
• Cache shared reads with \`"use cache"\` + \`cacheTag\`, invalidate with \`updateTag\`/\`revalidateTag\`; never share private data under one cache key.
• Parameterized queries prevent SQL injection; put ownership in the \`WHERE\` clause; use least-privilege DB users and backups.
• Prisma and Mongoose follow the same architecture with different syntax.
**Next lecture:** content-driven sites — MDX, headless CMS integration and Draft Mode previews.`
    }
  ]
};
