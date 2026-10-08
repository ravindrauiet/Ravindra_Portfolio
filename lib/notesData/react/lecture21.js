export const lecture21 = {
  slug: "lecture-21",
  number: 21,
  title: "Complete React Course — Module 7: Lecture 21: Routing with React Router v7",
  summary: "Turn a single-page React app into a multi-page experience with React Router v7. Covers client-side routing, declarative mode (BrowserRouter, Routes, Route, Link, NavLink), data mode (createBrowserRouter, RouterProvider, loaders and actions), nested routes with <Outlet>, useParams, useSearchParams, useNavigate, protected routes, 404 pages, lazy-loaded routes and a short look at framework mode.",
  readTime: "30 min read",
  difficulty: "Intermediate",
  date: "2026-10-08",
  sections: [
    {
      heading: "1. What Is Client-Side Routing?",
      content: `In the previous lecture we packaged stateful logic into custom hooks. Our apps so far, however, have lived on a single screen. Real products have many screens: a home page, a product list, a product detail page, a cart, a login page, an admin dashboard. Each needs its own **URL** so users can bookmark it, share it on WhatsApp, and use the browser's Back button.
In a traditional multi-page website, every link click asks the server for a brand-new HTML page. The whole page reloads, the screen flashes white, and all JavaScript state is lost.
A React app built with Vite is a **single-page application (SPA)**. The server sends one \`index.html\` and one JavaScript bundle. After that, **client-side routing** takes over:
• When the user clicks a link, the router **intercepts** the click and stops the full page reload.
• It updates the address bar using the browser's **History API** (\`history.pushState\`).
• It looks at the new URL, decides which components match, and **re-renders only what changed**.
• Back and Forward buttons fire a \`popstate\` event, which the router listens to and re-renders accordingly.
The result feels instant, state like a shopping cart survives navigation, and the URL still describes exactly where the user is. React itself has no built-in router, so we use a library. The most widely used one is **React Router**.`
    },
    {
      heading: "2. React Router v7 — Three Modes and Installation",
      content: `React Router v7 merged the Remix framework into React Router. It can now be used in **three modes**, and you pick one based on how much the router should do for you:
• **Declarative mode** — the classic API: \`<BrowserRouter>\`, \`<Routes>\`, \`<Route>\`, \`<Link>\`. The router only matches URLs to components. Great for simple apps and for learning.
• **Data mode** — you create the router with \`createBrowserRouter\` and render it with \`<RouterProvider>\`. Routes can now have **loaders** (fetch data before rendering), **actions** (handle form submissions), error elements and pending UI.
• **Framework mode** — React Router acts as a full framework through a Vite plugin: file-based route config, server rendering, type-safe route modules and code splitting out of the box. This is the successor to Remix.
**Installation:** in v7 the main package is simply \`react-router\`. The old \`react-router-dom\` package still exists and re-exports everything, so existing tutorials keep working, but new code should import from \`react-router\`. React Router v7 needs React 18 or newer and a modern Node.js version (check the official docs for the current minimum).
**Migration note:** if you are coming from v6, most APIs are the same. The biggest change is the import path. Upgrading is usually a matter of changing \`"react-router-dom"\` to \`"react-router"\`.`,
      codeSnippet: `# Inside an existing Vite + React project
npm install react-router

# Check the installed version
npm list react-router`
    },
    {
      heading: "3. Declarative Mode — BrowserRouter, Routes and Route",
      content: `Declarative mode needs three building blocks:
1. **\`<BrowserRouter>\`** wraps your app once, at the top. It connects React Router to the browser's address bar.
2. **\`<Routes>\`** is a container that looks at the current URL and renders the **single best matching** child route.
3. **\`<Route path="..." element={...} />\`** maps one URL pattern to one element.
Routes are **ranked**, not checked top to bottom, so \`/products/new\` will beat \`/products/:id\` regardless of order. A route with \`path="*"\` matches anything that nothing else matched, which is how we build a 404 page.
Place \`<BrowserRouter>\` in \`main.jsx\` so that every component, including the ones in \`App\`, can use router hooks.`,
      codeSnippet: `// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// src/App.jsx
import { Routes, Route } from "react-router";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}`
    },
    {
      heading: "4. Navigating with Link and NavLink",
      content: `Never use a plain \`<a href="/about">\` for internal pages. An anchor tag triggers a full page reload, which throws away all React state and re-downloads the bundle.
• **\`<Link to="/about">\`** renders a real \`<a>\` tag (so it is accessible, can be opened in a new tab, and is crawlable) but intercepts normal clicks and navigates on the client.
• **\`<NavLink>\`** is a \`<Link>\` that knows whether it is **active**. It automatically adds an \`active\` CSS class and \`aria-current="page"\` when its URL matches. You can also pass a function to \`className\` or \`style\` that receives \`{ isActive, isPending }\`.
• By default a NavLink to \`/\` would be active on every page, because every URL starts with \`/\`. Add the **\`end\`** prop so it only matches exactly.
• Use \`replace\` on a link when you do not want a new history entry (for example, switching tabs inside a page).
For external websites, a normal \`<a href="https://...">\` is still correct.`,
      codeSnippet: `// src/components/Navbar.jsx
import { Link, NavLink } from "react-router";

const linkClass = ({ isActive }) =>
  isActive ? "nav-link nav-link--active" : "nav-link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand">ShopKart</Link>

      <NavLink to="/" end className={linkClass}>Home</NavLink>
      <NavLink to="/products" className={linkClass}>Products</NavLink>
      <NavLink to="/about" className={linkClass}>About</NavLink>

      {/* External site: a plain anchor is correct */}
      <a href="https://react.dev" target="_blank" rel="noreferrer">
        React Docs
      </a>
    </nav>
  );
}`
    },
    {
      heading: "5. Nested Routes, Layouts and <Outlet>",
      content: `Most apps share a layout: the navbar and footer stay the same while the middle part changes. Copying \`<Navbar />\` into every page is repetitive. **Nested routes** solve this.
• A parent route renders the shared layout. Inside the layout, **\`<Outlet />\`** marks the spot where the matching child route will appear.
• Child paths are **relative** to the parent: a child \`path="products"\` inside parent \`/\` matches \`/products\`.
• An **index route** (\`<Route index element={...} />\`) renders at the parent's exact URL. Think of it as the "default child".
• A parent route **without** a \`path\` is a **layout route**. It wraps its children in UI without adding anything to the URL.
Nesting can go as deep as you need. A dashboard can have its own sidebar layout with its own \`<Outlet />\` inside the main site layout.`,
      codeSnippet: `// src/layouts/RootLayout.jsx
import { Outlet } from "react-router";
import Navbar from "../components/Navbar.jsx";

export default function RootLayout() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet /> {/* the matching child page renders here */}
      </main>
      <footer>© 2026 ShopKart, Bengaluru</footer>
    </>
  );
}

// src/App.jsx
import { Routes, Route } from "react-router";
import RootLayout from "./layouts/RootLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Orders from "./pages/Orders.jsx";
import Settings from "./pages/Settings.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />                 {/* /              */}
        <Route path="products" element={<Products />} />   {/* /products      */}
        <Route path="products/:id" element={<ProductDetail />} /> {/* /products/42 */}

        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<Orders />} />              {/* /dashboard          */}
          <Route path="settings" element={<Settings />} />  {/* /dashboard/settings */}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}`
    },
    {
      heading: "6. URL Params with useParams",
      content: `A product page for item 42 and item 43 is the same component with different data. Instead of declaring a route for every product, use a **dynamic segment**: a path part that starts with a colon, such as \`:id\`.
• \`useParams()\` returns an object of all dynamic segments for the current URL, e.g. \`{ id: "42" }\`.
• Params are **always strings**. Convert them with \`Number()\` if you need a number for comparison.
• You can have several params: \`/users/:userId/orders/:orderId\`.
• Add \`?\` to make a segment optional: \`/:lang?/about\` matches both \`/about\` and \`/hi/about\`.
• A trailing \`*\` (splat) captures the rest of the URL, available as \`params["*"]\`.
When the URL changes from \`/products/42\` to \`/products/43\`, React Router **reuses** the same component instance and only the param changes. Any effect that fetches data must list the param in its dependency array.`,
      codeSnippet: `// src/pages/ProductDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

export default function ProductDetail() {
  const { id } = useParams(); // "42" — always a string
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setProduct(null);
    setError(null);

    fetch(\`https://dummyjson.com/products/\${id}\`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => { if (!ignore) setProduct(data); })
      .catch((err) => { if (!ignore) setError(err.message); });

    return () => { ignore = true; }; // avoid race conditions
  }, [id]); // re-run when the param changes

  if (error) return <p>{error}. <Link to="/products">Back to products</Link></p>;
  if (!product) return <p>Loading product {id}...</p>;

  return (
    <article>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <Link to={\`/products/\${Number(id) + 1}\`}>Next product →</Link>
    </article>
  );
}`
    },
    {
      heading: "7. Query Strings with useSearchParams",
      content: `Filters, search terms, sort order and page numbers belong in the **query string** (\`/products?category=laptops&sort=price\`), not in component state. That way a filtered view can be bookmarked, shared and restored with the Back button.
\`useSearchParams()\` works like \`useState\` for the query string:
• It returns \`[searchParams, setSearchParams]\`. \`searchParams\` is a standard browser \`URLSearchParams\` object.
• Read values with \`searchParams.get("category")\`. Missing keys return \`null\`, so supply defaults.
• \`setSearchParams\` accepts an object, or a function that receives the previous params, and it **creates a navigation** (a new history entry). Pass \`{ replace: true }\` as the second argument for things like typing in a search box, so every keystroke does not fill the history.
• To remove a key, call \`.delete(key)\` on a copy of the params.
**Rule of thumb:** if a user would expect to share or refresh the page and see the same view, put that value in the URL.`,
      codeSnippet: `// src/pages/Products.jsx
import { useSearchParams, Link } from "react-router";

const PRODUCTS = [
  { id: 1, name: "Dell Inspiron 15", category: "laptops", price: 54990 },
  { id: 2, name: "boAt Airdopes 141", category: "audio", price: 1299 },
  { id: 3, name: "HP Pavilion x360", category: "laptops", price: 67999 },
  { id: 4, name: "Sony WH-1000XM5", category: "audio", price: 29990 },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "all";
  const q = searchParams.get("q") ?? "";

  function updateParam(key, value) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!value || value === "all") next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: key === "q" } // don't flood history while typing
    );
  }

  const visible = PRODUCTS.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      p.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <section>
      <input
        placeholder="Search products"
        value={q}
        onChange={(e) => updateParam("q", e.target.value)}
      />
      <select value={category} onChange={(e) => updateParam("category", e.target.value)}>
        <option value="all">All</option>
        <option value="laptops">Laptops</option>
        <option value="audio">Audio</option>
      </select>

      <ul>
        {visible.map((p) => (
          <li key={p.id}>
            <Link to={\`/products/\${p.id}\`}>{p.name}</Link> — ₹{p.price.toLocaleString("en-IN")}
          </li>
        ))}
      </ul>
    </section>
  );
}`
    },
    {
      heading: "8. Programmatic Navigation with useNavigate",
      content: `Links cover navigation the user starts with a click. Sometimes **your code** must navigate: after a successful login, after placing an order, or when a timer expires. For that, use \`useNavigate()\`.
• \`navigate("/orders")\` pushes a new entry onto the history stack.
• \`navigate("/login", { replace: true })\` **replaces** the current entry, so Back does not return to it. Use this after login or logout.
• \`navigate(-1)\` goes back one step, like the browser's Back button. \`navigate(1)\` goes forward.
• \`navigate("/checkout", { state: { from: "cart" } })\` passes invisible data to the next page, which reads it with \`useLocation().state\`.
• Relative paths work too: \`navigate("..")\` goes to the parent route.
**Important:** call \`navigate\` inside event handlers or effects, never directly during render. If you need to redirect while rendering, return the \`<Navigate to="..." />\` component instead.`,
      codeSnippet: `// src/pages/Checkout.jsx
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Checkout() {
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  async function handlePlaceOrder() {
    setPlacing(true);
    // Pretend API call
    await new Promise((r) => setTimeout(r, 800));
    const orderId = "ORD-" + Date.now();

    // replace: pressing Back should not re-open the checkout form
    navigate(\`/orders/\${orderId}\`, {
      replace: true,
      state: { justPlaced: true },
    });
  }

  return (
    <div>
      <button onClick={() => navigate(-1)}>← Back to cart</button>
      <button onClick={handlePlaceOrder} disabled={placing}>
        {placing ? "Placing order..." : "Pay ₹2,499"}
      </button>
    </div>
  );
}`
    },
    {
      heading: "9. Protected Routes and 404 Pages",
      content: `Some pages, such as a dashboard or order history, should only be visible to logged-in users. In declarative mode the cleanest pattern is a **guard layout route**:
1. Create a component that reads the auth state (for example from the auth context we built in the Context API lecture).
2. If the user is logged in, render \`<Outlet />\` so the protected children appear.
3. If not, return \`<Navigate to="/login" replace state={{ from: location }} />\`. Saving the current location lets the login page send the user back where they were.
4. Wrap every protected route inside this guard in your route tree.
**Security reminder:** client-side guards only hide UI. Anyone can read your JavaScript bundle, so the **server must still check** the user's token on every API request.
**404 pages:** add \`<Route path="*" element={<NotFound />} />\` as the last child of your layout so the 404 page keeps the navbar. Give users a link home. Note that on a static host, a refresh on \`/products/42\` asks the server for that file; configure the host to serve \`index.html\` for unknown paths (a "SPA fallback" or rewrite rule), or users will see the host's own 404.`,
      codeSnippet: `// src/components/RequireAuth.jsx
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

export default function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

// src/pages/Login.jsx (relevant part)
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  function handleSubmit(e) {
    e.preventDefault();
    login({ name: "Ananya" });
    navigate(from, { replace: true });
  }
  return <form onSubmit={handleSubmit}><button>Log in</button></form>;
}

// src/App.jsx (route tree)
// <Route path="/" element={<RootLayout />}>
//   <Route index element={<Home />} />
//   <Route path="login" element={<Login />} />
//   <Route element={<RequireAuth />}>           {/* guard: no path */}
//     <Route path="dashboard" element={<Dashboard />} />
//     <Route path="orders" element={<Orders />} />
//   </Route>
//   <Route path="*" element={<NotFound />} />
// </Route>`
    },
    {
      heading: "10. Data Mode — createBrowserRouter, Loaders and Actions",
      content: `In declarative mode, a page renders first and then starts fetching in \`useEffect\`. Nested pages fetch one after another, creating **waterfalls**, and every page repeats the same loading and error code. **Data mode** moves data work into the router.
• **\`createBrowserRouter([...])\`** takes your routes as plain objects. Render it with **\`<RouterProvider router={router} />\`** (imported from \`react-router/dom\` in DOM apps). You do not use \`<BrowserRouter>\` in this mode.
• A **\`loader\`** is an async function on a route. The router calls it **before** rendering, with \`{ params, request }\`. Loaders for all matching nested routes run **in parallel**. The component reads the result with **\`useLoaderData()\`**.
• An **\`action\`** handles non-GET submissions. Submit with React Router's **\`<Form method="post">\`**; the router calls the route's action with the \`request\`, which you read with \`await request.formData()\`. After an action, the router **automatically re-runs loaders**, so the UI shows fresh data without manual refetching.
• Return **\`redirect("/path")\`** from a loader or action to send the user elsewhere. In a loader, this is also a neat way to protect routes.
• **\`errorElement\`** renders when a loader, action or component throws. Inside it, \`useRouteError()\` gives you the error.
• **\`useNavigation()\`** tells you whether a navigation or submission is in progress (\`navigation.state\` is \`"idle"\`, \`"loading"\` or \`"submitting"\`), perfect for a global loading bar.`,
      codeSnippet: `// src/main.jsx — Data mode
import { createRoot } from "react-dom/client";
import { createBrowserRouter, redirect } from "react-router";
import { RouterProvider } from "react-router/dom";
import RootLayout from "./layouts/RootLayout.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import Home from "./pages/Home.jsx";
import Notes, { notesLoader, createNoteAction } from "./pages/Notes.jsx";
import { isLoggedIn } from "./auth.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "notes",
        element: <Notes />,
        loader: async (args) => {
          if (!isLoggedIn()) return redirect("/login"); // protect in the loader
          return notesLoader(args);
        },
        action: createNoteAction,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);

// src/pages/Notes.jsx
import { Form, useLoaderData, useNavigation } from "react-router";

const API = "https://example.com/api/notes";

export async function notesLoader() {
  const res = await fetch(API);
  if (!res.ok) throw new Response("Could not load notes", { status: res.status });
  return res.json();
}

export async function createNoteAction({ request }) {
  const formData = await request.formData();
  const title = formData.get("title");
  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return null; // loaders re-run automatically after this
}

export default function Notes() {
  const notes = useLoaderData();
  const navigation = useNavigation();
  const saving = navigation.state === "submitting";

  return (
    <section>
      <Form method="post">
        <input name="title" required placeholder="New note" />
        <button disabled={saving}>{saving ? "Saving..." : "Add"}</button>
      </Form>
      <ul>{notes.map((n) => <li key={n.id}>{n.title}</li>)}</ul>
    </section>
  );
}`
    },
    {
      heading: "11. Lazy-Loaded Routes (Code Splitting)",
      content: `By default Vite bundles every page into one JavaScript file. A visitor opening your home page downloads the admin dashboard and charts library too. **Lazy loading** splits each route into its own chunk that is downloaded only when the user visits it.
**Declarative mode:** use React's \`lazy()\` with a dynamic \`import()\`, and wrap the routes in \`<Suspense>\` with a fallback. The lazily imported module must have a **default export**.
**Data mode:** give the route a \`lazy\` function that returns the route's properties. React Router loads the module, then runs its loader and renders its \`Component\`. Because the router knows about the lazy route, it can fetch the code and data in parallel.
Good candidates for lazy loading are heavy and rarely visited pages: admin panels, settings, reports with chart libraries. Keep the home page and other landing pages in the main bundle so the first load is fast.`,
      codeSnippet: `// Declarative mode: React.lazy + Suspense
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import RootLayout from "./layouts/RootLayout.jsx";
import Home from "./pages/Home.jsx"; // eager: needed on first load

const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const Reports = lazy(() => import("./pages/Reports.jsx"));

export default function App() {
  return (
    <Suspense fallback={<p>Loading page...</p>}>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

// Data mode: the route's lazy() returns its properties
// src/pages/Reports.jsx exports: export async function loader() {...}
//                                export function Component() {...}
const routes = [
  {
    path: "reports",
    lazy: async () => {
      const { loader, Component } = await import("./pages/Reports.jsx");
      return { loader, Component };
    },
  },
];`
    },
    {
      heading: "12. Framework Mode in Brief",
      content: `Framework mode turns React Router into a full-stack framework, similar in spirit to Next.js. You start a project with \`npx create-react-router@latest\`, and a Vite plugin takes over the build.
What you get:
• A central **\`app/routes.ts\`** file that lists route modules (with helpers like \`route()\`, \`index()\` and \`layout()\`), or file-system routing through an add-on package.
• **Route modules**: each file can export a \`loader\`, \`action\`, default component, \`ErrorBoundary\`, \`meta\` and more.
• **Server-side rendering** by default, with options for static pre-rendering or SPA mode.
• **Automatic code splitting** and **generated TypeScript types** for params and loader data.
When to choose which mode:
• Learning or a small widget → **declarative**.
• A client-rendered SPA with real data needs (dashboards, admin tools) → **data mode**.
• A content site or product that needs SEO and server rendering → **framework mode** (or Next.js, which this site's Next.js course covers).
Everything you learn in this lecture about params, nested routes, loaders and actions carries over directly to framework mode.`
    },
    {
      heading: "13. Common Mistakes",
      content: `• **Using \`<a href>\` for internal links.** It reloads the whole app and wipes state. Use \`<Link>\` or \`<NavLink>\`.
• **Forgetting \`<Outlet />\` in a layout.** The parent renders but child pages never appear. Every parent route that has children needs an \`<Outlet />\`.
• **Calling \`navigate()\` during render.** This causes warnings and loops. Call it in handlers or effects, or render \`<Navigate />\`.
• **Treating params as numbers.** \`useParams()\` returns strings, so \`id === 42\` is always false. Use \`Number(id)\`.
• **Missing the param in effect dependencies.** Going from \`/products/1\` to \`/products/2\` reuses the component; without \`[id]\` the old data stays on screen.
• **NavLink to "/" always active.** Add the \`end\` prop.
• **Mixing modes.** Rendering \`<BrowserRouter>\` around a \`<RouterProvider>\`, or using \`useLoaderData\` in declarative mode, will not work. Loaders and actions need a data router.
• **Leading slashes in nested child paths.** A child with \`path="/settings"\` is absolute, not relative. Write \`path="settings"\` inside a parent.
• **Relying on client guards for security.** Hide UI on the client, but always authorise on the server.
• **No SPA fallback on deployment.** Refreshing a deep link shows the host's 404 unless the host rewrites unknown paths to \`index.html\`.
• **Old imports from tutorials.** \`Switch\`, \`useHistory\` and \`component={...}\` are React Router v5 APIs. In v6 and v7 use \`Routes\`, \`useNavigate\` and \`element={...}\`.`
    },
    {
      heading: "14. Top React Interview Questions on Routing",
      content: `**Q1. What is client-side routing and how does it differ from server-side routing?**
With server-side routing every navigation requests a new HTML document from the server. Client-side routing intercepts link clicks, updates the URL with the History API and re-renders only the components that changed, without reloading the page.
**Q2. What is the difference between \`<Link>\` and \`<NavLink>\`?**
Both render an accessible \`<a>\` tag that navigates on the client. \`NavLink\` also knows whether its route is active and exposes \`isActive\` and \`isPending\` for styling, and sets \`aria-current="page"\`.
**Q3. What does \`<Outlet />\` do?**
It is a placeholder inside a parent route's element where the matched child route renders. It enables shared layouts with nested routes.
**Q4. What is an index route?**
A child route with \`index\` instead of a path. It renders at the parent's exact URL, acting as the default child.
**Q5. \`useParams\` vs \`useSearchParams\`?**
\`useParams\` reads dynamic path segments like \`:id\` in \`/products/:id\`. \`useSearchParams\` reads and updates the query string, like \`?sort=price\`. Path params identify a resource; search params describe a view of it.
**Q6. When would you use \`navigate(path, { replace: true })\`?**
When the current page should not remain in history, such as after login, logout or a completed checkout, so Back does not return there.
**Q7. What are loaders and actions?**
In data and framework modes, a loader fetches a route's data before it renders, and an action handles form submissions. After an action, the router revalidates by re-running loaders automatically.
**Q8. How do you implement a protected route?**
Wrap protected routes in a layout route that checks authentication and renders \`<Outlet />\` or \`<Navigate to="/login" replace />\`. In data mode you can \`return redirect("/login")\` from a loader. The server must also enforce authorisation.
**Q9. How do you lazy-load routes?**
In declarative mode, use \`React.lazy\` with \`<Suspense>\`. In data mode, use the route's \`lazy\` property, which lets the router load code and data in parallel.
**Q10. What changed in React Router v7?**
It merged Remix into React Router, introduced three modes (declarative, data, framework), and made \`react-router\` the main package; \`react-router-dom\` remains as a re-export for compatibility.`
    },
    {
      heading: "15. Practical Hands-On Exercise — Mini Course Catalogue",
      content: `Build a small course catalogue for an online academy. Create a fresh Vite React project, run \`npm install react-router\`, and replace \`src/main.jsx\` with the code below. It runs as a single file so you can focus on routing.
Your app must have:
1. A root layout with a NavLink navbar and an \`<Outlet />\`.
2. A home page (index route).
3. A courses list filtered by level through \`useSearchParams\`.
4. A course detail page using \`useParams\`, with an "Enroll" button that uses \`useNavigate\`.
5. A protected "My Learning" page guarded by a fake login.
6. A 404 page inside the layout.
**Stretch goals:** convert the app to data mode with a loader for the course list, add a \`lazy\` route for the "My Learning" page, and add an \`errorElement\`.`,
      codeSnippet: `// src/main.jsx — complete runnable app (declarative mode)
import { StrictMode, createContext, useContext, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter, Routes, Route, Link, NavLink, Outlet, Navigate,
  useParams, useSearchParams, useNavigate, useLocation,
} from "react-router";

const COURSES = [
  { id: "1", title: "React Fundamentals", level: "beginner", price: 999 },
  { id: "2", title: "Advanced React Patterns", level: "advanced", price: 2499 },
  { id: "3", title: "Next.js 16 Bootcamp", level: "intermediate", price: 1999 },
  { id: "4", title: "JavaScript for Beginners", level: "beginner", price: 499 },
];

const AuthContext = createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [enrolled, setEnrolled] = useState([]);
  const value = {
    user,
    enrolled,
    login: () => setUser({ name: "Priya" }),
    logout: () => setUser(null),
    enroll: (id) => setEnrolled((prev) => (prev.includes(id) ? prev : [...prev, id])),
  };
  return <AuthContext value={value}>{children}</AuthContext>;
}
const useAuth = () => useContext(AuthContext);

const navStyle = ({ isActive }) => ({
  marginRight: 16,
  fontWeight: isActive ? 700 : 400,
  color: isActive ? "#f97316" : "#002057",
});

function Layout() {
  const { user, login, logout } = useAuth();
  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <nav style={{ borderBottom: "1px solid #ddd", paddingBottom: 12 }}>
        <NavLink to="/" end style={navStyle}>Home</NavLink>
        <NavLink to="/courses" style={navStyle}>Courses</NavLink>
        <NavLink to="/my-learning" style={navStyle}>My Learning</NavLink>
        {user ? (
          <button onClick={logout}>Logout {user.name}</button>
        ) : (
          <button onClick={login}>Login</button>
        )}
      </nav>
      <main style={{ paddingTop: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}

function Home() {
  return (
    <>
      <h1>Learn to code, the Indian way</h1>
      <Link to="/courses?level=beginner">Start with beginner courses →</Link>
    </>
  );
}

function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const level = searchParams.get("level") ?? "all";
  const list = level === "all" ? COURSES : COURSES.filter((c) => c.level === level);

  return (
    <>
      <h1>Courses</h1>
      {["all", "beginner", "intermediate", "advanced"].map((l) => (
        <button
          key={l}
          onClick={() => setSearchParams(l === "all" ? {} : { level: l })}
          style={{ marginRight: 8, fontWeight: l === level ? 700 : 400 }}
        >
          {l}
        </button>
      ))}
      <ul>
        {list.map((c) => (
          <li key={c.id}>
            <Link to={\`/courses/\${c.id}\`}>{c.title}</Link> — ₹{c.price}
          </li>
        ))}
      </ul>
    </>
  );
}

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, enroll } = useAuth();
  const course = COURSES.find((c) => c.id === courseId);

  if (!course) return <NotFound />;

  function handleEnroll() {
    if (!user) {
      navigate("/login-required", { state: { from: \`/courses/\${courseId}\` } });
      return;
    }
    enroll(course.id);
    navigate("/my-learning");
  }

  return (
    <>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h1>{course.title}</h1>
      <p>Level: {course.level} | Price: ₹{course.price}</p>
      <button onClick={handleEnroll}>Enroll now</button>
    </>
  );
}

function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login-required" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

function LoginRequired() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from ?? "/my-learning";
  return (
    <>
      <p>Please log in to continue.</p>
      <button onClick={() => { login(); navigate(from, { replace: true }); }}>
        Log in as Priya
      </button>
    </>
  );
}

function MyLearning() {
  const { user, enrolled } = useAuth();
  const mine = COURSES.filter((c) => enrolled.includes(c.id));
  return (
    <>
      <h1>{user.name}'s Learning</h1>
      {mine.length === 0 ? (
        <p>No courses yet. <Link to="/courses">Browse courses</Link></p>
      ) : (
        <ul>{mine.map((c) => <li key={c.id}>{c.title}</li>)}</ul>
      )}
    </>
  );
}

function NotFound() {
  return (
    <>
      <h1>404 — Page not found</h1>
      <Link to="/">Go home</Link>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:courseId" element={<CourseDetail />} />
        <Route path="login-required" element={<LoginRequired />} />
        <Route element={<RequireAuth />}>
          <Route path="my-learning" element={<MyLearning />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);`
    },
    {
      heading: "16. Summary",
      content: `• **Client-side routing** changes the URL with the History API and re-renders only what changed, with no full page reload.
• React Router v7 has **three modes**: declarative, data and framework. Install the \`react-router\` package and import from it.
• **Declarative mode:** \`<BrowserRouter>\`, \`<Routes>\`, \`<Route path element>\`, with \`<Link>\` and \`<NavLink>\` for navigation (use \`end\` on the home NavLink).
• **Nested routes** share layouts through \`<Outlet />\`; **index routes** are the default child; pathless **layout routes** wrap children without changing the URL.
• \`useParams\` reads dynamic segments (always strings); \`useSearchParams\` keeps filters and search in the shareable query string.
• \`useNavigate\` navigates from code; use \`replace: true\` after login or checkout, and \`<Navigate />\` when redirecting during render.
• **Protected routes** are guard layout routes that render \`<Outlet />\` or redirect; the server must still authorise every request.
• \`path="*"\` catches unknown URLs for a 404 page; configure an SPA fallback on your host.
• **Data mode** (\`createBrowserRouter\` + \`RouterProvider\`) adds loaders, actions, \`<Form>\`, \`redirect\`, \`errorElement\` and \`useNavigation\`.
• **Lazy routes** split code per page with \`React.lazy\` or the route \`lazy\` property.
• **Framework mode** adds server rendering, route modules and type generation, the successor to Remix.
**Next lecture:** Data Fetching & Server State with TanStack Query`
    }
  ]
};
