export const lecture22 = {
  slug: "lecture-22",
  number: 22,
  title: "Complete React Course — Module 7: Lecture 22: Data Fetching & Server State with TanStack Query",
  summary: "Learn why server state needs its own tool and how TanStack Query v5 manages it. Covers QueryClient setup and Devtools, useQuery and query keys, loading and error UI, caching with staleTime vs gcTime, refetching, useMutation with invalidateQueries, optimistic updates, paginated and infinite queries, and Suspense mode with useSuspenseQuery.",
  readTime: "32 min read",
  difficulty: "Advanced",
  date: "2026-10-08",
  sections: [
    {
      heading: "1. Server State vs Client State",
      content: `In the previous lecture we built multi-page apps with React Router v7. Those pages need data — products, orders, user profiles — and that data lives on a server. Before writing any code, it helps to separate two very different kinds of state.
**Client state** is owned by the browser: is the sidebar open, which tab is selected, what the user typed in a form, light or dark theme. Your app is the single source of truth, it is always up to date, and \`useState\`, \`useReducer\`, Context or Zustand handle it well.
**Server state** is owned by someone else — a database behind an API. Your component only holds a **snapshot** of it, and that snapshot has very different properties:
• It can become **out of date** without you knowing (another user edits the same order).
• It is fetched **asynchronously**, so you must handle loading and error states.
• Many components often need the **same** data, so you want to share and **cache** it instead of fetching it five times.
• It needs **refreshing** — after a mutation, when the user returns to the tab, or on a timer.
Treating server data as ordinary \`useState\` forces you to hand-build caching, deduplication, retries and refetching in every component. **TanStack Query** (formerly React Query) is a library whose only job is managing server state. This lecture uses **TanStack Query v5**.`
    },
    {
      heading: "2. Why Fetch-in-useEffect Does Not Scale",
      content: `The classic pattern is \`useState\` + \`useEffect\` + \`fetch\`. It works for a demo, but look at what the code below still gets wrong, even after we added an \`ignore\` flag to avoid race conditions:
• **No cache** — navigate away and back, and the spinner shows again even though we had the data seconds ago.
• **No deduplication** — if \`Header\` and \`ProductPage\` both call this hook, the same request goes out twice.
• **No background refresh** — the data never updates unless the component remounts.
• **No retries** — one flaky mobile network request and the user sees an error.
• **No way to update other components** — after you add a product, every list showing products is stale.
• **Boilerplate** — three pieces of state and a cleanup flag in every component that fetches anything.
You could write a custom hook that solves all of this, but you would be rebuilding a caching library. The React docs themselves recommend using a framework's data fetching or a client-side cache library instead of raw effects for real apps.`,
      codeSnippet: `// The "manual" way: works, but scales badly
import { useEffect, useState } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false; // prevents setting state from a stale request
    setLoading(true);

    fetch("https://dummyjson.com/products?limit=10")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((data) => { if (!ignore) setProducts(data.products); })
      .catch((err) => { if (!ignore) setError(err); })
      .finally(() => { if (!ignore) setLoading(false); });

    return () => { ignore = true; };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <ul>{products.map((p) => <li key={p.id}>{p.title}</li>)}</ul>;
}`
    },
    {
      heading: "3. Setup: QueryClient, QueryClientProvider & Devtools",
      content: `Install the library and its Devtools in your Vite project:
\`npm install @tanstack/react-query\`
\`npm install -D @tanstack/react-query-devtools\`
Two pieces are needed:
1. A **\`QueryClient\`** — the object that holds the cache. Create it **once**, outside your components, so it is not recreated on every render.
2. A **\`QueryClientProvider\`** — makes that client available to every component through context (exactly the pattern you learned in the Context lecture).
You can pass \`defaultOptions\` to the client to set app-wide defaults such as \`staleTime\` or \`retry\`.
**Devtools:** \`<ReactQueryDevtools />\` adds a floating button that opens a panel listing every query, its key, status (fresh, stale, fetching, inactive), its cached data and buttons to refetch, invalidate or reset it. It is the fastest way to understand what the cache is doing. By default the Devtools are only included in development builds (\`process.env.NODE_ENV === "development"\`), so you do not need to remove them before deploying.`,
      codeSnippet: `// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App.jsx";

// Create the client ONCE, outside any component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // treat data as fresh for 1 minute
      retry: 2,             // default is 3 retries on the client
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);`
    },
    {
      heading: "4. useQuery and Query Keys",
      content: `\`useQuery\` takes an options object with two required parts:
• **\`queryKey\`** — an **array** that uniquely identifies this data in the cache, such as \`["products"]\` or \`["product", 42]\`.
• **\`queryFn\`** — a function that returns a **Promise** which resolves with the data or **throws** on failure.
How query keys work:
• Same key anywhere in the app = same cache entry. Two components using \`["product", 42]\` share one request and one copy of the data (**deduplication**).
• Keys are compared **deeply**, so \`["products", { category: "phones", page: 1 }]\` is a valid key; object property order does not matter.
• **Every variable your \`queryFn\` uses must be in the key.** When \`category\` changes, the key changes, and TanStack Query automatically fetches and caches the new data. Think of the key like a \`useEffect\` dependency array.
• Keys are **hierarchical**: \`["products"]\` is a prefix of \`["products", "phones"]\`, which lets you invalidate a whole group later.
**Important:** \`fetch\` does not reject on HTTP 404 or 500. Check \`res.ok\` and throw yourself, otherwise TanStack Query thinks the request succeeded. The \`queryFn\` also receives an \`AbortSignal\`; pass it to \`fetch\` and outdated requests are cancelled automatically.`,
      codeSnippet: `// src/api/products.js
export async function fetchProducts({ category, signal }) {
  const url = category === "all"
    ? "https://dummyjson.com/products?limit=12"
    : "https://dummyjson.com/products/category/" + category + "?limit=12";
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Failed to load products (HTTP " + res.status + ")");
  const data = await res.json();
  return data.products;
}

// src/components/ProductGrid.jsx
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/products";

export function ProductGrid({ category }) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["products", { category }],      // category is in the key...
    queryFn: ({ signal }) => fetchProducts({ category, signal }), // ...because it's used here
  });

  if (isPending) return <p>Loading products...</p>;
  if (isError) return <p role="alert">{error.message}</p>;

  return (
    <ul>
      {data.map((p) => (
        <li key={p.id}>{p.title} — ₹{Math.round(p.price * 83)}</li>
      ))}
    </ul>
  );
}`
    },
    {
      heading: "5. Loading and Error UI: isPending vs isFetching",
      content: `A query has two independent pieces of status, and mixing them up is the most common beginner bug.
**\`status\`** — do we have data?
• \`"pending"\` → no data yet (\`isPending\` is true). Show a skeleton or spinner.
• \`"error"\` → the query failed (\`isError\`, \`error\`).
• \`"success"\` → data is available (\`isSuccess\`, \`data\`).
**\`fetchStatus\`** — is a request running right now?
• \`"fetching"\` (\`isFetching\`) — a request is in flight, including background refetches.
• \`"paused"\` — it wanted to fetch but the device is offline.
• \`"idle"\` — nothing is happening.
So a query can be \`success\` **and** \`fetching\` at the same time: you already have data on screen and a background refresh is running. Show the cached data and maybe a small "Updating…" hint, never a full-page spinner.
v5 naming note: \`isPending\` means "no data yet". \`isLoading\` still exists but means \`isPending && isFetching\` (the first load is actually running). Older tutorials from v4 used \`isLoading\` where v5 uses \`isPending\`.
**Retries:** by default a failed query is retried 3 times with increasing delay before \`isError\` becomes true, so errors can take a few seconds to appear. Expose \`refetch\` as a "Try again" button.`,
      codeSnippet: `import { useQuery } from "@tanstack/react-query";

function OrdersPanel() {
  const { data, isPending, isError, error, isFetching, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Could not load orders");
      return res.json();
    },
  });

  if (isPending) return <div className="skeleton">Loading orders...</div>;

  if (isError) {
    return (
      <div role="alert">
        <p>{error.message}</p>
        <button onClick={() => refetch()}>Try again</button>
      </div>
    );
  }

  return (
    <section>
      <h2>Your Orders {isFetching && <small>(updating...)</small>}</h2>
      <ul>
        {data.map((o) => <li key={o.id}>#{o.id} — ₹{o.total}</li>)}
      </ul>
    </section>
  );
}`
    },
    {
      heading: "6. Caching: staleTime vs gcTime",
      content: `These two settings control the cache, and interviewers love asking about them.
**\`staleTime\`** — how long data is considered **fresh**. Default: **0**.
• While data is fresh, TanStack Query serves it from the cache and does **not** refetch, even if a new component mounts with the same key.
• Once data is **stale**, it is still shown instantly from the cache, but a **background refetch** happens on triggers such as a new mount or window focus. This is the **stale-while-revalidate** pattern.
**\`gcTime\`** (garbage-collection time, called \`cacheTime\` before v5) — how long **unused** data stays in memory. Default: **5 minutes**.
• The timer starts only when **no component is using** the query (it becomes "inactive").
• If a component asks for it again before \`gcTime\` ends, cached data shows instantly. After that, it is deleted and the next mount starts from \`isPending\`.
A simple way to remember: **staleTime decides when to refetch; gcTime decides when to forget.**
Choosing values:
• Stock prices, chat: \`staleTime: 0\` plus a \`refetchInterval\`.
• Product catalogue, blog posts: \`staleTime\` of a few minutes.
• Countries list, config: \`staleTime: Infinity\` — fetch once per session.`,
      codeSnippet: `// Different freshness rules for different data
const { data: states } = useQuery({
  queryKey: ["indian-states"],
  queryFn: fetchStates,
  staleTime: Infinity,          // never goes stale: fetched once
  gcTime: 30 * 60 * 1000,       // keep 30 min after last use
});

const { data: cart } = useQuery({
  queryKey: ["cart"],
  queryFn: fetchCart,
  staleTime: 0,                 // default: refetch on every trigger
});

const { data: products } = useQuery({
  queryKey: ["products", { category: "laptops" }],
  queryFn: () => fetchProducts({ category: "laptops" }),
  staleTime: 5 * 60 * 1000,     // fresh for 5 minutes
});`
    },
    {
      heading: "7. Refetching: Automatic Triggers, Polling & Dependent Queries",
      content: `Stale queries refetch automatically on these triggers (all on by default):
• **\`refetchOnMount\`** — a new component using the query mounts.
• **\`refetchOnWindowFocus\`** — the user switches back to your browser tab. Surprising during development, very useful in production.
• **\`refetchOnReconnect\`** — the network comes back online.
Other tools:
• **\`refetchInterval\`** — polling, for example every 10 seconds for a delivery tracker. Pair with \`refetchIntervalInBackground\` if it must continue while the tab is hidden.
• **\`refetch()\`** — returned by \`useQuery\`; call it from a "Refresh" button.
• **\`enabled\`** — when \`false\`, the query does not run automatically. Use it for **dependent queries**, where one request needs data from another, or to wait until the user has typed something.
Remember: if \`staleTime\` has not elapsed, these triggers do nothing because the data is still fresh. Raising \`staleTime\` is usually a better fix for "too many requests" than switching off \`refetchOnWindowFocus\` everywhere.`,
      codeSnippet: `import { useQuery } from "@tanstack/react-query";

function DeliveryTracker({ orderId }) {
  // 1. Load the order
  const orderQuery = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
  });

  const partnerId = orderQuery.data?.deliveryPartnerId;

  // 2. Dependent query: runs only once partnerId exists, then polls every 10s
  const locationQuery = useQuery({
    queryKey: ["partner-location", partnerId],
    queryFn: () => fetchPartnerLocation(partnerId),
    enabled: !!partnerId,
    refetchInterval: 10_000,
  });

  if (orderQuery.isPending) return <p>Loading order...</p>;
  if (orderQuery.isError) return <p>{orderQuery.error.message}</p>;

  return (
    <div>
      <h3>Order #{orderId} to {orderQuery.data.city}</h3>
      {locationQuery.data
        ? <p>Rider is near {locationQuery.data.area}</p>
        : <p>Assigning a delivery partner...</p>}
    </div>
  );
}`
    },
    {
      heading: "8. useMutation and invalidateQueries",
      content: `Queries **read** data. To **create, update or delete** data, use \`useMutation\`. Unlike \`useQuery\`, a mutation does not run on its own; you call \`mutate(variables)\` when the user acts.
What \`useMutation\` returns:
• \`mutate(variables, { onSuccess, onError })\` — fire and forget; errors are handled through callbacks.
• \`mutateAsync(variables)\` — returns a Promise you can \`await\` (wrap it in \`try/catch\`).
• \`isPending\`, \`isError\`, \`isSuccess\`, \`error\`, \`data\`, \`variables\` and \`reset()\`.
Lifecycle callbacks run in this order: \`onMutate\` (before the request) → \`onSuccess\` or \`onError\` → \`onSettled\` (always).
**Keeping lists in sync:** after adding a task on the server, the cached \`["tasks"]\` list is out of date. Call \`queryClient.invalidateQueries({ queryKey: ["tasks"] })\`. This marks every query whose key **starts with** \`["tasks"]\` as stale and immediately refetches the ones currently on screen. Get the client with the \`useQueryClient()\` hook.
If you \`return\` the invalidation Promise from \`onSuccess\` or \`onSettled\`, the mutation stays \`isPending\` until the fresh list has arrived — so your button does not re-enable before the UI is updated.
If the server returns the updated object, you can also write it straight into the cache with \`queryClient.setQueryData(key, newData)\` and skip a round trip.`,
      codeSnippet: `import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

async function createTask(title) {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Could not save the task");
  return res.json();
}

export function AddTaskForm() {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  const addTask = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      setTitle("");
      // Returning the promise keeps isPending true until the list refetches
      return queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim()) addTask.mutate(title.trim());
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button disabled={addTask.isPending}>
        {addTask.isPending ? "Saving..." : "Add task"}
      </button>
      {addTask.isError && <p role="alert">{addTask.error.message}</p>}
    </form>
  );
}`
    },
    {
      heading: "9. Optimistic Updates",
      content: `An **optimistic update** changes the UI **before** the server confirms, so the app feels instant — like a "like" button that turns red immediately. If the request fails, you roll back.
**Approach 1 — through the UI (simplest).** While the mutation is pending, \`useMutation\` exposes the \`variables\` you passed. Render an extra greyed-out item from \`variables\` while \`isPending\` is true. No cache changes, nothing to roll back. Best when only one component needs to show the pending item.
**Approach 2 — through the cache.** Use when several components must see the change:
1. **\`onMutate\`**: cancel in-flight fetches for that key (\`cancelQueries\`) so they do not overwrite your change, save the current data with \`getQueryData\`, write the optimistic data with \`setQueryData\`, and **return** the saved snapshot.
2. **\`onError\`**: the third argument receives what \`onMutate\` returned; write the snapshot back.
3. **\`onSettled\`**: invalidate the key so the cache ends up matching the server, whether the request succeeded or failed.
React 19 also ships \`useOptimistic\` for optimistic UI inside Actions. With TanStack Query, the two approaches above are the standard way, because the cache is where your server data lives.`,
      codeSnippet: `import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task) =>
      fetch("/api/tasks/" + task.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !task.done }),
      }).then((res) => {
        if (!res.ok) throw new Error("Update failed");
        return res.json();
      }),

    onMutate: async (task) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData(["tasks"]);

      queryClient.setQueryData(["tasks"], (old = []) =>
        old.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t))
      );

      return { previousTasks }; // becomes the 3rd argument of onError
    },

    onError: (err, task, context) => {
      queryClient.setQueryData(["tasks"], context.previousTasks); // roll back
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
}`
    },
    {
      heading: "10. Paginated Queries with placeholderData",
      content: `For numbered pages, put the page number in the query key: \`["products", "page", page]\`. Each page is cached separately, so going back to page 2 is instant.
The problem: when \`page\` changes, the key is new, the query is \`pending\`, and the list flashes to a spinner on every click. The fix in v5 is **\`placeholderData: keepPreviousData\`** (imported from \`@tanstack/react-query\`). While the next page loads, the previous page's data stays on screen and \`isPlaceholderData\` is \`true\`, so you can dim the list and disable the "Next" button.
v5 note: the old v4 option \`keepPreviousData: true\` was removed and replaced by this \`placeholderData\` helper.
You can also **prefetch** the next page with \`queryClient.prefetchQuery\` so clicking "Next" feels instant.`,
      codeSnippet: `import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

const LIMIT = 10;

async function fetchPage(page) {
  const skip = (page - 1) * LIMIT;
  const res = await fetch("https://dummyjson.com/products?limit=" + LIMIT + "&skip=" + skip);
  if (!res.ok) throw new Error("Failed to load page " + page);
  return res.json(); // { products, total, skip, limit }
}

export function PagedProducts() {
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error, isPlaceholderData } = useQuery({
    queryKey: ["products", "page", page],
    queryFn: () => fetchPage(page),
    placeholderData: keepPreviousData,
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;

  const totalPages = Math.ceil(data.total / LIMIT);

  return (
    <div style={{ opacity: isPlaceholderData ? 0.5 : 1 }}>
      <ul>{data.products.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
      <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
        Previous
      </button>
      <span> Page {page} of {totalPages} </span>
      <button
        onClick={() => setPage((p) => p + 1)}
        disabled={isPlaceholderData || page >= totalPages}
      >
        Next
      </button>
    </div>
  );
}`
    },
    {
      heading: "11. Infinite Queries: Load More & Infinite Scroll",
      content: `For feeds and "Load more" buttons, use \`useInfiniteQuery\`. Instead of one page, it caches a growing list of pages under a single key.
Required options in v5:
• **\`queryFn\`** receives \`{ pageParam }\` — the cursor or page number to fetch.
• **\`initialPageParam\`** — the first page's param (required in v5; it used to be a default argument).
• **\`getNextPageParam(lastPage, allPages)\`** — return the next param, or \`undefined\`/\`null\` when there are no more pages. That return value drives \`hasNextPage\`.
What you get back:
• \`data.pages\` — an array of page responses (flatten it with \`flatMap\` to render).
• \`fetchNextPage()\`, \`hasNextPage\`, \`isFetchingNextPage\`.
For true infinite scroll, call \`fetchNextPage\` when a sentinel element at the bottom of the list becomes visible, using an \`IntersectionObserver\`. Optional \`getPreviousPageParam\` supports bi-directional lists, and \`maxPages\` limits how many pages stay in memory.
Always guard calls with \`hasNextPage && !isFetchingNextPage\` so you do not fire duplicate requests.`,
      codeSnippet: `import { useInfiniteQuery } from "@tanstack/react-query";

const LIMIT = 10;

async function fetchPosts({ pageParam }) {
  const res = await fetch("https://dummyjson.com/posts?limit=" + LIMIT + "&skip=" + pageParam);
  if (!res.ok) throw new Error("Failed to load posts");
  return res.json(); // { posts, total, skip, limit }
}

export function PostFeed() {
  const { data, isPending, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", "feed"],
      queryFn: fetchPosts,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const nextSkip = lastPage.skip + lastPage.limit;
        return nextSkip < lastPage.total ? nextSkip : undefined; // undefined = no more
      },
    });

  if (isPending) return <p>Loading feed...</p>;
  if (isError) return <p>{error.message}</p>;

  const posts = data.pages.flatMap((page) => page.posts);

  return (
    <>
      {posts.map((post) => <article key={post.id}><h4>{post.title}</h4></article>)}
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load more" : "You're all caught up"}
      </button>
    </>
  );
}`
    },
    {
      heading: "12. Suspense Mode with useSuspenseQuery",
      content: `So far each component checks \`isPending\` and \`isError\` itself. **Suspense mode** moves that work to parent components:
• **\`useSuspenseQuery\`** suspends while loading, so the nearest \`<Suspense fallback>\` shows the spinner.
• If the query fails (after retries), it **throws** the error to the nearest **error boundary**.
• Because loading and errors are handled elsewhere, \`data\` is **always defined** — no \`if (isPending)\` checks, and simpler code.
Points to know:
• There is also \`useSuspenseInfiniteQuery\` and \`useSuspenseQueries\`.
• Suspense queries do not accept \`enabled\` or \`placeholderData\`; the query always runs.
• Two \`useSuspenseQuery\` calls in the **same** component run **one after another** (a waterfall), because the first one suspends before the second is reached. Use \`useSuspenseQueries\` or split them into sibling components to fetch in parallel.
• For error boundaries, the popular \`react-error-boundary\` package works well. Wrap it in **\`QueryErrorResetBoundary\`** so that the "Try again" button also resets the failed query; otherwise the boundary would re-render and immediately throw the cached error again.
For the regular \`useQuery\` you can also set \`throwOnError: true\` to send errors to an error boundary while keeping manual loading states.`,
      codeSnippet: `// npm install react-error-boundary
import { Suspense } from "react";
import { useSuspenseQuery, QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

function UserProfile({ userId }) {
  const { data: user } = useSuspenseQuery({
    queryKey: ["user", userId],
    queryFn: () => fetch("https://dummyjson.com/users/" + userId).then((res) => {
      if (!res.ok) throw new Error("User not found");
      return res.json();
    }),
  });

  // data is always defined here
  return <h2>{user.firstName} {user.lastName} — {user.address.city}</h2>;
}

export function ProfilePage({ userId }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div role="alert">
              <p>{error.message}</p>
              <button onClick={resetErrorBoundary}>Try again</button>
            </div>
          )}
        >
          <Suspense fallback={<p>Loading profile...</p>}>
            <UserProfile userId={userId} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}`
    },
    {
      heading: "13. Common Mistakes with TanStack Query",
      content: `• **Creating \`new QueryClient()\` inside a component** — every render creates an empty cache. Create it at module level (or once with \`useState(() => new QueryClient())\`).
• **Leaving variables out of the query key** — \`queryKey: ["products"]\` while the \`queryFn\` uses \`category\` means switching category shows the wrong cached data. Every input belongs in the key.
• **Not throwing on HTTP errors** — \`fetch\` resolves on 404/500; without \`if (!res.ok) throw\`, error data is cached as success.
• **Copying query data into \`useState\`** — the copy stops updating when the cache refetches. Use \`data\` directly, or derive values from it during render.
• **Using \`isLoading\` where you mean \`isPending\`** — in v5, a disabled query with no data is \`isPending\` but not \`isLoading\`, so \`data\` may be \`undefined\` when you expected otherwise.
• **Confusing \`staleTime\` and \`gcTime\`** — raising \`gcTime\` does not stop refetches; \`staleTime\` does.
• **Forgetting to invalidate after a mutation** — the server changes but every list on screen stays stale.
• **v4 syntax in v5** — \`useQuery(["key"], fn)\`, \`cacheTime\`, \`keepPreviousData: true\` and \`invalidateQueries(["key"])\` were removed. v5 uses a single options object everywhere.
• **Putting client state in the query cache** — modal visibility and form inputs belong in \`useState\` or a client store, not TanStack Query.`
    },
    {
      heading: "14. Top React Interview Questions on TanStack Query",
      content: `**Q1. What is the difference between server state and client state?**
Client state is owned by the app and always current (UI toggles, form input). Server state is a cached snapshot of remote data that can go stale, is fetched asynchronously and is shared by many components.
**Q2. Why not just use \`useEffect\` and \`fetch\`?**
You would have to build caching, request deduplication, retries, background refetching, race-condition handling and cache updates after mutations yourself, in every component.
**Q3. What is a query key and why must it include all variables?**
It is the array that identifies a cache entry. TanStack Query refetches when the key changes, so any value used by \`queryFn\` must be in the key, or different inputs would share one cache entry.
**Q4. Explain \`staleTime\` vs \`gcTime\`.**
\`staleTime\` (default 0) is how long data counts as fresh and won't be refetched. \`gcTime\` (default 5 minutes) is how long unused data stays in memory before being removed.
**Q5. What is the difference between \`isPending\` and \`isFetching\`?**
\`isPending\` means there is no data yet. \`isFetching\` means any request is running, including background refetches while old data is displayed.
**Q6. How do you keep a list updated after a mutation?**
Call \`queryClient.invalidateQueries({ queryKey })\` in \`onSuccess\` or \`onSettled\`, or update the cache directly with \`setQueryData\`.
**Q7. How do you implement an optimistic update with rollback?**
In \`onMutate\`, cancel queries, snapshot with \`getQueryData\`, apply \`setQueryData\` and return the snapshot. In \`onError\`, restore it. In \`onSettled\`, invalidate.
**Q8. How does \`useInfiniteQuery\` know if there are more pages?**
\`getNextPageParam\` returns the next page param; returning \`undefined\` or \`null\` sets \`hasNextPage\` to false.
**Q9. What does \`useSuspenseQuery\` change?**
Loading is handled by \`<Suspense>\` and errors by an error boundary, so \`data\` is always defined inside the component.`
    },
    {
      heading: "15. Practical Hands-On Exercise — Expense Tracker with TanStack Query",
      content: `Build a small expense tracker that uses every core concept from this lecture. To keep it runnable without a backend, the file includes a **fake API** that stores data in memory, adds a network delay, and fails randomly about 20% of the time on saves, so you can watch the optimistic rollback happen.
Steps:
1. \`npm create vite@latest rq-expenses -- --template react\`, then \`cd rq-expenses\`.
2. \`npm install @tanstack/react-query\` and \`npm install -D @tanstack/react-query-devtools\`.
3. Replace \`src/App.jsx\` with the code below (it creates its own \`QueryClientProvider\`, so \`main.jsx\` can stay as Vite generated it) and run \`npm run dev\`.
What to observe:
• Open the Devtools panel. The \`["expenses"]\` query is fresh for 30 seconds, then turns stale.
• Add an expense: it appears instantly (optimistic). If the fake save fails, it disappears and an error message appears.
• Switch to another browser tab and back after 30 seconds: a background refetch runs and "Syncing…" flashes without a spinner.
**Challenge tasks:**
1. Add a "Delete" button with its own optimistic \`useMutation\`.
2. Add a category filter and include it in the query key.
3. Convert the list to \`useSuspenseQuery\` with a \`<Suspense>\` fallback and error boundary.`,
      codeSnippet: `// src/App.jsx
import { useState } from "react";
import {
  QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// ---------- Fake API (in-memory, with delay and random failures) ----------
let db = [
  { id: 1, title: "Metro card recharge", amount: 500 },
  { id: 2, title: "Groceries from DMart", amount: 1840 },
];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const api = {
  async getExpenses() {
    await wait(700);
    return [...db];
  },
  async addExpense(expense) {
    await wait(900);
    if (Math.random() < 0.2) throw new Error("Server error: expense not saved");
    const saved = { ...expense, id: Date.now() };
    db = [...db, saved];
    return saved;
  },
};

// ---------- Query client ----------
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30 * 1000 } },
});

// ---------- Components ----------
function ExpenseList() {
  const { data, isPending, isError, error, isFetching, refetch } = useQuery({
    queryKey: ["expenses"],
    queryFn: api.getExpenses,
  });

  if (isPending) return <p>Loading expenses...</p>;
  if (isError) {
    return (
      <p role="alert">
        {error.message} <button onClick={() => refetch()}>Retry</button>
      </p>
    );
  }

  const total = data.reduce((sum, e) => sum + e.amount, 0);

  return (
    <section>
      <h2>Expenses {isFetching && <small>Syncing...</small>}</h2>
      <ul>
        {data.map((e) => (
          <li key={e.id} style={{ opacity: e.optimistic ? 0.5 : 1 }}>
            {e.title} — ₹{e.amount.toLocaleString("en-IN")}
          </li>
        ))}
      </ul>
      <p><strong>Total: ₹{total.toLocaleString("en-IN")}</strong></p>
    </section>
  );
}

function AddExpenseForm() {
  const client = useQueryClient();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const addExpense = useMutation({
    mutationFn: api.addExpense,
    onMutate: async (newExpense) => {
      await client.cancelQueries({ queryKey: ["expenses"] });
      const previous = client.getQueryData(["expenses"]);
      client.setQueryData(["expenses"], (old = []) => [
        ...old,
        { ...newExpense, id: "temp-" + Date.now(), optimistic: true },
      ]);
      return { previous };
    },
    onError: (err, newExpense, context) => {
      client.setQueryData(["expenses"], context.previous);
    },
    onSettled: () => client.invalidateQueries({ queryKey: ["expenses"] }),
  });

  function handleSubmit(e) {
    e.preventDefault();
    const value = Number(amount);
    if (!title.trim() || !(value > 0)) return;
    addExpense.mutate({ title: title.trim(), amount: value });
    setTitle("");
    setAmount("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
      <input placeholder="What did you spend on?" value={title}
        onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="₹ Amount" type="number" value={amount}
        onChange={(e) => setAmount(e.target.value)} />
      <button disabled={addExpense.isPending}>
        {addExpense.isPending ? "Saving..." : "Add"}
      </button>
      {addExpense.isError && (
        <span role="alert" style={{ color: "crimson" }}>{addExpense.error.message}</span>
      )}
    </form>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main style={{ maxWidth: 560, margin: "40px auto", fontFamily: "system-ui" }}>
        <h1 style={{ color: "#002057" }}>Lecture 22: Expense Tracker</h1>
        <AddExpenseForm />
        <ExpenseList />
      </main>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}`
    },
    {
      heading: "16. Summary",
      content: `• **Client state** (UI, forms) is owned by your app; **server state** is a cached, possibly stale snapshot of remote data and needs its own tool.
• \`useEffect\` + \`fetch\` lacks caching, deduplication, retries, background refetching and cross-component updates.
• Set up one **\`QueryClient\`** outside components, wrap the app in **\`QueryClientProvider\`**, and add **\`ReactQueryDevtools\`** during development.
• **\`useQuery({ queryKey, queryFn })\`** — the key identifies the cache entry and must include every variable the function uses; throw on HTTP errors.
• **\`isPending\`** = no data yet; **\`isFetching\`** = a request is running; show cached data during background refetches.
• **\`staleTime\`** (default 0) decides when to refetch; **\`gcTime\`** (default 5 min) decides when unused data is forgotten.
• Stale queries refetch on mount, window focus and reconnect; use \`refetchInterval\` for polling and \`enabled\` for dependent queries.
• **\`useMutation\`** writes data; **\`invalidateQueries\`** refreshes every query matching a key prefix.
• **Optimistic updates**: render \`variables\` while pending, or use \`onMutate\` / \`onError\` rollback / \`onSettled\` invalidate.
• **Pagination** with \`placeholderData: keepPreviousData\`; **infinite lists** with \`useInfiniteQuery\`, \`initialPageParam\` and \`getNextPageParam\`.
• **\`useSuspenseQuery\`** hands loading to \`<Suspense>\` and errors to an error boundary, so \`data\` is always defined.
**Next lecture:** Performance Optimization — memo, useMemo, useCallback & the React Compiler`
    }
  ]
};
