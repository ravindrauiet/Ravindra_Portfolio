export const lecture19 = {
  slug: "lecture-19",
  number: 19,
  title: "Complete React Course — Module 6: Lecture 19: useReducer & Scalable State Architecture",
  summary: "Learn when to move from useState to useReducer, how to write reducers as pure functions driven by typed actions, and how to combine useReducer with Context for app-wide state. Also covers Immer (use-immer) for simpler immutable updates, structuring state to avoid redundancy and duplication, and thinking about UI as a state machine.",
  readTime: "30 min read",
  difficulty: "Intermediate",
  date: "2026-10-08",
  sections: [
    {
      heading: "1. When useState Starts to Struggle",
      content: `In the previous lecture we used Context to share state without prop drilling. But we have not yet asked a different question: **how should the state itself be organised** once it grows?
\`useState\` is perfect for independent values: a toggle, an input, a counter. Problems appear when one user action has to change several pieces of state together, and when the same kind of update is written in many event handlers.
Look at the checkout form below. Submitting touches four state variables. Every handler must remember the correct combination, and nothing stops a bug like \`isLoading: true\` together with \`error: "Payment failed"\`.
Signs you have outgrown plain \`useState\`:
• Several \`setX\` calls always happen together.
• The next state depends on several current values at once.
• Update logic is spread across many handlers and is hard to test.
• Some combinations of values should be impossible, but nothing prevents them.
React's answer is **\`useReducer\`**: move all the update logic into one function, outside the component, and let event handlers simply describe **what happened**.`,
      codeSnippet: `// Scattered state updates: easy to get out of sync
import { useState } from "react";

function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [attempts, setAttempts] = useState(0);

  async function handlePay() {
    setIsLoading(true);
    setError(null);
    setAttempts((a) => a + 1);
    try {
      const id = await placeOrder();       // assume this calls your API
      setOrderId(id);
    } catch (err) {
      setError(err.message);               // forgot setIsLoading(false)? Spinner forever.
    }
    setIsLoading(false);
  }

  return <button onClick={handlePay} disabled={isLoading}>Pay ₹1,499</button>;
}`
    },
    {
      heading: "2. What Is useReducer? Syntax and Mental Model",
      content: `\`useReducer\` is a built-in hook for state whose updates follow clear rules. It takes a **reducer function** and an **initial state**, and returns the current state plus a **dispatch** function.
The flow is always the same:
1. An event handler calls \`dispatch(action)\`. An **action** is a plain object describing what happened, such as \`{ type: "incremented" }\`.
2. React calls your reducer with the current state and that action: \`reducer(state, action)\`.
3. The reducer returns the **next state**. React stores it and re-renders the component.
The name comes from \`Array.prototype.reduce\`: a reducer takes an accumulated value and one item, and returns the new accumulated value. Here the "items" are actions arriving over time.
Key facts:
• **Signature:** \`const [state, dispatch] = useReducer(reducer, initialArg, init?)\`. The optional third argument is a lazy initialiser (section 6).
• **\`dispatch\` has a stable identity** — it is the same function on every render, so it is safe to pass down or put in effect dependency lists.
• **Bail-out:** if the reducer returns the exact same state object (checked with \`Object.is\`), React can skip re-rendering children.
• **Updates are batched**, just like \`setState\`. After \`dispatch\`, the \`state\` variable in the current render still holds the old value until the next render.`,
      codeSnippet: `// src/Counter.jsx
import { useReducer } from "react";

function counterReducer(state, action) {
  switch (action.type) {
    case "incremented":
      return { count: state.count + 1 };
    case "decremented":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
    default:
      throw new Error("Unknown action: " + action.type);
  }
}

export default function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "decremented" })}>-</button>
      <button onClick={() => dispatch({ type: "incremented" })}>+</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
}`
    },
    {
      heading: "3. Reducers Must Be Pure Functions",
      content: `A reducer is a **pure function**: given the same \`state\` and \`action\`, it always returns the same result, and it does nothing else. That gives three rules:
• **No mutation.** Never change \`state\` or anything inside it. Return a new object or array, using the same spread, \`map\` and \`filter\` patterns from Lectures 11 and 12.
• **No side effects.** No \`fetch\`, no \`localStorage\`, no timers, no \`console\` noise you rely on, no \`Math.random()\` or \`Date.now()\` inside the reducer. Do those in event handlers or effects, then dispatch the result.
• **Always return a state.** Every path must return something. Forgetting a \`return\` makes the state \`undefined\`.
Why this matters:
• React may call your reducer **twice in development** under \`<StrictMode>\` to help you catch impurities. A pure reducer gives the same answer both times; an impure one shows bugs immediately.
• Pure reducers are **trivially testable**: call the function with a state and an action, check the result. No rendering required.
• Rendering stays predictable, which is what lets features like concurrent rendering and React Compiler work safely.
If you need a random ID or the current time, generate it in the event handler and put it **in the action**.`,
      codeSnippet: `// BAD: mutates state and has side effects
function badReducer(state, action) {
  if (action.type === "added") {
    state.items.push({ id: Date.now(), text: action.text }); // mutation + impure value
    localStorage.setItem("items", JSON.stringify(state.items)); // side effect
    return state;                                         // same reference: no re-render
  }
  return state;
}

// GOOD: pure; the impure ID is created in the handler and sent in the action
function goodReducer(state, action) {
  if (action.type === "added") {
    return { ...state, items: [...state.items, { id: action.id, text: action.text }] };
  }
  return state;
}

// In the component
function handleAdd(text) {
  dispatch({ type: "added", id: crypto.randomUUID(), text });
}

// A reducer test needs no React at all (Vitest)
import { expect, test } from "vitest";
test("adds an item", () => {
  const next = goodReducer({ items: [] }, { type: "added", id: "a1", text: "Buy milk" });
  expect(next.items).toEqual([{ id: "a1", text: "Buy milk" }]);
});`
    },
    {
      heading: "4. Actions and Action Types",
      content: `An **action** is a plain object. By convention it has a \`type\` string plus whatever extra data the reducer needs (sometimes grouped under \`payload\`, sometimes as top-level fields — pick one style and stay consistent).
Good action design:
• **Describe what happened, not what to set.** Prefer \`{ type: "item_added", product }\` over \`{ type: "set_items", items }\`. The reducer decides how state changes; the component just reports the event. This keeps logic in one place.
• **One user interaction, one action.** Clicking "Clear cart" should dispatch one \`cart_cleared\` action, not five separate updates.
• **Send the minimum data.** Send an \`id\`, not the whole updated list.
• **Use a consistent naming style**, such as past tense (\`added\`, \`removed\`) or \`domain/event\` (\`cart/itemAdded\`, the style Redux Toolkit uses).
• **Throw on unknown types** in the \`default\` branch so a typo like \`"incremnted"\` fails loudly instead of silently doing nothing.
To avoid typos in larger apps, keep action types as constants, or write small **action creator** functions that build the objects. TypeScript users usually describe actions as a discriminated union so the compiler checks every \`type\` and its fields.`,
      codeSnippet: `// src/cart/cartActions.js
export const CART_ACTIONS = {
  ITEM_ADDED: "cart/itemAdded",
  ITEM_REMOVED: "cart/itemRemoved",
  QUANTITY_CHANGED: "cart/quantityChanged",
  COUPON_APPLIED: "cart/couponApplied",
  CLEARED: "cart/cleared",
};

// Action creators: one place that knows each action's shape
export const addItem = (product) => ({ type: CART_ACTIONS.ITEM_ADDED, product });
export const removeItem = (id) => ({ type: CART_ACTIONS.ITEM_REMOVED, id });
export const changeQuantity = (id, quantity) => ({
  type: CART_ACTIONS.QUANTITY_CHANGED,
  id,
  quantity,
});
export const applyCoupon = (code) => ({ type: CART_ACTIONS.COUPON_APPLIED, code });
export const clearCart = () => ({ type: CART_ACTIONS.CLEARED });

// Usage in a component
// dispatch(addItem({ id: "p1", name: "Masala Chai", price: 120 }));`
    },
    {
      heading: "5. Complex State Transitions: A Shopping Cart Reducer",
      content: `Here is where reducers shine. A cart has several related rules: adding an existing product increases its quantity, quantity can never drop below one, removing deletes the line, a coupon is validated, and clearing resets everything.
Notice how each case handles **one event** and returns a complete new state. Every rule about the cart now lives in a single function you can read top to bottom, and any component can trigger these transitions with a one-line \`dispatch\`.
Also notice what is **not** in the state: the subtotal, discount and total. They are calculated from the items and coupon (section 10 explains why).`,
      codeSnippet: `// src/cart/cartReducer.js
import { CART_ACTIONS as A } from "./cartActions";

const COUPONS = { DIWALI10: 0.1, FIRST50: 0.5 };

export const initialCart = { items: [], coupon: null, couponError: null };

export function cartReducer(state, action) {
  switch (action.type) {
    case A.ITEM_ADDED: {
      const existing = state.items.find((i) => i.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.product, quantity: 1 }] };
    }
    case A.ITEM_REMOVED:
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case A.QUANTITY_CHANGED: {
      const quantity = Math.max(1, action.quantity);
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.id ? { ...i, quantity } : i)),
      };
    }
    case A.COUPON_APPLIED: {
      const code = action.code.trim().toUpperCase();
      if (!(code in COUPONS)) {
        return { ...state, coupon: null, couponError: "Invalid coupon code" };
      }
      return { ...state, coupon: code, couponError: null };
    }
    case A.CLEARED:
      return initialCart;
    default:
      throw new Error("Unknown cart action: " + action.type);
  }
}

// Derived values: calculated, never stored
export function getCartTotals(state) {
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = state.coupon ? Math.round(subtotal * COUPONS[state.coupon]) : 0;
  return { subtotal, discount, total: subtotal - discount };
}`
    },
    {
      heading: "6. Lazy Initialisation and Resetting State",
      content: `The optional third argument of \`useReducer\` is an **init function**. React calls \`init(initialArg)\` **once**, on the first render, and uses the result as the initial state. This is useful when building the initial state is expensive — for example, reading and parsing a saved cart from \`localStorage\`.
Pass the function itself, not the result of calling it. \`useReducer(reducer, null, loadCart)\` runs \`loadCart\` once; \`useReducer(reducer, loadCart())\` would call it on every render and throw the result away (the same idea as lazy initial state in \`useState\`).
Saving to \`localStorage\` is a side effect, so it belongs in a \`useEffect\`, never in the reducer.
To **reset** state, you have two options: dispatch a \`reset\` action that returns the initial state, or give the component a different \`key\` so React mounts a fresh instance — handy when switching between, say, two different customers' forms.`,
      codeSnippet: `// src/cart/usePersistentCart.js
import { useEffect, useReducer } from "react";
import { cartReducer, initialCart } from "./cartReducer";

const STORAGE_KEY = "cart-v1";

function loadCart(fallback) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;   // private mode or corrupted data
  }
}

export function usePersistentCart() {
  // loadCart(initialCart) runs only on the first render
  const [cart, dispatch] = useReducer(cartReducer, initialCart, loadCart);

  // Side effect lives in an effect, not in the reducer
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // storage unavailable: ignore
    }
  }, [cart]);

  return [cart, dispatch];
}`
    },
    {
      heading: "7. useReducer vs useState — How to Choose",
      content: `Both hooks manage local component state, and under the hood \`useState\` is essentially a reducer with a built-in "replace the value" rule. You can convert between them freely, so the choice is about readability.
**Prefer \`useState\` when:**
• The state is a few independent primitives (a toggle, an input value).
• Updates are simple replacements or a single calculation.
• The component is small and the logic is obvious at a glance.
**Prefer \`useReducer\` when:**
• Many pieces of state change together in response to one event.
• The next state depends on the previous state in non-trivial ways.
• You want the update logic **out of the component**, in one pure, testable function.
• You want a clear log of "what happened" — you can \`console.log\` every action in one place while debugging.
• You plan to share the logic through Context (next section) — passing one \`dispatch\` is simpler than passing ten setters.
Some honest trade-offs: a reducer means **more code** (action objects, a switch statement), and readers jump between the component and the reducer file. For a single boolean, \`useReducer\` is overkill.
A good rule of thumb: start with \`useState\`. When you notice several setters always called together, or bugs from inconsistent updates, refactor to \`useReducer\`. You can even mix both in one component.`
    },
    {
      heading: "8. Combining useReducer with Context for App-Wide State",
      content: `\`useReducer\` organises updates; Context (Lecture 18) delivers values deep into the tree. Together they give you a lightweight app-wide store without any library:
1. Call \`useReducer\` in a **provider component** near the top of the tree.
2. Put \`state\` in one context and \`dispatch\` in **another**.
3. Expose **custom hooks** (\`useCart\`, \`useCartDispatch\`) that throw if used outside the provider.
Why two contexts? \`dispatch\` never changes identity, so components that only **send** actions (like an "Add to cart" button on every product card) read only the dispatch context and **do not re-render** when the cart changes. Only components that read the state re-render.
In React 19 you render the context directly as a provider: \`<CartContext value={cart}>\`.
This pattern is great for moderate global state such as a cart, a multi-step form or a notifications list. Every consumer of the state context still re-renders on every change, so for very large, frequently updated state with fine-grained subscriptions, a store library like **Zustand v5** or **Redux Toolkit 2** is a better fit. Redux Toolkit's \`createSlice\` is built on exactly the reducer and action ideas from this lecture.`,
      codeSnippet: `// src/cart/CartContext.jsx
import { createContext, useContext, useReducer } from "react";
import { cartReducer, initialCart } from "./cartReducer";

const CartContext = createContext(null);
const CartDispatchContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  return (
    <CartContext value={cart}>
      <CartDispatchContext value={dispatch}>{children}</CartDispatchContext>
    </CartContext>
  );
}

export function useCart() {
  const cart = useContext(CartContext);
  if (cart === null) throw new Error("useCart must be used inside <CartProvider>");
  return cart;
}

export function useCartDispatch() {
  const dispatch = useContext(CartDispatchContext);
  if (dispatch === null) throw new Error("useCartDispatch must be used inside <CartProvider>");
  return dispatch;
}

// src/components/AddToCartButton.jsx: reads dispatch only, so it
// does not re-render when the cart contents change
import { useCartDispatch } from "../cart/CartContext";
import { addItem } from "../cart/cartActions";

export function AddToCartButton({ product }) {
  const dispatch = useCartDispatch();
  return <button onClick={() => dispatch(addItem(product))}>Add to cart</button>;
}

// src/components/CartBadge.jsx: reads state, re-renders on change
import { useCart } from "../cart/CartContext";

export function CartBadge() {
  const { items } = useCart();
  const count = items.reduce((n, i) => n + i.quantity, 0);
  return <span>Cart ({count})</span>;
}`
    },
    {
      heading: "9. Simpler Immutable Updates with Immer (use-immer)",
      content: `Spreading nested objects gets painful fast: \`{ ...state, user: { ...state.user, address: { ...state.user.address, city } } }\`. **Immer** is a small library that lets you write code that looks like mutation on a **draft**, then produces a correctly updated immutable copy for you. Unchanged parts keep their old references, so React's comparisons still work.
The \`use-immer\` package wraps Immer in two hooks:
• **\`useImmer(initial)\`** — like \`useState\`, but the updater function receives a draft you can mutate.
• **\`useImmerReducer(reducer, initialState)\`** — like \`useReducer\`, but the reducer receives a draft. You mutate the draft and do not need to return anything (returning a completely new value is also allowed).
Install with \`npm install immer use-immer\`.
Rules to remember:
• Mutate the draft **or** return a new value — not both in the same branch.
• Only the draft is special. Mutating the real \`state\` outside an Immer producer is still a bug.
• Immer adds a small runtime cost and a dependency; for flat state, plain spreads are fine. It pays off with deeply nested data.
Redux Toolkit uses Immer internally, so this style will feel familiar if you move to it later.`,
      codeSnippet: `// src/profile/ProfileForm.jsx
import { useImmerReducer } from "use-immer";

const initialProfile = {
  name: "Rahul Verma",
  address: { city: "Pune", pincode: "411001" },
  skills: ["React", "Node.js"],
};

function profileReducer(draft, action) {
  switch (action.type) {
    case "city_changed":
      draft.address.city = action.city;          // looks like mutation, but it's a draft
      break;
    case "skill_added":
      draft.skills.push(action.skill);
      break;
    case "skill_removed":
      draft.skills = draft.skills.filter((s) => s !== action.skill);
      break;
    case "reset":
      return initialProfile;                     // returning a new value is also allowed
    default:
      throw new Error("Unknown action: " + action.type);
  }
}

export default function ProfileForm() {
  const [profile, dispatch] = useImmerReducer(profileReducer, initialProfile);

  return (
    <div>
      <input
        value={profile.address.city}
        onChange={(e) => dispatch({ type: "city_changed", city: e.target.value })}
      />
      <button onClick={() => dispatch({ type: "skill_added", skill: "TypeScript" })}>
        Add TypeScript
      </button>
      <p>{profile.name} — {profile.address.city} — {profile.skills.join(", ")}</p>
    </div>
  );
}`
    },
    {
      heading: "10. Structuring State: Avoid Redundant and Duplicated State",
      content: `Choosing the right **shape** of state prevents more bugs than any hook. The React docs give a set of principles; the most important ones are:
• **Group related state.** If two values always change together (like \`x\` and \`y\` of a position), keep them in one object.
• **Avoid contradictions.** \`isSending\` and \`isSent\` can both be \`true\` by mistake. Replace them with a single \`status\`: \`"typing" | "sending" | "sent"\`.
• **Avoid redundant state.** If a value can be **calculated** from props or other state during render, don't store it. \`fullName\` from \`firstName\` + \`lastName\`, a cart total from items, a filtered list from items + search text — all should be computed. Stored copies drift out of sync.
• **Avoid duplication.** Don't store the same object in two places. Store a \`selectedId\`, not a copy of the selected item; otherwise editing the item in the list leaves a stale copy in \`selectedItem\`.
• **Avoid deep nesting.** Deeply nested trees are hard to update. Consider **normalising**: store items in an object keyed by ID (\`byId\`) plus an array of IDs for order, the way a database would.
• **Don't mirror props in state** unless you deliberately want only the initial value (name such props \`initialX\`).
If a derived calculation is genuinely expensive, cache it with \`useMemo\` (or rely on React Compiler) rather than storing it in state.`,
      codeSnippet: `// BEFORE: redundant, duplicated, contradictory
const [items, setItems] = useState([]);
const [total, setTotal] = useState(0);              // redundant: derive from items
const [selectedItem, setSelectedItem] = useState(null); // duplicate copy of an item
const [isSending, setIsSending] = useState(false);
const [isSent, setIsSent] = useState(false);       // both true = impossible state

// AFTER: minimal state, everything else derived
const [items, setItems] = useState([]);
const [selectedId, setSelectedId] = useState(null);
const [status, setStatus] = useState("idle");      // "idle" | "sending" | "sent"

const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
const selectedItem = items.find((i) => i.id === selectedId) ?? null;
const isSending = status === "sending";

// Normalised shape for large collections
const normalised = {
  byId: {
    o1: { id: "o1", customer: "Priya", city: "Jaipur" },
    o2: { id: "o2", customer: "Arjun", city: "Kochi" },
  },
  allIds: ["o1", "o2"],
};`
    },
    {
      heading: "11. Thinking in State Machines",
      content: `A **finite state machine** says: the UI is always in exactly **one** of a fixed set of states, and only certain **events** can move it from one state to another. Reducers are a natural fit for this idea.
Take a payment flow. Instead of booleans, define the states \`idle\`, \`processing\`, \`success\` and \`failure\`. Then list allowed transitions:
• \`idle\` + \`PAY\` → \`processing\`
• \`processing\` + \`RESOLVED\` → \`success\`
• \`processing\` + \`REJECTED\` → \`failure\`
• \`failure\` + \`RETRY\` → \`processing\`
Anything else is **ignored**. Clicking "Pay" twice while processing does nothing, because \`processing\` has no \`PAY\` transition. That kills double-charge bugs by design rather than by remembering to disable a button.
Benefits:
• **Impossible states become impossible** — you can't be loading and failed at the same time.
• The UI is a simple \`switch\` on \`state.status\`.
• The transition table doubles as documentation you can discuss with designers and testers.
For complex flows (wizards, uploads with retries, nested or parallel states), the **XState** library offers full statecharts and visual tools. For most components, a reducer that switches on the current status first and the event second is enough.`,
      codeSnippet: `// src/payment/paymentMachine.js
export const initialPayment = { status: "idle", orderId: null, error: null };

export function paymentReducer(state, event) {
  switch (state.status) {
    case "idle":
      if (event.type === "PAY") return { ...state, status: "processing" };
      return state;
    case "processing":
      if (event.type === "RESOLVED") return { status: "success", orderId: event.orderId, error: null };
      if (event.type === "REJECTED") return { ...state, status: "failure", error: event.error };
      return state;                     // PAY while processing is ignored
    case "failure":
      if (event.type === "RETRY") return { ...state, status: "processing", error: null };
      return state;
    case "success":
      return state;                     // final state
    default:
      return state;
  }
}`
    },
    {
      heading: "12. Common Mistakes with useReducer",
      content: `• **Mutating state in the reducer** (\`state.count++; return state;\`) — the same reference is returned, so React bails out and the screen does not update. Return a new object, or use Immer.
• **Forgetting \`...state\`** — returning \`{ items }\` drops every other field. Spread the old state first.
• **Missing \`return\` in a case** — the switch falls through or the state becomes \`undefined\`. Use block-scoped \`case\` bodies (\`case "x": { ... }\`) and always return.
• **Side effects in the reducer** — API calls, \`localStorage\`, timers, toasts. They run twice in Strict Mode and break purity. Do them in handlers or effects.
• **Silently ignoring unknown actions** — a typo in \`type\` becomes an invisible no-op. Throw in \`default\` (state machines that deliberately ignore events are the exception).
• **Reading state right after \`dispatch\`** — \`dispatch\` schedules an update; \`state\` in the current render is still the old value. Compute the next value yourself if you need it immediately.
• **Calling the initialiser instead of passing it** — \`useReducer(r, load())\` runs \`load\` every render. Use \`useReducer(r, arg, load)\`.
• **Storing derived values** like totals or filtered lists in reducer state, then forgetting to update them in one of the cases.
• **One huge reducer for the whole app** in a single context, causing every consumer to re-render on every action. Split by domain.
• **Using a reducer for a single boolean** — more ceremony than value.`
    },
    {
      heading: "13. Top React Interview Questions on useReducer",
      content: `**Q1. What is the difference between useState and useReducer?**
Both hold local state. \`useState\` gives you a setter that replaces the value; \`useReducer\` centralises update logic in a reducer and you dispatch actions describing what happened. \`useReducer\` suits related values with complex transitions.
**Q2. Why must a reducer be pure?**
React may call it more than once (for example twice in development Strict Mode) and expects the same result. Purity also makes reducers predictable and easy to unit test.
**Q3. What is an action?**
A plain object, conventionally with a \`type\` field and any data the reducer needs, that describes an event such as \`{ type: "item_added", product }\`.
**Q4. Does dispatch change between renders?**
No. \`dispatch\` has a stable identity, so it is safe in dependency arrays and ideal to pass through context.
**Q5. What does the third argument of useReducer do?**
It is an init function. React calls \`init(initialArg)\` once to compute the initial state, avoiding expensive work on every render.
**Q6. How do you build global state with only React?**
Run \`useReducer\` in a provider component, put \`state\` and \`dispatch\` in separate contexts, and expose custom hooks. Dispatch-only components then avoid re-renders.
**Q7. What is Immer and why use it with reducers?**
Immer lets you write mutating-style code against a draft and produces an immutable result with structural sharing. \`useImmerReducer\` from \`use-immer\` applies it to reducers, removing nested spread boilerplate.
**Q8. What is redundant state? Give an example.**
State that can be computed from other state or props, such as a cart total. Storing it risks inconsistency; calculate it during render instead.
**Q9. How does a state machine help UI code?**
It restricts the UI to known states and allowed transitions, making impossible combinations (loading and error together) unrepresentable and ignoring invalid events like a double submit.`
    },
    {
      heading: "14. Practical Hands-On Exercise — Task Board with useReducer + Context",
      content: `Build a small task board for a team in Bengaluru. Create a Vite project (\`npm create vite@latest reducer-demo -- --template react\`), replace \`src/App.jsx\` with the code below and run \`npm run dev\`. No extra packages are needed.
What it demonstrates:
• A pure \`tasksReducer\` with typed actions that handles add, toggle, edit, delete and clear-completed.
• \`state\` and \`dispatch\` shared through two contexts, with custom hooks that throw outside the provider.
• Minimal state: the filter is separate, and remaining/visible counts are **derived**, not stored.
• A status machine for the "Save to server" button that ignores clicks while saving.
Challenges once it works:
1. Move \`tasksReducer\` into its own file and write three Vitest tests for it.
2. Persist tasks with lazy initialisation and an effect, as in section 6.
3. Rewrite \`tasksReducer\` with \`useImmerReducer\` and compare the code.`,
      codeSnippet: `// src/App.jsx
import { createContext, useContext, useReducer, useState } from "react";

// ---------- Reducer (pure) ----------
const initialTasks = [
  { id: "t1", text: "Review pull request", done: false },
  { id: "t2", text: "Book Pune client call", done: true },
];

function tasksReducer(tasks, action) {
  switch (action.type) {
    case "added":
      return [...tasks, { id: action.id, text: action.text, done: false }];
    case "toggled":
      return tasks.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case "edited":
      return tasks.map((t) => (t.id === action.id ? { ...t, text: action.text } : t));
    case "deleted":
      return tasks.filter((t) => t.id !== action.id);
    case "cleared_completed":
      return tasks.filter((t) => !t.done);
    default:
      throw new Error("Unknown action: " + action.type);
  }
}

// ---------- Context ----------
const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>{children}</TasksDispatchContext>
    </TasksContext>
  );
}

function useTasks() {
  const v = useContext(TasksContext);
  if (v === null) throw new Error("useTasks must be used inside <TasksProvider>");
  return v;
}

function useTasksDispatch() {
  const v = useContext(TasksDispatchContext);
  if (v === null) throw new Error("useTasksDispatch must be used inside <TasksProvider>");
  return v;
}

// ---------- Save button as a small state machine ----------
function saveReducer(state, event) {
  if (state === "idle" && event === "SAVE") return "saving";
  if (state === "saving" && event === "DONE") return "saved";
  if (state === "saved" && event === "SAVE") return "saving";
  return state; // every other event is ignored
}

// ---------- Components ----------
function AddTask() {
  const dispatch = useTasksDispatch();
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch({ type: "added", id: crypto.randomUUID(), text: text.trim() });
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="New task" />
      <button type="submit">Add</button>
    </form>
  );
}

function TaskItem({ task }) {
  const dispatch = useTasksDispatch();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <li style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 0" }}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => dispatch({ type: "toggled", id: task.id })}
      />
      {isEditing ? (
        <input
          value={task.text}
          onChange={(e) => dispatch({ type: "edited", id: task.id, text: e.target.value })}
        />
      ) : (
        <span style={{ textDecoration: task.done ? "line-through" : "none" }}>{task.text}</span>
      )}
      <button onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Done" : "Edit"}</button>
      <button onClick={() => dispatch({ type: "deleted", id: task.id })}>Delete</button>
    </li>
  );
}

function TaskList({ filter }) {
  const tasks = useTasks();
  // Derived, not stored
  const visible = tasks.filter((t) =>
    filter === "active" ? !t.done : filter === "done" ? t.done : true
  );
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {visible.map((t) => (
        <TaskItem key={t.id} task={t} />
      ))}
    </ul>
  );
}

function Footer() {
  const tasks = useTasks();
  const dispatch = useTasksDispatch();
  const [saveStatus, send] = useReducer(saveReducer, "idle");
  const remaining = tasks.filter((t) => !t.done).length;

  function handleSave() {
    if (saveStatus === "saving") return;
    send("SAVE");
    setTimeout(() => send("DONE"), 1000); // pretend API call
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
      <span>{remaining} task(s) left</span>
      <button onClick={() => dispatch({ type: "cleared_completed" })}>Clear completed</button>
      <button onClick={handleSave} disabled={saveStatus === "saving"}>
        {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved" : "Save to server"}
      </button>
    </div>
  );
}

export default function App() {
  const [filter, setFilter] = useState("all");

  return (
    <TasksProvider>
      <main style={{ maxWidth: 480, margin: "40px auto", fontFamily: "system-ui" }}>
        <h2 style={{ color: "#002057" }}>Lecture 19: Team Task Board</h2>
        <AddTask />
        <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
          {["all", "active", "done"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} disabled={filter === f}>
              {f}
            </button>
          ))}
        </div>
        <TaskList filter={filter} />
        <Footer />
      </main>
    </TasksProvider>
  );
}`
    },
    {
      heading: "15. Summary",
      content: `• Move from \`useState\` to **\`useReducer\`** when several values change together, transitions are complex, or update logic is scattered across handlers.
• \`useReducer(reducer, initialArg, init?)\` returns \`[state, dispatch]\`. Handlers **dispatch actions**; the reducer computes the next state.
• Reducers must be **pure**: no mutation, no side effects, always return a state. Strict Mode may call them twice in development to expose impurities.
• **Actions** are plain objects with a \`type\`. Describe what happened, keep payloads small, use consistent names, and throw on unknown types.
• \`dispatch\` is **stable**; use the optional **init function** for expensive initial state, and a \`key\` or a \`reset\` action to start over.
• **useReducer + Context** makes a lightweight app-wide store. Split \`state\` and \`dispatch\` into separate contexts so dispatch-only components skip re-renders. Reach for Zustand or Redux Toolkit when state is large and changes often.
• **Immer** (\`useImmer\`, \`useImmerReducer\` from \`use-immer\`) lets you "mutate" a draft and still get immutable updates — most valuable for nested data.
• **Structure state well:** group related values, prefer one \`status\` over contradictory booleans, derive instead of storing, store IDs instead of duplicate objects, and normalise deep data.
• **State machines** limit the UI to known states and allowed transitions, making impossible states impossible.
**Next lecture:** Custom Hooks — Reusing Stateful Logic`
    }
  ]
};
