export const lecture25 = {
  slug: "lecture-25",
  number: 25,
  title: "Complete React Course — Module 9: Lecture 25: Global State Management — Zustand & Redux Toolkit",
  summary: "Master global state management in React with Zustand v5 and Redux Toolkit 2. Covers when Context is not enough, Zustand stores, selectors, useShallow, persist middleware, configureStore, createSlice, useSelector, useDispatch, RTK Query, and choosing between Context, Zustand, Redux or TanStack Query.",
  readTime: "55 min read",
  difficulty: "Advanced",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. What Is Global State Management in React and Why It Matters",
      content: `Every React application starts with **local state**: a \`useState\` inside a component, owned by that component, invisible to everyone else. For a counter, a form field or a dropdown that is exactly right. But real products have data that many unrelated parts of the screen need at the same time. Think of a food-delivery app: the cart badge in the header, the "Add to cart" buttons on every restaurant card, the checkout page and the coupon banner all read and write the **same cart**. That cart is **global state**: application-wide data that lives outside any single component and that any component can subscribe to.
**Global state management** is the set of tools and patterns for storing that shared data, updating it predictably, and re-rendering only the components that care about the piece that changed. In this lecture you will learn two of the most popular libraries in the React ecosystem:
• **Zustand v5** — a tiny, hook-based store (about a kilobyte gzipped) with almost no boilerplate. It is the most downloaded "lightweight" state library and the default choice for many new Vite + React projects.
• **Redux Toolkit 2 (RTK)** — the official, opinionated way to write Redux. It gives you \`configureStore\`, \`createSlice\`, Immer-powered immutable updates, excellent DevTools, and **RTK Query** for data fetching. It is the standard in large enterprise codebases.
We will also place **Context** (from Lecture 18) and **TanStack Query v5** on the same map, because the hardest part of state management is not learning an API — it is deciding **which kind of state you are holding** and therefore **which tool fits**. By the end you will be able to look at any feature and say: "this belongs in local state", "this is server state, give it to TanStack Query", or "this is client state shared across the app, put it in a store".`
    },
    {
      heading: "2. When Local State and Context Are Not Enough",
      content: `Before reaching for a library, be honest about whether you need one. React's built-in tools cover more than people expect, and every extra dependency is code you must maintain. Here is the progression most teams go through.
**Stage 1 — Local state.** \`useState\` or \`useReducer\` in the component that renders the data. Perfect for inputs, toggles, modals and anything one component owns.
**Stage 2 — Lifting state up.** Two siblings need the same value, so you move it to their parent and pass props down. Fine for one or two levels.
**Stage 3 — Context.** Many components at different depths need the same value, so you provide it once and read it anywhere with \`useContext\` or \`use()\`. Context is excellent for values that change **rarely** — theme, current user, locale, feature flags — or for dependency injection.
Context stops being enough when one or more of these show up:
• **High-frequency updates.** Every time the provider's value changes, **every consumer re-renders**, even the ones that only read an unchanged field. A cart context with \`items\`, \`coupon\` and \`deliveryAddress\` re-renders the address form when a quantity changes. Splitting into many contexts (Lecture 18) helps, but it quickly becomes its own maintenance problem.
• **Reading state outside React.** An Axios interceptor needs the auth token, a WebSocket handler must push messages into state, or an analytics module wants the current filters. Context only exists inside the component tree.
• **Complex transitions.** A multi-step checkout with undo, optimistic updates and cross-feature rules is hard to reason about when the logic is spread across event handlers.
• **Debugging at scale.** On a team of ten, "who changed this value and when?" needs an action log and time-travel, which Context does not give you.
There is one more distinction that matters more than all of these: **client state versus server state**. Client state is data the browser owns — cart contents, UI preferences, draft form values, which panel is open. Server state is data that lives in a database and that your app merely **caches** — products, orders, user profiles. Server state needs caching, deduplication, background refetching, retries and invalidation, none of which a store gives you for free. The code below shows the typical "everything in one context" setup that signals it is time to move on.`,
      codeSnippet: `// src/context/AppContext.jsx — the moment Context stops scaling
import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [theme, setTheme] = useState("light");
  const [filters, setFilters] = useState({ city: "Bengaluru", veg: false });

  // A brand-new object on every render. Any change to ANY field
  // re-renders EVERY consumer: header, cart, filters, theme toggle...
  const value = { user, setUser, cart, setCart, theme, setTheme, filters, setFilters };

  return <AppContext value={value}>{children}</AppContext>;
}

export const useApp = () => useContext(AppContext);

// Also impossible: reading the auth token from a plain JS module.
// axios.interceptors.request.use((config) => {
//   config.headers.Authorization = ??? // no hook access here
// });`
    },
    {
      heading: "3. Zustand v5 — Creating Your First Store",
      content: `**Zustand** (German for "state") solves the problems above with a single idea: a **store** is a plain JavaScript object held outside React, and a **hook** lets components subscribe to slices of it. There is no Provider to wrap, no action-type strings, no reducers unless you want them. Install it with \`npm install zustand\`.
You create a store with \`create\` from \`zustand\`. It takes a function that receives \`set\` (to update state) and \`get\` (to read the current state inside actions) and returns the initial state object. By convention, **actions live inside the store** next to the data they modify. The return value of \`create\` is a hook — call it inside any component with a **selector** to read exactly one piece.
Key facts about \`set\`:
• \`set({ count: 5 })\` **merges** one level deep. You do not need to spread the rest of the state at the top level the way you do with \`useState\` objects.
• \`set((state) => ({ count: state.count + 1 }))\` receives the current state, which is the safe way to compute the next value from the previous one.
• \`set(newState, true)\` **replaces** the whole state instead of merging (rarely needed).
• Nested objects are **not** merged. To update \`address.city\` you still spread \`address\`, exactly like Lecture 11.
Zustand v5 requires React 18 or newer because it is built on \`useSyncExternalStore\`, the official React hook for subscribing to external stores. That is what makes it safe with concurrent rendering, transitions and React 19 features such as \`<Activity>\`.
The example builds a cart store for a grocery app. Notice how \`addItem\` checks whether the product is already in the cart and increments the quantity instead of duplicating it, and how \`total\` is not stored at all — it is derived with a selector, which we cover next.`,
      codeSnippet: `// src/store/useCartStore.js
import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  // ---- state ----
  items: [],                       // [{ id, name, price, qty }]
  coupon: null,                    // e.g. "FIRST50"

  // ---- actions ----
  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...product, qty: 1 }] };
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  setQty: (id, qty) =>
    set((state) => ({
      items: state.items
        .map((i) => (i.id === id ? { ...i, qty } : i))
        .filter((i) => i.qty > 0),
    })),

  applyCoupon: (code) => set({ coupon: code }),

  clearCart: () => set({ items: [], coupon: null }),

  // get() reads the latest state inside an action
  itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
}));

// src/components/AddToCartButton.jsx
export function AddToCartButton({ product }) {
  const addItem = useCartStore((state) => state.addItem); // select one field
  return <button onClick={() => addItem(product)}>Add to cart</button>;
}`
    },
    {
      heading: "4. Zustand Selectors, Re-renders and useShallow",
      content: `The hook returned by \`create\` accepts a **selector**: \`useCartStore((state) => state.items)\`. Zustand calls the selector on every store update and compares the **new result with the previous result using \`Object.is\`**. The component re-renders **only if that result changed**. This is the feature that makes Zustand scale where Context struggles: a header badge that selects \`state.items.length\` does not re-render when the coupon changes, and the coupon banner does not re-render when a quantity changes.
Three rules follow from the \`Object.is\` comparison:
**Rule 1 — Select the smallest thing you need.** \`useCartStore((s) => s.items.length)\` is better than selecting \`s.items\` and reading \`.length\` in the component, because a quantity change creates a new \`items\` array (new reference) even though the length is the same.
**Rule 2 — Never call the hook without a selector in a component.** \`const store = useCartStore()\` subscribes to the **entire state**, so the component re-renders on every update. It works, but it throws away the main benefit.
**Rule 3 — Selectors must return stable references.** This is the big change in Zustand v5. If your selector builds a **new object or array** on each call — \`(s) => ({ items: s.items, coupon: s.coupon })\` or \`(s) => s.items.filter(...)\` — then every call returns a fresh reference, \`Object.is\` says "changed", and React keeps re-rendering. In v4 this silently caused extra renders; in v5 it throws **"Maximum update depth exceeded"** because \`useSyncExternalStore\` requires a cached snapshot. The fix is \`useShallow\` from \`zustand/react/shallow\`: it wraps your selector and compares the result **shallowly** (key by key for objects, element by element for arrays), returning the previous reference when nothing inside changed.
For **derived values** such as the cart total, you have two good options: compute it in the selector when it returns a primitive (\`reduce\` to a number is perfectly stable because \`Object.is(199, 199)\` is true), or keep a plain helper function outside the store and call it with the selected \`items\`. Do not store derived data in the store — it gets out of sync.`,
      codeSnippet: `// src/components/CartWidgets.jsx
import { useShallow } from "zustand/react/shallow";
import { useCartStore } from "../store/useCartStore";

// Primitive result: re-renders only when the count actually changes
export function CartBadge() {
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));
  return <span className="badge">{count}</span>;
}

// Derived number: stable because Object.is(1999, 1999) === true
export function CartTotal() {
  const total = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  );
  return <strong>Total: ₹{total}</strong>;
}

// WRONG in v5: new object every call -> infinite re-render loop
// const { items, coupon } = useCartStore((s) => ({ items: s.items, coupon: s.coupon }));

// RIGHT: useShallow compares keys, so the reference stays stable
export function CartPanel() {
  const { items, coupon, removeItem } = useCartStore(
    useShallow((s) => ({ items: s.items, coupon: s.coupon, removeItem: s.removeItem }))
  );
  return (
    <ul>
      {items.map((i) => (
        <li key={i.id}>
          {i.name} × {i.qty}
          <button onClick={() => removeItem(i.id)}>Remove</button>
        </li>
      ))}
      {coupon && <li>Coupon applied: {coupon}</li>}
    </ul>
  );
}

// Array selector (filter creates a new array) also needs useShallow
export function VegItems() {
  const vegItems = useCartStore(useShallow((s) => s.items.filter((i) => i.veg)));
  return <p>{vegItems.length} veg items</p>;
}`
    },
    {
      heading: "5. Async Actions, get() and Using a Zustand Store Outside React",
      content: `Because a Zustand store is just an object in a module, it works **anywhere JavaScript runs** — not only inside components. The hook object exposes three static methods:
• \`useCartStore.getState()\` — read the current state synchronously. Use it in Axios interceptors, event listeners, route loaders (React Router v7 \`loader\` functions) and tests.
• \`useCartStore.setState(partial)\` — update from outside, for example when a WebSocket message arrives.
• \`useCartStore.subscribe(listener)\` — run a callback on every change. With the \`subscribeWithSelector\` middleware you can subscribe to a single field and get the previous and next values.
**Async actions need no special API.** An action is just a function; make it \`async\`, \`await\` your fetch, and call \`set\` when results arrive. Keep loading and error flags in the store so the UI can react. Inside the action, \`get()\` gives you the latest state — important after an \`await\`, because the state captured before the await may be stale.
This is a major ergonomic difference from classic Redux, where async flows require thunks or sagas. With Zustand the pattern is simply "a function that calls \`set\` more than once".
A word of caution: if the async work is **fetching server data** (products, orders), you are usually better off with TanStack Query or RTK Query, which handle caching, retries and refetching. Use async actions in a store for **client-side workflows** such as "submit the cart, then clear it and store the order id", where the state transition itself is the point.`,
      codeSnippet: `// src/store/useAuthStore.js
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  status: "idle",          // "idle" | "loading" | "error"
  error: null,

  login: async (email, password) => {
    set({ status: "loading", error: null });
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      set({ user: data.user, token: data.token, status: "idle" });
    } catch (err) {
      set({ status: "error", error: err.message });
    }
  },

  logout: () => {
    if (get().status === "loading") return;   // read latest state
    set({ user: null, token: null });
  },
}));

// src/lib/api.js — plain module, no hooks, no React
import axios from "axios";
export const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;   // read outside React
  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
});

// src/lib/socket.js — push updates into the store from a WebSocket
export function connectOrderSocket(socket) {
  socket.onmessage = (event) => {
    const order = JSON.parse(event.data);
    useAuthStore.setState({ lastOrder: order });   // triggers subscribed components
  };
}

// Fire-and-forget listener (logs every change)
const unsubscribe = useAuthStore.subscribe((state, prev) => {
  if (state.user !== prev.user) console.log("user changed:", state.user);
});`
    },
    {
      heading: "6. Zustand Middleware: persist, devtools and immer",
      content: `Zustand **middleware** are functions that wrap your store creator to add behaviour. You compose them by nesting: \`create(devtools(persist(immer(creator))))\`. The three you will use most ship with the library.
**persist** saves the store to storage and **rehydrates** it on the next page load. Import it from \`zustand/middleware\`. The only required option is \`name\`, the storage key. Defaults: \`localStorage\` with JSON serialisation. Useful options:
• \`storage: createJSONStorage(() => sessionStorage)\` — use session storage, AsyncStorage (React Native) or any object with \`getItem\`/\`setItem\`/\`removeItem\`.
• \`partialize: (state) => ({ items: state.items })\` — persist only some fields. Never persist loading flags, errors or anything derived.
• \`version\` and \`migrate(persistedState, version)\` — when you change the shape of the state, bump the version and transform old data instead of crashing users who still have the old format in storage.
• \`onRehydrateStorage\` — run code before and after hydration, for example to set a \`hasHydrated\` flag so the UI can avoid showing an empty cart for a split second.
In a Vite SPA this just works. In a framework with server rendering (Next.js), the server has no \`localStorage\`, so the first client render must match the server HTML; use the \`skipHydration\` option plus \`useCartStore.persist.rehydrate()\` in an effect, or gate the UI behind a hydrated flag.
**devtools** connects the store to the Redux DevTools browser extension — yes, the Redux one, it is just a protocol. Pass a \`name\` so multiple stores are labelled, and give actions names by passing a third argument to \`set\`: \`set(partial, false, "cart/addItem")\`. You get the full action log and time-travel that Redux users enjoy.
**immer** (from \`zustand/middleware/immer\`, requires \`npm install immer\`) lets you write **mutating syntax** inside \`set\` — \`state.items.push(product)\` — while Immer produces an immutable copy behind the scenes. This is the same mechanism Redux Toolkit uses and it removes the nested-spread pain for deep objects.`,
      codeSnippet: `// src/store/useCartStore.js — persisted, debuggable, immutable-by-Immer
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";   // npm install immer

export const useCartStore = create(
  devtools(
    persist(
      immer((set) => ({
        items: [],
        coupon: null,
        hasHydrated: false,

        addItem: (product) =>
          set(
            (state) => {
              const existing = state.items.find((i) => i.id === product.id);
              if (existing) existing.qty += 1;            // Immer: looks like mutation
              else state.items.push({ ...product, qty: 1 });
            },
            false,
            "cart/addItem"                                // label in Redux DevTools
          ),

        removeItem: (id) =>
          set((state) => {
            state.items = state.items.filter((i) => i.id !== id);
          }, false, "cart/removeItem"),

        clearCart: () => set({ items: [], coupon: null }, false, "cart/clear"),
        setHasHydrated: (v) => set({ hasHydrated: v }),
      })),
      {
        name: "swiggo-cart",                               // localStorage key
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ items: state.items, coupon: state.coupon }),
        version: 2,
        migrate: (persisted, version) => {
          if (version < 2) {
            // v1 stored "quantity"; v2 uses "qty"
            persisted.items = (persisted.items || []).map(({ quantity, ...rest }) => ({
              ...rest,
              qty: quantity ?? 1,
            }));
          }
          return persisted;
        },
        onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
      }
    ),
    { name: "CartStore" }
  )
);

// Usage: avoid flashing an empty cart before hydration finishes
export function CartPage() {
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const count = useCartStore((s) => s.items.length);
  if (!hasHydrated) return <p>Loading cart…</p>;
  return <p>{count} items in your cart</p>;
}`
    },
    {
      heading: "7. Organising Larger Zustand Stores: The Slices Pattern",
      content: `A single \`create\` call with forty fields becomes unreadable. Zustand's answer is the **slices pattern**: write each feature as a small creator function \`(set, get) => ({ ... })\`, then spread them into one store. Each slice can still call \`get()\` to read fields from other slices, so a \`checkout\` slice can read \`items\` from the \`cart\` slice.
Should you have **one store or many**? Both are valid:
• **One combined store** when features interact (cart needs the user's address; checkout clears the cart). Slices keep it organised and middleware such as \`persist\` is configured once.
• **Multiple independent stores** when features are unrelated (a \`useThemeStore\` and a \`useCartStore\` have nothing to say to each other). Separate stores mean separate persistence keys and smaller DevTools traces.
Two more organisational habits used in production:
**Export selector helpers.** Instead of repeating \`(s) => s.items.reduce(...)\` in five components, export \`selectTotal\` from the store file. Tests can import and unit-test it without rendering anything.
**Reset for tests.** Keep the initial state in a constant and expose a \`reset\` action, or call \`useCartStore.setState(initialState, true)\` in a \`beforeEach\`. Because the store is module-level, state leaks between tests unless you reset it — a very common source of flaky tests.`,
      codeSnippet: `// src/store/slices/cartSlice.js
export const createCartSlice = (set, get) => ({
  items: [],
  addItem: (p) => set((s) => ({ items: [...s.items, { ...p, qty: 1 }] })),
  clearCart: () => set({ items: [] }),
});

// src/store/slices/userSlice.js
export const createUserSlice = (set) => ({
  user: null,
  address: null,
  setAddress: (address) => set({ address }),
});

// src/store/slices/checkoutSlice.js — reads other slices via get()
export const createCheckoutSlice = (set, get) => ({
  lastOrderId: null,
  placeOrder: async () => {
    const { items, address } = get();                 // cross-slice read
    if (!address) throw new Error("Add a delivery address first");
    const res = await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({ items, address }),
    });
    const { orderId } = await res.json();
    set({ lastOrderId: orderId });
    get().clearCart();                                // cross-slice action
  },
});

// src/store/useAppStore.js — combine
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createCartSlice } from "./slices/cartSlice";
import { createUserSlice } from "./slices/userSlice";
import { createCheckoutSlice } from "./slices/checkoutSlice";

export const useAppStore = create(
  persist(
    (...a) => ({
      ...createCartSlice(...a),
      ...createUserSlice(...a),
      ...createCheckoutSlice(...a),
    }),
    { name: "app-store", partialize: (s) => ({ items: s.items, address: s.address }) }
  )
);

// Reusable selectors
export const selectTotal = (s) => s.items.reduce((sum, i) => sum + i.price * i.qty, 0);
export const selectCount = (s) => s.items.reduce((n, i) => n + i.qty, 0);

// In a test (Vitest):
// beforeEach(() => useAppStore.setState({ items: [], user: null, address: null, lastOrderId: null }));`
    },
    {
      heading: "8. Redux Toolkit 2 — configureStore and createSlice",
      content: `**Redux** is the oldest and most structured option. Its model is strict: the whole app state is **one immutable object tree** in a single **store**; the only way to change it is to **dispatch an action** (a plain object with a \`type\`); a pure **reducer** function computes the next state. This predictability is why large teams like it — every change is an action you can log, replay and test.
Classic Redux was famous for boilerplate: action-type constants, action creators, switch statements and manual spreading. **Redux Toolkit (RTK)** removed all of that and is now the only recommended way to write Redux. Version 2 (released December 2023) modernised the package for ES2020 and bundlers like Vite, and ships alongside Redux core 5 and React-Redux 9. Install with \`npm install @reduxjs/toolkit react-redux\`.
Two functions do most of the work:
**\`configureStore({ reducer })\`** creates the store. Compared with the old \`createStore\`, it automatically combines your slice reducers, adds the **thunk** middleware for async logic, enables the **Redux DevTools** extension, and in development adds **immutability and serialisability checks** that throw helpful errors if you accidentally mutate state or put a Date or class instance in it.
**\`createSlice({ name, initialState, reducers })\`** generates everything for one feature. Each key in \`reducers\` becomes both a **case reducer** and an **action creator**: \`addItem\` the reducer handles actions of type \`"cart/addItem"\`, and \`cartSlice.actions.addItem(product)\` creates \`{ type: "cart/addItem", payload: product }\`. Inside a case reducer you can **write mutating code** — \`state.items.push(product)\` — because RTK runs it through **Immer**, which records your mutations and produces a new immutable state. You may either mutate the draft **or** return a new value, never both.
RTK 2 also added a **\`selectors\`** field to \`createSlice\`: define selectors that take the slice state and RTK wraps them so they accept the **root** state, as long as the slice is mounted at a key equal to its \`name\`. The example shows a complete cart slice and store wired into a Vite app.`,
      codeSnippet: `// src/features/cart/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = { items: [], coupon: null };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // "mutating" code is safe: Immer converts it into an immutable update
    addItem(state, action) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) existing.qty += 1;
      else state.items.push({ ...action.payload, qty: 1 });
    },
    removeItem(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    setQty(state, action) {
      const { id, qty } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) item.qty = qty;
      state.items = state.items.filter((i) => i.qty > 0);
    },
    applyCoupon(state, action) {
      state.coupon = action.payload;
    },
    clearCart() {
      return initialState;            // returning a new value is also allowed
    },
  },
  // RTK 2: selectors receive the SLICE state and are exposed for ROOT state
  selectors: {
    selectItems: (cart) => cart.items,
    selectCount: (cart) => cart.items.reduce((n, i) => n + i.qty, 0),
    selectTotal: (cart) => cart.items.reduce((s, i) => s + i.price * i.qty, 0),
  },
});

export const { addItem, removeItem, setQty, applyCoupon, clearCart } = cartSlice.actions;
export const { selectItems, selectCount, selectTotal } = cartSlice.selectors;
export default cartSlice.reducer;

// addItem({ id: 1, name: "Masala Dosa", price: 120 })
// => { type: "cart/addItem", payload: { id: 1, name: "Masala Dosa", price: 120 } }

// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,              // key "cart" matches the slice name
  },
});
// configureStore adds: thunk middleware, DevTools, dev-only immutability + serializability checks

// src/main.jsx
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);`
    },
    {
      heading: "9. Reading and Updating Redux State with useSelector and useDispatch",
      content: `React-Redux provides the bridge between the store and components. Wrap the app once in \`<Provider store={store}>\` (shown above), then use two hooks:
**\`useSelector(selector)\`** reads from the store. It subscribes the component and, after every dispatch, re-runs the selector and compares the result with the previous one using **strict reference equality (\`===\`)**. If it changed, the component re-renders. This is the same mental model as Zustand's selectors, with the same consequence: a selector that **returns a new object or array each time** (for example \`state.cart.items.filter(...)\`) causes a re-render on **every** dispatch anywhere in the app. React-Redux 9 even warns in development: "Selector unknown returned a different result when called with the same parameters". Fix it one of three ways:
• Return primitives or existing references (\`state.cart.items\`).
• Pass \`shallowEqual\` from \`react-redux\` as the second argument when you select a small object.
• Use **\`createSelector\`** (Reselect, re-exported by RTK) to build a **memoised** selector that recomputes only when its inputs change. This is the standard tool for derived data such as totals, sorted lists and filtered views.
**\`useDispatch()\`** returns the store's \`dispatch\` function. Call it with an action creator: \`dispatch(addItem(product))\`. Dispatch is synchronous — by the time it returns, the reducers have run and subscribers are notified. In React 18+ multiple dispatches in the same event handler are batched into one render.
**TypeScript tip (RTK 2 / React-Redux 9):** instead of writing \`useSelector<RootState>\` everywhere, create pre-typed hooks once with \`useSelector.withTypes<RootState>()\` and \`useDispatch.withTypes<AppDispatch>()\` and import those.
The code shows the three components of a cart page — a badge, a product button and a memoised "expensive items" list — each subscribing to exactly what it needs.`,
      codeSnippet: `// src/features/cart/CartUI.jsx
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { addItem, removeItem, selectItems, selectCount, selectTotal } from "./cartSlice";

// Memoised derived selector: recomputes only when items change
const selectExpensiveItems = createSelector([selectItems], (items) =>
  items.filter((i) => i.price * i.qty >= 500)
);

export function CartBadge() {
  const count = useSelector(selectCount);        // number -> stable
  return <span>{count}</span>;
}

export function AddToCartButton({ product }) {
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(addItem(product))}>Add</button>;
}

export function CartSummary() {
  // Small object selected with shallowEqual to avoid needless re-renders
  const { total, coupon } = useSelector(
    (state) => ({ total: selectTotal(state), coupon: state.cart.coupon }),
    shallowEqual
  );
  return (
    <p>
      Total ₹{total} {coupon ? "(coupon " + coupon + ")" : ""}
    </p>
  );
}

export function ExpensiveItems() {
  const dispatch = useDispatch();
  const items = useSelector(selectExpensiveItems);   // memoised array
  return (
    <ul>
      {items.map((i) => (
        <li key={i.id}>
          {i.name} — ₹{i.price * i.qty}
          <button onClick={() => dispatch(removeItem(i.id))}>Remove</button>
        </li>
      ))}
    </ul>
  );
}

// src/app/hooks.ts (TypeScript projects)
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "./store";
// export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
// export const useAppSelector = useSelector.withTypes<RootState>();`
    },
    {
      heading: "10. Async Logic in Redux Toolkit: createAsyncThunk and extraReducers",
      content: `Reducers must be **pure and synchronous** — no fetch calls inside them. Redux handles async work with **thunks**: functions that receive \`dispatch\` and \`getState\` and may run asynchronously. \`configureStore\` already includes the thunk middleware, and RTK's **\`createAsyncThunk\`** generates a thunk that dispatches three lifecycle actions automatically:
• \`products/fetchAll/pending\` — dispatched immediately.
• \`products/fetchAll/fulfilled\` — with the resolved value as \`payload\`.
• \`products/fetchAll/rejected\` — with the error, or with the value you pass to \`rejectWithValue\` for a controlled error payload.
You handle these in the slice's **\`extraReducers\`** using the builder callback: \`builder.addCase(fetchProducts.pending, (state) => { state.status = "loading" })\`. \`extraReducers\` is where a slice responds to actions it did not create, which keeps reducers in one place.
**Status modelling:** store an explicit \`status: "idle" | "loading" | "succeeded" | "failed"\` field rather than separate booleans; it makes impossible states (loading **and** failed) impossible.
**Where to call it:** dispatch from a \`useEffect\` on mount, from a React Router v7 loader, or from an event handler. The thunk returns a promise, so you can \`await dispatch(fetchProducts()).unwrap()\` inside an event handler to get the data or a thrown error.
Honest guidance: hand-writing \`pending/fulfilled/rejected\` cases for every endpoint is **exactly the boilerplate RTK Query eliminates**. Use \`createAsyncThunk\` for one-off async workflows that update client state (submit an order, then clear the cart); use RTK Query for fetching and caching server data. The next section covers it.`,
      codeSnippet: `// src/features/products/productsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (city, { rejectWithValue }) => {
    const res = await fetch("/api/products?city=" + encodeURIComponent(city));
    if (!res.ok) return rejectWithValue("Server responded " + res.status);
    return res.json();                      // becomes action.payload on fulfilled
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message;
      });
  },
});

export default productsSlice.reducer;

// src/features/products/ProductList.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./productsSlice";

export function ProductList({ city = "Pune" }) {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchProducts(city));
  }, [dispatch, city]);

  if (status === "loading") return <p>Loading products…</p>;
  if (status === "failed") return <p role="alert">Error: {error}</p>;
  return (
    <ul>
      {list.map((p) => (
        <li key={p.id}>{p.name} — ₹{p.price}</li>
      ))}
    </ul>
  );
}

// Awaiting a thunk in a handler:
// const data = await dispatch(fetchProducts("Pune")).unwrap(); // throws on rejected`
    },
    {
      heading: "11. RTK Query Overview — Data Fetching Built into Redux Toolkit",
      content: `**RTK Query** is a data-fetching and caching layer included in \`@reduxjs/toolkit\`. It solves the server-state problem — caching, deduplication, loading states, refetching, invalidation — the same way TanStack Query does, but stores everything **inside your Redux store**, so it integrates with DevTools and other slices.
You describe an **API** once with \`createApi\` (import from \`@reduxjs/toolkit/query/react\` to get auto-generated hooks):
• \`reducerPath\` — the key where the cache lives in the store (default \`"api"\`).
• \`baseQuery\` — usually \`fetchBaseQuery({ baseUrl, prepareHeaders })\`, a small wrapper around \`fetch\` where you can attach the auth token from \`getState()\`.
• \`tagTypes\` and \`endpoints\` — each endpoint is a **query** (reads, cached) or a **mutation** (writes). Queries declare \`providesTags\`; mutations declare \`invalidatesTags\`. When a mutation invalidates a tag, every mounted query that provided it **refetches automatically**. This tag system is RTK Query's answer to "when is the cache stale?".
RTK Query generates a hook per endpoint — \`useGetProductsQuery\`, \`useAddProductMutation\` — with \`data\`, \`isLoading\`, \`isFetching\`, \`error\` and \`refetch\`. Two components calling \`useGetProductsQuery("Pune")\` share one request and one cache entry; when the last subscriber unmounts, the entry is kept for 60 seconds (\`keepUnusedDataFor\`) and then dropped. Wire it into \`configureStore\` by adding \`api.reducer\` under \`api.reducerPath\` and concatenating \`api.middleware\`.
**RTK Query vs TanStack Query:** they are functionally comparable. Choose RTK Query when you already use Redux and want one DevTools timeline for everything; choose TanStack Query when you do not use Redux (for example with Zustand) because it is lighter to adopt and framework-agnostic. Do not use both in one app.`,
      codeSnippet: `// src/services/api.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) headers.set("Authorization", "Bearer " + token);
      return headers;
    },
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (city) => "/products?city=" + encodeURIComponent(city),
      providesTags: (result = []) => [
        "Product",
        ...result.map((p) => ({ type: "Product", id: p.id })),
      ],
    }),
    addProduct: builder.mutation({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: ["Product"],       // refetch every product list
    }),
  }),
});

export const { useGetProductsQuery, useAddProductMutation } = api;

// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import { api } from "../services/api";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

// src/features/products/ProductsPage.jsx
import { useGetProductsQuery, useAddProductMutation } from "../../services/api";

export function ProductsPage() {
  const { data: products = [], isLoading, isFetching, error, refetch } =
    useGetProductsQuery("Pune");
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p role="alert">Could not load products</p>;

  return (
    <div>
      <button onClick={refetch} disabled={isFetching}>Refresh</button>
      <button
        disabled={isAdding}
        onClick={() => addProduct({ name: "Filter Coffee", price: 60 })}
      >
        Add product
      </button>
      <ul>{products.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
    </div>
  );
}`
    },
    {
      heading: "12. Choosing Between Context, Zustand, Redux Toolkit and TanStack Query",
      content: `There is no single best state library; there is a best tool **for each kind of state**. Ask two questions about every piece of data: **Where does the source of truth live — browser or server?** and **How often does it change and how many components read it?**
**Server state (products, orders, profiles, search results)** → **TanStack Query v5** or **RTK Query**. Both give you caching keyed by parameters, request deduplication, \`isPending\`/\`isLoading\` flags, background refetch on window focus, retries and invalidation after mutations. Writing this yourself in a store is the number-one mistake in React apps. With TanStack Query you call \`useQuery({ queryKey: ["products", city], queryFn })\`; with RTK Query you call the generated hook. Pick RTK Query if you already have Redux, TanStack Query otherwise.
**Rarely changing, app-wide values (theme, locale, current user object, feature flags, injected services)** → **Context**. Zero dependencies, idiomatic, and React 19's \`<Context>\` provider syntax plus \`use()\` make it pleasant. Re-render cost is irrelevant when the value changes once per session.
**Client state shared across unrelated components that changes often (cart, filters, multi-step wizard, drafts, UI panels, notifications)** → **Zustand** for most teams. Selector-based subscriptions keep renders surgical, \`persist\` is one line, there is no Provider, and the store is reachable from plain modules. It is the pragmatic default for Vite SPAs and for Next.js client components.
**Large, complex client state with many contributors, strict conventions, or an existing Redux codebase** → **Redux Toolkit**. Its single-store, action-log model shines when you need an audit trail, time-travel debugging, middleware for logging or analytics, and a shared vocabulary that scales across teams. The extra ceremony is a feature when forty developers touch the same state.
**Practical combinations seen in production:**
• Small/medium app: TanStack Query + a Zustand store + Context for theme and auth.
• Enterprise app: RTK Query + Redux Toolkit slices + Context for dependency injection.
• Content site with little client state: TanStack Query + local state only.
Rules of thumb: start local; lift; add Context for static values; add TanStack Query the moment you fetch; add Zustand when two unrelated screens share mutable client state; add Redux Toolkit when the team or the state model demands structure. Never put server data in Zustand or Redux "to cache it" — that is the job of the query libraries.`,
      codeSnippet: `// src/App.jsx — a typical modern Vite + React 19 setup
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { createContext, use } from "react";

// 1) Server state: TanStack Query v5
const queryClient = new QueryClient();

function Restaurants({ city }) {
  const { data, isPending, error } = useQuery({
    queryKey: ["restaurants", city],
    queryFn: () => fetch("/api/restaurants?city=" + city).then((r) => r.json()),
    staleTime: 60_000,
  });
  if (isPending) return <p>Loading…</p>;
  if (error) return <p>Failed to load</p>;
  return <ul>{data.map((r) => <li key={r.id}>{r.name}</li>)}</ul>;
}

// 2) Client state shared by unrelated screens: Zustand
const useFilterStore = create((set) => ({
  city: "Hyderabad",
  vegOnly: false,
  setCity: (city) => set({ city }),
  toggleVeg: () => set((s) => ({ vegOnly: !s.vegOnly })),
}));

// 3) Rarely changing app-wide value: Context
const ThemeContext = createContext("light");

function Header() {
  const theme = use(ThemeContext);
  const city = useFilterStore((s) => s.city);
  return <header className={theme}>Delivering to {city}</header>;
}

export default function App() {
  const city = useFilterStore((s) => s.city);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext value="dark">
        <Header />
        <Restaurants city={city} />
      </ThemeContext>
    </QueryClientProvider>
  );
}`
    },
    {
      heading: "13. Real-World Use Cases: How Global State Is Used in Production",
      content: `Here is how these tools show up in shipped products, so you can recognise the patterns in codebases you join.
**E-commerce cart (Zustand + persist).** The cart must survive a page refresh and be readable from the checkout API client. A persisted Zustand store with \`partialize\` keeps \`items\` and \`coupon\` in \`localStorage\`, \`getState()\` feeds the order payload, and selectors keep the header badge cheap. Flipkart-style "save for later" is just a second array in the same slice.
**Authentication and tokens (Zustand or Redux + interceptor).** The access token is read in an Axios or \`fetch\` wrapper via \`getState()\`; a 401 response triggers a \`logout\` action from outside React. The user object itself is usually also exposed through Context for convenience, but the source of truth is the store.
**Dashboards with heavy filters (Redux Toolkit).** An analytics dashboard where date range, selected branches, metrics and chart options interact in dozens of panels benefits from Redux's action log: product managers can replay a bug report exactly by replaying actions. \`createSelector\` keeps the derived aggregations fast.
**Real-time trading or ride-tracking UI (Zustand + subscribe).** WebSocket ticks call \`setState\` hundreds of times per second. Components subscribe to one symbol or one ride; \`useShallow\` and primitive selectors prevent full-page renders. \`subscribeWithSelector\` triggers sounds or notifications without rendering.
**Admin panels and CRUD-heavy apps (RTK Query or TanStack Query).** Ninety percent of the "state" is server data: lists, details, forms. Tag-based invalidation means after \`updateUser\` succeeds, the user list refetches on its own — no manual cache surgery.
**Multi-step forms and wizards (Zustand, not persisted or session-persisted).** A KYC or onboarding flow across five routes stores answers in a store so users can go back and forth; \`sessionStorage\` persistence survives accidental reloads without leaking data across sessions.
**Design systems and theming (Context).** Theme, density, locale and the i18n function are provided once at the root and read everywhere; they change at most a few times per session.`
    },
    {
      heading: "14. Common Mistakes with Zustand and Redux Toolkit and How to Fix Them",
      content: `**1. Putting server data in the store "as a cache".** Symptoms: stale lists, duplicate fetch logic, manual loading flags everywhere. Fix: move fetched data to TanStack Query or RTK Query; keep only client state in Zustand/Redux.
**2. Selecting the whole store.** \`const store = useCartStore()\` or \`useSelector((s) => s)\` re-renders the component on every update. Fix: select the smallest value you need, preferably a primitive.
**3. Returning new objects from selectors.** In Zustand v5 this throws "Maximum update depth exceeded"; in React-Redux it causes re-renders on every dispatch and a dev warning. Fix: \`useShallow\` (Zustand), \`shallowEqual\` or \`createSelector\` (Redux).
**4. Mutating state outside Immer.** In plain Zustand (no \`immer\` middleware), \`state.items.push(x)\` inside \`set\` mutates the previous state — subscribers see no change. Fix: return a new array, or add the \`immer\` middleware. In RTK, mutation is only safe **inside** case reducers; mutating \`action.payload\` or data from \`getState()\` elsewhere corrupts the store.
**5. Mutating and returning in the same RTK reducer.** \`state.count += 1; return { ...state }\` makes Immer throw. Fix: do one or the other.
**6. Storing non-serialisable values in Redux.** Dates, Map/Set, class instances, promises and functions trigger the serialisability check and break DevTools and persistence. Fix: store ISO strings and plain arrays/objects; keep functions in modules.
**7. Persisting everything.** Persisting loading flags or errors means users reload into a permanent "Loading…" state. Fix: \`partialize\` to the fields that are real data.
**8. Forgetting \`version\`/\`migrate\` in persist.** Renaming a field crashes every existing user with old data in \`localStorage\`. Fix: bump \`version\` and write a \`migrate\`.
**9. Module-level stores leaking across tests.** Test B sees test A's cart. Fix: reset with \`setState(initialState, true)\` in \`beforeEach\`, or create the store inside a factory for tests.
**10. Creating the Redux store inside a component.** \`const store = configureStore(...)\` inside \`App\` makes a fresh store every render. Fix: create it once at module level (or once per request on the server).
**11. Dispatching thunks from reducers or calling \`set\` during render.** Reducers must be pure; calling \`set\` while rendering causes loops. Fix: dispatch from handlers, effects or loaders.
**12. Over-engineering.** A 5-screen app with a \`counter\` slice does not need Redux. Fix: start with local state and add tools when a concrete problem appears.`,
      codeSnippet: `// Mistake 3 (Zustand v5): new object each call -> infinite loop
// const { items, coupon } = useCartStore((s) => ({ items: s.items, coupon: s.coupon }));
// Fix:
import { useShallow } from "zustand/react/shallow";
const { items, coupon } = useCartStore(useShallow((s) => ({ items: s.items, coupon: s.coupon })));

// Mistake 4 (plain Zustand): mutation, no re-render
// addItem: (p) => set((state) => { state.items.push(p); return state; })
// Fix:
// addItem: (p) => set((state) => ({ items: [...state.items, p] }))

// Mistake 5 (RTK): mutate OR return, never both
// increment(state) { state.count += 1; return { ...state }; }   // throws
// increment(state) { state.count += 1; }                        // ok

// Mistake 6 (RTK): non-serialisable value
// setDeadline(state, action) { state.deadline = new Date(); }   // dev warning
// setDeadline(state, action) { state.deadline = new Date().toISOString(); }

// Mistake 9 (tests): reset module-level store
// beforeEach(() => useCartStore.setState({ items: [], coupon: null }, true));`
    },
    {
      heading: "15. Frequently Asked Questions About React State Management",
      content: `**Is Zustand better than Redux Toolkit?**
Neither is universally better. Zustand is smaller, has no boilerplate and no Provider, and is ideal for small-to-medium apps or any app that wants fast, selector-based client state. Redux Toolkit offers a stricter architecture, a complete action history, rich middleware and RTK Query, which pays off in large teams and complex state models. Many senior developers choose Zustand for new projects and Redux Toolkit where structure or an existing Redux codebase demands it.
**Do I still need Redux in 2026 with React 19?**
Not by default. React 19's Context, \`use()\`, Actions and \`useOptimistic\` plus TanStack Query cover most apps. Redux Toolkit remains the right choice for apps with large, interdependent client state, strict auditing needs, or teams that already invested in Redux. "Do I need Redux?" has become "do I need an action log and a single store?".
**Can Zustand replace Context completely?**
Technically yes, but it should not. Context is still the best way to pass rarely changing values and dependencies (theme, locale, services) and to scope a value to a subtree. Zustand's strength is frequently changing client state shared across the app.
**Does Zustand work with React Server Components and Next.js?**
Stores are client-side, so use them in Client Components (\`"use client"\`). For per-request isolation on the server, create the store in a provider using \`createStore\` from \`zustand\` rather than a module-level \`create\`, and be careful with \`persist\` hydration (\`skipHydration\` or a hydrated flag).
**What is the difference between RTK Query and TanStack Query?**
Both manage server state with caching and invalidation. RTK Query lives inside the Redux store and uses tag-based invalidation; TanStack Query is standalone and uses query keys. Pick RTK Query if you use Redux, TanStack Query if you do not. Using both in one app is unnecessary.
**Why does my Zustand component re-render on every state change?**
You are either calling the hook with no selector, or your selector returns a new object/array each time. Select a primitive, or wrap the selector in \`useShallow\`.
**How do I persist Redux state the way Zustand's persist does?**
Redux Toolkit has no built-in persistence. Common options are the \`redux-persist\` library or a small listener middleware that writes selected slices to \`localStorage\` and a \`preloadedState\` passed to \`configureStore\` on startup.
**Should I use the Immer middleware with Zustand?**
Only if your state is deeply nested and spreads become unreadable. For flat state, plain \`set\` with spreads is simpler and avoids the extra dependency; Redux Toolkit includes Immer automatically.`
    },
    {
      heading: "16. Interview Questions and Answers on Zustand and Redux Toolkit",
      content: `**Q1. Explain the difference between local state, Context and a global store.**
Local state is owned by one component (\`useState\`). Context is a delivery mechanism that makes a value available to a subtree without props; the state still lives in a component and all consumers re-render on change. A global store (Zustand, Redux) holds state outside React, lets components subscribe to slices through selectors so only affected components re-render, and can be read or updated from non-React code.
**Q2. How does Zustand decide whether a component re-renders?**
The hook runs your selector after each update and compares the result with the previous result using \`Object.is\`. Only a changed result triggers a render. With \`useShallow\` the comparison becomes shallow so object/array selectors remain stable.
**Q3. What changed in Zustand v5 regarding selectors?**
v5 is built directly on React's \`useSyncExternalStore\`, which requires selectors to return cached snapshots. Selectors that return a new reference each time now cause an infinite loop error instead of silent extra renders; \`useShallow\` from \`zustand/react/shallow\` is the fix. v5 also dropped React 17 support and the deprecated default equality function argument.
**Q4. What does \`configureStore\` do that \`createStore\` did not?**
It combines slice reducers, adds the thunk middleware, enables the Redux DevTools extension, applies dev-only immutability and serialisability checks, and accepts a \`middleware\` callback to extend the defaults. The core \`createStore\` is deprecated in Redux 5 in favour of RTK.
**Q5. How can a reducer "mutate" state in Redux Toolkit when Redux requires immutability?**
\`createSlice\` wraps every case reducer with Immer. Immer gives the reducer a draft proxy, records the mutations, and produces a new immutable object with structural sharing. The real store state is never mutated.
**Q6. What are the three actions generated by \`createAsyncThunk\` and where do you handle them?**
\`pending\`, \`fulfilled\` and \`rejected\`, named \`<typePrefix>/pending\` and so on. They are handled in a slice's \`extraReducers\` with \`builder.addCase\`.
**Q7. Why is \`useSelector\` returning a new object a performance bug?**
\`useSelector\` compares results with \`===\`. A new object is never equal to the previous one, so the component re-renders after every dispatch in the app. Use primitives, \`shallowEqual\`, or a memoised \`createSelector\`.
**Q8. How does RTK Query know when to refetch?**
Through tags. Queries declare \`providesTags\`; mutations declare \`invalidatesTags\`. When a mutation succeeds, every active query providing an invalidated tag refetches. Queries also refetch on remount after \`keepUnusedDataFor\` expires and optionally on window focus or reconnect.
**Q9. How would you share the auth token with an Axios interceptor?**
Read it from the store outside React: \`useAuthStore.getState().token\` in Zustand or \`store.getState().auth.token\` in Redux. Context cannot do this because it only exists inside the component tree.
**Q10. Describe how you would structure state for a food-delivery app.**
Restaurants, menus and orders are server state → TanStack Query or RTK Query. Cart, delivery address draft and filters are shared client state → Zustand (persisted with \`partialize\`) or Redux slices. Theme, locale and the current user object → Context. Input values and open/closed modals → local state.`
    },
    {
      heading: "17. Hands-On Exercise — Persistent Shopping Cart with Zustand v5",
      content: `Build a complete grocery cart that demonstrates everything from the Zustand half of this lecture: a store with actions, primitive and \`useShallow\` selectors, derived totals, a coupon rule, and \`persist\` with \`partialize\` so the cart survives a refresh.
**Setup:** \`npm create vite@latest zustand-cart -- --template react\`, then \`npm install zustand\`. Replace \`src/App.jsx\` with the code below and run \`npm run dev\`.
**What to observe:**
1. Open the browser console. Each component logs when it renders. Add an item: \`ProductList\` does **not** re-render (it selects only the \`addItem\` function, which never changes), \`CartBadge\` re-renders only when the quantity count changes, and \`CouponBox\` never re-renders when you change quantities.
2. Apply the coupon \`FIRST50\` — the total drops by 50 percent up to ₹100. Quantity changes recompute the discount through the selector; nothing is stored twice.
3. Refresh the page — the items and coupon come back from \`localStorage\` under the key \`grocery-cart\`, but \`hasHydrated\` is not persisted.
4. Open Application → Local Storage in DevTools to inspect the persisted JSON.
**Stretch goals:** add a \`savedForLater\` array with "Save for later" and "Move to cart" actions; add the \`devtools\` middleware with action names and watch the log in the Redux DevTools extension; then rewrite the same cart as a Redux Toolkit slice using the code from Sections 8 and 9 and compare the two.`,
      codeSnippet: `// src/App.jsx — complete, runnable (Vite + React 19 + Zustand v5)
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

// ---------- Store ----------
const PRODUCTS = [
  { id: "p1", name: "Basmati Rice 5kg", price: 499 },
  { id: "p2", name: "Toor Dal 1kg", price: 160 },
  { id: "p3", name: "Amul Butter 500g", price: 285 },
  { id: "p4", name: "Filter Coffee 250g", price: 220 },
];

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],              // [{ id, name, price, qty }]
      coupon: null,
      hasHydrated: false,

      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, qty: i.qty + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...product, qty: 1 }] };
        }),

      setQty: (id, qty) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, qty } : i))
            .filter((i) => i.qty > 0),
        })),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      applyCoupon: (code) => {
        const valid = code.trim().toUpperCase() === "FIRST50";
        set({ coupon: valid ? "FIRST50" : null });
        return valid;
      },

      clearCart: () => set({ items: [], coupon: null }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "grocery-cart",
      partialize: (s) => ({ items: s.items, coupon: s.coupon }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    }
  )
);

// ---------- Selectors (reusable, testable) ----------
const selectCount = (s) => s.items.reduce((n, i) => n + i.qty, 0);
const selectSubtotal = (s) => s.items.reduce((sum, i) => sum + i.price * i.qty, 0);
const selectDiscount = (s) =>
  s.coupon === "FIRST50" ? Math.min(100, Math.round(selectSubtotal(s) * 0.5)) : 0;

// ---------- Components ----------
function CartBadge() {
  console.log("render: CartBadge");
  const count = useCartStore(selectCount);           // primitive -> stable
  return <span style={badge}>Cart: {count}</span>;
}

function ProductList() {
  console.log("render: ProductList");
  const addItem = useCartStore((s) => s.addItem);    // function identity never changes
  return (
    <section>
      <h3>Products</h3>
      {PRODUCTS.map((p) => (
        <div key={p.id} style={row}>
          <span>{p.name} — ₹{p.price}</span>
          <button style={btn} onClick={() => addItem(p)}>Add</button>
        </div>
      ))}
    </section>
  );
}

function CartItems() {
  console.log("render: CartItems");
  const { items, setQty, removeItem } = useCartStore(
    useShallow((s) => ({ items: s.items, setQty: s.setQty, removeItem: s.removeItem }))
  );
  if (items.length === 0) return <p>Your cart is empty.</p>;
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {items.map((i) => (
        <li key={i.id} style={row}>
          <span>{i.name}</span>
          <span>
            <button style={btn} onClick={() => setQty(i.id, i.qty - 1)}>-</button>
            <strong style={{ margin: "0 10px" }}>{i.qty}</strong>
            <button style={btn} onClick={() => setQty(i.id, i.qty + 1)}>+</button>
            <button style={{ ...btn, background: "#ef4444", marginLeft: 10 }} onClick={() => removeItem(i.id)}>
              Remove
            </button>
          </span>
        </li>
      ))}
    </ul>
  );
}

function CouponBox() {
  console.log("render: CouponBox");
  const coupon = useCartStore((s) => s.coupon);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  function onSubmit(e) {
    e.preventDefault();
    const code = new FormData(e.currentTarget).get("code");
    if (!applyCoupon(String(code))) alert("Invalid coupon. Try FIRST50");
    e.currentTarget.reset();
  }
  return (
    <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, margin: "12px 0" }}>
      <input name="code" placeholder="Coupon code" style={input} />
      <button type="submit" style={btn}>Apply</button>
      {coupon && <span>Applied: {coupon}</span>}
    </form>
  );
}

function Totals() {
  console.log("render: Totals");
  const subtotal = useCartStore(selectSubtotal);
  const discount = useCartStore(selectDiscount);
  const clearCart = useCartStore((s) => s.clearCart);
  return (
    <div style={{ borderTop: "1px solid #cbd5e1", paddingTop: 12 }}>
      <p>Subtotal: ₹{subtotal}</p>
      <p>Discount: −₹{discount}</p>
      <p><strong>Payable: ₹{subtotal - discount}</strong></p>
      <button style={{ ...btn, background: "#64748b" }} onClick={clearCart}>Clear cart</button>
    </div>
  );
}

export default function App() {
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  return (
    <div style={card}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: "#002057", margin: 0 }}>Lecture 25: Zustand Cart</h2>
        <CartBadge />
      </header>
      <ProductList />
      <h3>Your cart</h3>
      {hasHydrated ? <CartItems /> : <p>Restoring your cart…</p>}
      <CouponBox />
      <Totals />
    </div>
  );
}

// ---------- Styles ----------
const card = { maxWidth: 600, margin: "30px auto", padding: 24, background: "#fff", border: "1px solid #cbd5e1", borderRadius: 16, fontFamily: "system-ui" };
const row = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9" };
const btn = { background: "#2506ad", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer" };
const badge = { background: "#f97316", color: "#fff", padding: "4px 10px", borderRadius: 999, fontWeight: 600 };
const input = { flex: 1, padding: 8, border: "1px solid #cbd5e1", borderRadius: 6 };

// Expected console output after clicking "Add" on Basmati Rice once:
// render: CartBadge
// render: CartItems
// render: Totals
// (ProductList and CouponBox do NOT re-render)`
    },
    {
      heading: "18. Summary",
      content: `• **Global state** is data many unrelated components read and write. Start local, lift, use Context for rarely changing values, and reach for a store only when updates are frequent, state must be read outside React, or the state model is complex.
• Separate **client state** (cart, filters, UI) from **server state** (products, orders). Server state belongs in **TanStack Query v5** or **RTK Query**, never hand-cached in a store.
• **Zustand v5**: \`create((set, get) => ({...}))\` returns a hook; \`set\` merges one level; actions live in the store; \`getState\`/\`setState\`/\`subscribe\` work outside React.
• Selectors re-render a component only when the selected value changes by \`Object.is\`. Select primitives; wrap object/array selectors in **\`useShallow\`** or v5 throws an infinite-loop error.
• Middleware compose by nesting: **\`persist\`** (\`name\`, \`partialize\`, \`version\`/\`migrate\`, hydration flag), **\`devtools\`** (Redux DevTools with action names), **\`immer\`** (mutating syntax). Organise big stores with the **slices pattern**.
• **Redux Toolkit 2**: \`configureStore\` sets up reducers, thunk, DevTools and dev checks; \`createSlice\` generates Immer-powered reducers, action creators (\`"cart/addItem"\`) and \`selectors\`.
• **React-Redux 9**: \`<Provider>\`, \`useSelector\` (strict equality — use primitives, \`shallowEqual\` or \`createSelector\`), \`useDispatch\`; typed hooks via \`withTypes\`.
• Async in RTK: \`createAsyncThunk\` + \`extraReducers\` for workflows; **RTK Query** (\`createApi\`, \`fetchBaseQuery\`, tags, generated hooks) for fetching and caching.
• Decision guide: Context for static app-wide values, Zustand for shared mutable client state, Redux Toolkit for large structured state and teams, TanStack Query or RTK Query for everything that comes from a server.
**Next lecture:** Testing React Applications — Vitest, React Testing Library & MSW`
    }
  ]
};
