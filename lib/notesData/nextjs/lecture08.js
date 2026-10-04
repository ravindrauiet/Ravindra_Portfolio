export const lecture08 = {
  slug: "lecture-8",
  number: 8,
  title: "Complete Next.js Course — Lecture 8: Server Actions, Forms & Mutations",
  summary: "Mutate data without writing API routes: Server Functions and the 'use server' directive, progressive-enhancement forms, calling actions from Client Components, Zod validation, useActionState, useFormStatus, revalidation and redirects after mutations, optimistic UI with useOptimistic, the next/form component, and Server Action security.",
  readTime: "30 min read",
  difficulty: "Intermediate",
  date: "2026-10-04",
  sections: [
    {
      heading: "1. What Are Server Actions?",
      content: `A **Server Function** is an async function that runs on the server but can be **called from the client** — from a form, a button click or any event handler. When used for mutations (create, update, delete), it's called a **Server Action**.
Under the hood, Next.js creates a hidden **POST endpoint** for each action. When the client calls it, Next.js sends the arguments over the network, runs the function on the server, and returns the result — and can return **updated UI** in the same round trip.
What this replaces:
• Writing an API route (\`/api/todos\`) for every mutation.
• Client-side \`fetch\` + JSON parsing + loading/error state boilerplate.
• Manually re-fetching data after the change.
**Mental model:** a Server Action is "an API endpoint you call like a normal function".`
    },
    {
      heading: "2. Creating Server Functions with \"use server\"",
      content: `Two ways to declare them:
• **Inline**, inside a Server Component: put \`"use server"\` at the top of the async function body. Handy for one-off actions tied to a single page.
• **Module-level**: put \`"use server"\` at the top of a file (e.g. \`app/actions.js\`). **Every export** becomes a Server Function. This is the standard approach, and the **only** way to use actions from Client Components.
Rules:
• Server Functions must be **async**.
• Arguments and return values must be **serializable** (plain data, FormData, Dates, etc.).
• Don't confuse \`"use server"\` with server-only code: \`"use server"\` **exposes** a function to the client as a callable endpoint. Plain server code (no directive) is never callable from the browser.`,
      codeSnippet: `// app/actions.js — module-level: every export is a Server Function
"use server";

import { db } from "@/lib/db";

export async function createTodo(formData) {
  const title = formData.get("title");
  await db.todo.create({ data: { title } });
}

export async function deleteTodo(id) {
  await db.todo.delete({ where: { id } });
}

// app/page.js — inline Server Function in a Server Component
export default function Page() {
  async function subscribe(formData) {
    "use server";
    await db.subscriber.create({ data: { email: formData.get("email") } });
  }

  return (
    <form action={subscribe}>
      <input type="email" name="email" required />
      <button type="submit">Subscribe</button>
    </form>
  );
}`
    },
    {
      heading: "3. Forms with Server Actions",
      content: `React extends the HTML \`<form>\` element so the \`action\` prop accepts a function. When submitted, the action receives a **\`FormData\`** object with every named field.
Big advantage — **progressive enhancement**: forms rendered by Server Components **work before JavaScript loads** (or if it fails entirely). The browser submits a normal POST; once JS hydrates, submissions happen without a page reload.
Reading FormData:
• \`formData.get("name")\` — one value (string or File).
• \`formData.getAll("tags")\` — all values for checkboxes/multi-select.
• \`Object.fromEntries(formData)\` — quick object of all fields (watch out for multi-value fields).
• Pass extra arguments with \`.bind\`: \`updateUser.bind(null, userId)\` — the bound value is sent along (encrypted) and appears as the first argument.`,
      codeSnippet: `// app/users/[id]/edit/page.js
import { updateUser } from "@/app/actions";

export default async function EditUser({ params }) {
  const { id } = await params;
  const updateUserWithId = updateUser.bind(null, id);   // pre-fill the id argument

  return (
    <form action={updateUserWithId}>
      <input name="name" placeholder="Full name" required />
      <select name="role">
        <option value="viewer">Viewer</option>
        <option value="editor">Editor</option>
      </select>
      <label><input type="checkbox" name="notify" /> Email me updates</label>
      <button type="submit">Save</button>
    </form>
  );
}

// app/actions.js
"use server";
export async function updateUser(userId, formData) {
  const name = formData.get("name");
  const role = formData.get("role");
  const notify = formData.get("notify") === "on";
  await db.user.update({ where: { id: userId }, data: { name, role, notify } });
}`
    },
    {
      heading: "4. Calling Actions from Client Components & Event Handlers",
      content: `Client Components can't define Server Functions, but they can **import** them from a \`"use server"\` file and call them like any async function — from \`onClick\`, \`onChange\`, \`useEffect\`, anywhere.
Wrap calls that update UI in **\`startTransition\`** (from \`useTransition\`) so React can show pending state and keep the UI responsive.`,
      codeSnippet: `// app/components/DeleteButton.jsx
"use client";
import { useTransition } from "react";
import { deleteTodo } from "@/app/actions";

export default function DeleteButton({ id }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this todo?")) return;
        startTransition(async () => {
          await deleteTodo(id);
        });
      }}
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}`
    },
    {
      heading: "5. Validating Input on the Server with Zod",
      content: `**Never trust input from the client.** HTML \`required\` and \`type="email"\` are a UX nicety — anyone can bypass them by calling the action directly. Validate on the server every time.
**Zod** is the most popular schema library: describe the shape once, then \`safeParse\` the form data. On failure, return the field errors so the form can display them.`,
      codeSnippet: `// npm install zod
// app/actions.js
"use server";
import { z } from "zod";

const SignupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function signup(prevState, formData) {
  const parsed = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors, // { email: ["Please enter a valid email"] }
      values: { name: formData.get("name"), email: formData.get("email") },
    };
  }

  const exists = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return { errors: { email: ["This email is already registered"] } };

  await createUser(parsed.data);
  return { success: true };
}`
    },
    {
      heading: "6. Showing Errors & Pending State with useActionState",
      content: `\`useActionState\` (from **\`react\`**) connects a form to an action that returns state — validation errors, success messages, returned data.
\`const [state, formAction, pending] = useActionState(action, initialState)\`
• **\`state\`** — whatever the action last returned (starts as \`initialState\`).
• **\`formAction\`** — pass this to \`<form action={...}>\`.
• **\`pending\`** — \`true\` while the action runs.
Note the **action signature changes**: it now receives \`(prevState, formData)\` instead of just \`(formData)\`.
This keeps "expected errors" as **returned values** — no try/catch, no error boundary — exactly as recommended in Lecture 4.`,
      codeSnippet: `// app/signup/SignupForm.jsx
"use client";
import { useActionState } from "react";
import { signup } from "@/app/actions";

const initialState = { errors: {}, values: {} };

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  if (state.success) return <p>🎉 Account created! Check your inbox.</p>;

  return (
    <form action={formAction} noValidate>
      <input name="name" defaultValue={state.values?.name} placeholder="Name" />
      {state.errors?.name && <p className="error">{state.errors.name[0]}</p>}

      <input name="email" type="email" defaultValue={state.values?.email} placeholder="Email" />
      {state.errors?.email && <p className="error">{state.errors.email[0]}</p>}

      <input name="password" type="password" placeholder="Password" />
      {state.errors?.password && <p className="error">{state.errors.password[0]}</p>}

      <button type="submit" disabled={pending}>
        {pending ? "Creating account…" : "Sign up"}
      </button>
    </form>
  );
}`
    },
    {
      heading: "7. Reusable Submit Buttons with useFormStatus",
      content: `\`useFormStatus\` (from **\`react-dom\`**) gives any component **inside** a \`<form>\` access to that form's submission status — without passing props down.
It must be called from a component rendered **inside** the form (not the component that renders the \`<form>\` itself). This makes it perfect for a shared \`<SubmitButton>\` used across the whole app.`,
      codeSnippet: `// app/components/SubmitButton.jsx
"use client";
import { useFormStatus } from "react-dom";

export default function SubmitButton({ children, pendingText = "Saving…" }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? pendingText : children}
    </button>
  );
}

// Usage in any form (even one rendered by a Server Component)
// <form action={createTodo}>
//   <input name="title" />
//   <SubmitButton pendingText="Adding…">Add todo</SubmitButton>
// </form>`
    },
    {
      heading: "8. Updating the UI After a Mutation",
      content: `After changing data, the page must show the new state. Inside the Server Action, tell Next.js what changed:
• **\`updateTag(tag)\`** — expire cached data with that tag and show the fresh data to this user immediately (Cache Components / tagged data).
• **\`revalidatePath("/todos")\`** — invalidate everything cached for a path.
• **\`refresh()\`** — re-render the current route's Server Components without touching cached data (for uncached UI).
• **\`redirect("/todos")\`** — navigate somewhere else after success. Call it **after** revalidation and **outside** \`try/catch\` (it works by throwing).
Next.js returns the updated UI **in the same response** as the action result, so there's no extra request.`,
      codeSnippet: `// app/actions.js
"use server";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData) {
  let post;
  try {
    post = await db.post.create({ data: { title: formData.get("title") } });
  } catch (err) {
    return { error: "Could not save the post. Please try again." };
  }

  updateTag("posts");          // cached post lists are fresh for this user
  revalidatePath("/admin");    // the admin overview too
  redirect("/blog/" + post.slug); // must be outside try/catch
}`
    },
    {
      heading: "9. Optimistic UI with useOptimistic",
      content: `Even fast servers take 100–300ms. **Optimistic updates** show the expected result **immediately** and reconcile when the server responds — the app feels instant.
\`useOptimistic(state, updateFn)\` (from \`react\`) returns a temporary state that's only shown **while an action is pending**. When the action finishes and real data arrives, React switches back to the real state automatically — so if the server fails, the optimistic item simply disappears.`,
      codeSnippet: `// app/todos/TodoList.jsx
"use client";
import { useOptimistic, useRef } from "react";
import { createTodo } from "@/app/actions";

export default function TodoList({ todos }) {
  const formRef = useRef(null);
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (current, newTitle) => [...current, { id: "temp-" + Date.now(), title: newTitle, pending: true }]
  );

  async function action(formData) {
    addOptimisticTodo(formData.get("title"));  // show instantly
    formRef.current?.reset();
    await createTodo(formData);                // server action (revalidates the list)
  }

  return (
    <>
      <ul>
        {optimisticTodos.map((t) => (
          <li key={t.id} style={{ opacity: t.pending ? 0.5 : 1 }}>{t.title}</li>
        ))}
      </ul>
      <form ref={formRef} action={action}>
        <input name="title" required />
        <button type="submit">Add</button>
      </form>
    </>
  );
}`
    },
    {
      heading: "10. next/form: Search Forms That Navigate",
      content: `Not every form mutates data. Search and filter forms should **navigate** to a URL with query parameters (\`/search?q=react\`) so results are shareable and bookmarkable.
The **\`<Form>\`** component from \`next/form\` does this with client-side navigation: when \`action\` is a **string**, submitting appends the inputs as search params and navigates there — **prefetching** the target's loading UI and keeping shared layouts mounted, while still working without JavaScript.
When \`action\` is a **function**, \`<Form>\` behaves like a normal React form with a Server Action.`,
      codeSnippet: `// app/components/SearchBar.jsx — works in Server Components too
import Form from "next/form";

export default function SearchBar() {
  return (
    <Form action="/search">
      <input name="q" placeholder="Search notes…" />
      <button type="submit">Search</button>
    </Form>
  );
}

// app/search/page.js — reads ?q=
export default async function SearchPage({ searchParams }) {
  const { q = "" } = await searchParams;
  const results = await searchNotes(q);
  return (
    <>
      <h1>Results for "{q}"</h1>
      <ul>{results.map((r) => <li key={r.id}>{r.title}</li>)}</ul>
    </>
  );
}`
    },
    {
      heading: "11. Working with Cookies in Server Actions",
      content: `Server Actions can **read, set and delete cookies** with \`cookies()\` from \`next/headers\` (awaited). Setting or deleting a cookie in an action also re-renders the current page on the server so the UI reflects the new value — useful for theme switches, language selection, dismissing banners and login/logout.`,
      codeSnippet: `// app/actions.js
"use server";
import { cookies } from "next/headers";

export async function setTheme(theme) {
  const cookieStore = await cookies();
  cookieStore.set("theme", theme, {
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
  });
}

export async function dismissBanner() {
  (await cookies()).set("banner-dismissed", "1", { maxAge: 60 * 60 * 24 * 30 });
}`
    },
    {
      heading: "12. Server Action Security: Treat Every Action as a Public API",
      content: `Because each action is reachable by a **direct POST request**, apply the same rules as for any public endpoint:
• **Authenticate and authorize inside every action.** Don't rely on the page being protected or on \`proxy.js\` — a refactor could change which routes it covers. Check the session and the user's permission for **this specific record**.
• **Validate all input** (section 5) — types, lengths, formats, ownership of IDs.
• **Return only what's needed** — never return full database records with sensitive fields.
• **Rate-limit** expensive or abuse-prone actions (signups, emails, payments).
**Built-in protections:**
• Action IDs are **encrypted and non-deterministic**, and unused actions are removed from the client bundle.
• Only **POST** can invoke actions, and Next.js compares the **Origin** and **Host** headers to block cross-site requests (CSRF). Behind a reverse proxy, list trusted domains in \`serverActions.allowedOrigins\`.
• Values captured in closures or \`.bind\` are **encrypted** before going to the client — but don't rely on encryption alone for secrets.
• Request bodies are limited to **1 MB** by default — raise \`serverActions.bodySizeLimit\` for file uploads.`,
      codeSnippet: `// app/actions.js
"use server";
import { z } from "zod";
import { verifySession } from "@/lib/dal";       // see Lecture 12

const Id = z.string().uuid();

export async function deletePost(postId) {
  const session = await verifySession();          // 1. authenticated?
  const id = Id.parse(postId);                    // 2. valid input?

  const post = await db.post.findUnique({ where: { id }, select: { authorId: true } });
  if (!post || post.authorId !== session.userId) { // 3. allowed for THIS record?
    throw new Error("Not authorized");
  }

  await db.post.delete({ where: { id } });
  return { ok: true };                            // 4. return minimal data
}

// next.config.mjs
// serverActions: { bodySizeLimit: "5mb", allowedOrigins: ["app.example.com"] }`
    },
    {
      heading: "13. Practical: A Complete Todo App (CRUD)",
      content: `A full create / toggle / delete todo list with Server Actions, validation, a reusable submit button and automatic UI updates through \`revalidatePath\`. The list itself is a Server Component that queries the database; only the small interactive controls are Client Components.`,
      codeSnippet: `// app/todos/actions.js
"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

const Title = z.string().trim().min(1, "Title is required").max(120);

export async function addTodo(prevState, formData) {
  const parsed = Title.safeParse(formData.get("title"));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  await db.todo.create({ data: { title: parsed.data } });
  revalidatePath("/todos");
  return { error: null };
}

export async function toggleTodo(id, done) {
  await db.todo.update({ where: { id }, data: { done } });
  revalidatePath("/todos");
}

export async function removeTodo(id) {
  await db.todo.delete({ where: { id } });
  revalidatePath("/todos");
}

// app/todos/AddTodoForm.jsx
"use client";
import { useActionState } from "react";
import { addTodo } from "./actions";
import SubmitButton from "@/app/components/SubmitButton";

export default function AddTodoForm() {
  const [state, formAction] = useActionState(addTodo, { error: null });
  return (
    <form action={formAction}>
      <input name="title" placeholder="What needs doing?" />
      <SubmitButton pendingText="Adding…">Add</SubmitButton>
      {state.error && <p className="error">{state.error}</p>}
    </form>
  );
}

// app/todos/page.js — Server Component
import { db } from "@/lib/db";
import AddTodoForm from "./AddTodoForm";
import { toggleTodo, removeTodo } from "./actions";

export default async function TodosPage() {
  const todos = await db.todo.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <main>
      <h1>Todos ({todos.filter((t) => !t.done).length} left)</h1>
      <AddTodoForm />
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <form action={toggleTodo.bind(null, t.id, !t.done)} style={{ display: "inline" }}>
              <button type="submit">{t.done ? "☑" : "☐"}</button>
            </form>
            <span style={{ textDecoration: t.done ? "line-through" : "none" }}>{t.title}</span>
            <form action={removeTodo.bind(null, t.id)} style={{ display: "inline" }}>
              <button type="submit" aria-label={"Delete " + t.title}>✕</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}`
    },
    {
      heading: "14. Summary",
      content: `• Server Actions are async functions marked \`"use server"\` that run on the server and are callable from forms and Client Components.
• Use module-level \`"use server"\` files for actions shared with Client Components; inline actions work inside Server Components.
• \`<form action={fn}>\` passes \`FormData\` and works without JavaScript (progressive enhancement); \`.bind\` adds extra arguments.
• Validate every input on the server (Zod) and return expected errors as values.
• \`useActionState\` gives \`state\`, \`formAction\` and \`pending\`; \`useFormStatus\` powers reusable submit buttons; \`useOptimistic\` makes updates feel instant.
• After mutating: \`updateTag\`, \`revalidatePath\`, \`refresh\` and \`redirect\` (outside try/catch).
• \`next/form\` handles search forms that navigate with query params.
• Treat every action as a public endpoint: authenticate, authorize per record, validate, rate-limit and return minimal data.
**Next lecture:** Route Handlers and Proxy — building APIs, webhooks and request-level logic.`
    }
  ]
};
