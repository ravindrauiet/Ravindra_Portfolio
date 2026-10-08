export const lecture17 = {
  slug: "lecture-17",
  number: 17,
  title: "Complete React Course — Module 5: Lecture 17: Lifting State Up, Composition & Reusable Component Patterns",
  summary: "Learn how to share state between components by keeping a single source of truth and lifting state to the closest common parent, how child components talk back through callbacks, and how to build flexible components with children, slots, compound components, render props, custom hooks and the container/presentational split.",
  readTime: "31 min read",
  difficulty: "Intermediate",
  date: "2026-10-08",
  sections: [
    {
      heading: "1. Why Component Design Matters",
      content: `In the previous lecture you built forms whose inputs were controlled by state. Every example kept its state inside a single component. Real apps are different: a search box filters a product list, a cart icon in the header shows how many items were added in a product card, and a checkout summary reacts to a coupon field three components away.
As soon as two components need the **same** piece of data, you have to decide two things:
• **Where does this state live?** One component must own it.
• **How do other components read and change it?** Through props going down and callbacks going up.
The second half of this lecture is about a related skill: designing components that are **reusable** without becoming a mess of boolean props. React gives you a small set of patterns for this: composition with \`children\`, slots, compound components, render props, custom hooks and the container/presentational split.
By the end you will be able to look at a UI, decide where each piece of state belongs, and choose the right pattern for a reusable component.`
    },
    {
      heading: "2. Single Source of Truth",
      content: `A **single source of truth** means every piece of data that can change lives in exactly **one** component's state. Every other component that needs it receives it as a prop (or, later, through Context or a store).
Why it matters:
• **No out-of-sync bugs.** If the cart count is stored in both \`Header\` and \`ProductList\`, sooner or later one updates and the other doesn't.
• **Predictable debugging.** When a value is wrong, there is one place to look.
• **Less code.** You never write "sync" logic that copies one state into another.
A close cousin of this rule: **do not store what you can compute.** If you have \`items\` in state, the total price and the item count are **derived values**. Calculate them during render instead of keeping them in separate \`useState\` calls.`,
      codeSnippet: `// src/CartSummary.jsx
import { useState } from "react";

export default function CartSummary() {
  const [items, setItems] = useState([
    { id: 1, name: "Cotton Kurta", price: 899, qty: 2 },
    { id: 2, name: "Steel Water Bottle", price: 349, qty: 1 },
  ]);

  // BAD: const [total, setTotal] = useState(0);  // duplicate state that can drift
  // GOOD: derive it during render
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <p>
      {itemCount} items, total ₹{total.toLocaleString("en-IN")}
      <button onClick={() => setItems([])}>Clear cart</button>
    </p>
  );
}`
    },
    {
      heading: "3. Lifting State Up — Step by Step",
      content: `**Lifting state up** means moving state from a child component to the **closest common parent** of all the components that need it, then passing it back down as props.
Consider an FAQ accordion where only one panel may be open at a time. If each \`Panel\` keeps its own \`isOpen\` state, two panels can be open together because they don't know about each other. The fix takes three steps:
1. **Remove state from the children.** \`Panel\` no longer calls \`useState\`.
2. **Hard-code the data in the common parent.** \`Accordion\` now holds \`activeIndex\`.
3. **Pass state down and pass a way to change it.** Each \`Panel\` gets \`isActive\` and an \`onShow\` callback.
After lifting, \`Panel\` becomes a **controlled component**: its behaviour is driven by props from the parent. A component with its own local state is **uncontrolled**. Controlled components are more flexible for the parent; uncontrolled ones are simpler to drop in. Many good components start uncontrolled and are lifted only when a parent needs control.`,
      codeSnippet: `// src/Accordion.jsx
import { useState } from "react";

export default function Accordion() {
  // The single source of truth lives in the common parent
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section>
      <h2>Frequently Asked Questions</h2>
      <Panel
        title="Do you ship across India?"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        Yes, we deliver to all PIN codes, including Leh and Port Blair.
      </Panel>
      <Panel
        title="What is the return window?"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        You can return any item within 10 days of delivery.
      </Panel>
    </section>
  );
}

// Panel has NO state now; it is fully controlled by its parent
function Panel({ title, children, isActive, onShow }) {
  return (
    <div className="panel">
      <h3>{title}</h3>
      {isActive ? <p>{children}</p> : <button onClick={onShow}>Show</button>}
    </div>
  );
}`
    },
    {
      heading: "4. Inverse Data Flow with Callbacks",
      content: `Data in React flows **one way: down**, from parent to child through props. So how does a child change the parent's state? The parent passes down a **function**, and the child calls it. This is called **inverse data flow**.
Naming conventions that make this readable:
• Callback **props** start with \`on\`: \`onSearchChange\`, \`onAddToCart\`, \`onSelect\`.
• Handler **functions** in the parent start with \`handle\`: \`handleSearchChange\`.
• The child only reports **what happened** ("the text changed to X"). The parent decides **what to do** with it.
In the example below, \`SearchBar\` and \`ProductTable\` are siblings. Siblings cannot talk directly, so the shared \`query\` lives in \`ProductPage\`. The search bar sends new text up, and the table receives the filtered list down.`,
      codeSnippet: `// src/ProductPage.jsx
import { useState } from "react";

const PRODUCTS = [
  { id: 1, name: "Basmati Rice 5kg", price: 649, inStock: true },
  { id: 2, name: "Masala Chai 250g", price: 180, inStock: true },
  { id: 3, name: "Cold-Pressed Mustard Oil 1L", price: 245, inStock: false },
];

export default function ProductPage() {
  const [query, setQuery] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Derived value, not state
  const visible = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) &&
      (!inStockOnly || p.inStock)
  );

  return (
    <>
      <SearchBar
        query={query}
        inStockOnly={inStockOnly}
        onQueryChange={setQuery}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable products={visible} />
    </>
  );
}

function SearchBar({ query, inStockOnly, onQueryChange, onInStockOnlyChange }) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        value={query}
        placeholder="Search groceries..."
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
        />
        Only show items in stock
      </label>
    </form>
  );
}

function ProductTable({ products }) {
  if (products.length === 0) return <p>No products match your search.</p>;
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>
          {p.name} — ₹{p.price} {p.inStock ? "" : "(out of stock)"}
        </li>
      ))}
    </ul>
  );
}`
    },
    {
      heading: "5. Deciding Where State Should Live",
      content: `Use this checklist for every piece of state in a feature:
1. **List the components that read or change it.**
2. **Find their closest common parent** in the tree.
3. **Put the state there**, or in a component above it if that is more natural.
4. If no component makes sense, **create a new wrapper component** just to hold the state.
Before adding state at all, ask three questions:
• Does it stay the same over time? Then it is not state; make it a constant.
• Is it passed in from a parent? Then it is a prop, not state.
• Can it be computed from existing state or props? Then derive it during render.
**Keep state as low as possible, but no lower.** State that is lifted too high makes the whole tree re-render on every keystroke and forces you to pass props through many layers. State that is too low cannot be shared. When the props have to travel through many components that don't use them, that is **prop drilling**, and the next lecture solves it with the Context API.
**Resetting with a key:** if you want a child's local state to reset when something changes (for example, a chat draft when you switch contacts), you don't always need to lift it. Give the child a \`key\`, such as \`<ChatDraft key={contact.id} />\`; a new key makes React mount a fresh component with fresh state.`
    },
    {
      heading: "6. Composition with children",
      content: `**Composition** means building complex UI by putting components inside other components, instead of creating one giant component with many configuration props.
The simplest composition tool is the special \`children\` prop. Whatever JSX you place between a component's opening and closing tags arrives as \`props.children\`. The wrapper decides **where** that content goes; the parent decides **what** the content is.
This solves a common problem. Without composition, people write a \`Card\` with props like \`showImage\`, \`showButton\`, \`buttonText\` and \`isProductCard\`. With composition, the \`Card\` only provides the frame, and each screen fills it however it likes.
Composition also helps with prop drilling: if a \`Layout\` simply renders \`children\`, the parent can pass data straight to a deeply nested component without going through \`Layout\` at all.`,
      codeSnippet: `// src/Card.jsx
export function Card({ title, children }) {
  return (
    <article className="card">
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-body">{children}</div>
    </article>
  );
}

// src/App.jsx
import { Card } from "./Card";

export default function App() {
  const user = { name: "Ananya Iyer", city: "Chennai" };

  return (
    <main>
      <Card title="Profile">
        {/* Card does not need to know about "user" at all */}
        <p>{user.name}</p>
        <p>{user.city}</p>
      </Card>

      <Card title="Offer of the day">
        <img src="/saree.jpg" alt="Kanchipuram silk saree" width={200} />
        <button>Buy for ₹7,499</button>
      </Card>
    </main>
  );
}`
    },
    {
      heading: "7. Slots — Passing Multiple Pieces of JSX",
      content: `Sometimes one \`children\` area is not enough. A page layout might need a header, a sidebar and the main content in three different places. In React, JSX is just a value, so you can pass it through **any prop**. Props that carry JSX are often called **slots** (a term borrowed from Vue and Web Components).
Guidelines for slots:
• Use \`children\` for the **main** content and named props (\`header\`, \`sidebar\`, \`footer\`, \`actions\`) for the rest.
• Give optional slots a sensible fallback, for example render nothing or a default title.
• Slots keep the layout component in charge of **structure and styling**, while callers stay in charge of **content**.
A familiar real-world example is a modal with \`title\`, \`children\` and \`footer\` slots, so that every dialog in your app looks consistent while showing different buttons.`,
      codeSnippet: `// src/Modal.jsx
export function Modal({ title, footer, children, onClose }) {
  return (
    <div className="backdrop" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header>
          <h2>{title}</h2>
          <button aria-label="Close" onClick={onClose}>×</button>
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </div>
    </div>
  );
}

// src/DeleteAddress.jsx
import { useState } from "react";
import { Modal } from "./Modal";

export default function DeleteAddress() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Delete address</button>
      {open && (
        <Modal
          title="Delete this address?"
          onClose={() => setOpen(false)}
          footer={
            <>
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button className="danger">Delete</button>
            </>
          }
        >
          <p>Flat 402, Lake View Apartments, Pune 411014</p>
        </Modal>
      )}
    </>
  );
}`
    },
    {
      heading: "8. Compound Components",
      content: `**Compound components** are a group of components designed to work together, sharing hidden state through a parent. The HTML \`<select>\` and \`<option>\` pair is the classic example: \`<option>\` is meaningless alone, but together they form one control.
In React, a compound API looks like \`<Tabs>\`, \`<Tabs.List>\`, \`<Tabs.Tab>\` and \`<Tabs.Panel>\`. The user arranges the pieces freely, and the pieces coordinate through state owned by \`<Tabs>\`.
How do the pieces get that shared state without the user passing props to each one? The modern approach is **Context**: the parent provides the active tab, and each sub-component reads it. You will learn Context in depth in the next lecture; for now, notice just two things in the code:
• \`createContext\` creates a channel, and in React 19 you render \`<TabsContext value={...}>\` directly as the provider.
• \`useContext(TabsContext)\` reads the nearest value inside any sub-component.
Older libraries implemented compound components with \`React.Children.map\` and \`cloneElement\` to inject props. The React docs now list those APIs under **Legacy React APIs** because they are fragile (they break when you wrap a child in a \`<div>\`). Prefer Context.
Popular libraries such as Radix UI and Headless UI use this compound pattern heavily.`,
      codeSnippet: `// src/Tabs.jsx
import { createContext, useContext, useState } from "react";

const TabsContext = createContext(null);

export function Tabs({ defaultValue, children }) {
  const [active, setActive] = useState(defaultValue);
  // React 19: render the context itself as the provider
  return (
    <TabsContext value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabsContext>
  );
}

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs.* components must be used inside <Tabs>");
  return ctx;
}

function List({ children }) {
  return <div role="tablist">{children}</div>;
}

function Tab({ value, children }) {
  const { active, setActive } = useTabs();
  return (
    <button
      role="tab"
      aria-selected={active === value}
      onClick={() => setActive(value)}
    >
      {children}
    </button>
  );
}

function Panel({ value, children }) {
  const { active } = useTabs();
  return active === value ? <div role="tabpanel">{children}</div> : null;
}

Tabs.List = List;
Tabs.Tab = Tab;
Tabs.Panel = Panel;

// src/App.jsx
import { Tabs } from "./Tabs";

export default function App() {
  return (
    <Tabs defaultValue="upi">
      <Tabs.List>
        <Tabs.Tab value="upi">UPI</Tabs.Tab>
        <Tabs.Tab value="card">Card</Tabs.Tab>
        <Tabs.Tab value="cod">Cash on Delivery</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="upi">Enter your UPI ID, e.g. name@okaxis</Tabs.Panel>
      <Tabs.Panel value="card">Enter your card details</Tabs.Panel>
      <Tabs.Panel value="cod">Pay ₹40 extra for cash on delivery</Tabs.Panel>
    </Tabs>
  );
}`
    },
    {
      heading: "9. Render Props",
      content: `A **render prop** is a prop whose value is a **function that returns JSX**. The component calls that function and lets the caller decide what to render, while the component itself owns the logic or the structure.
Two common uses:
• **Customising how each item looks** in a reusable list, table or dropdown: \`renderItem={(item) => <Row item={item} />}\`.
• **Sharing behaviour**, such as tracking the mouse position or a toggle, and giving the caller the current values to render with.
Before hooks (React 16.8), render props were the main way to share stateful logic. Today, **custom hooks** handle most "share logic" cases more cleanly, so render props are mainly used for the first case: letting the caller control a piece of the output. You will still see the pattern in libraries; for example, React Router's \`NavLink\` accepts a function as \`className\` or \`children\` that receives \`{ isActive }\`.
Note that \`children\` itself can be a function too; that variant is sometimes called "function as children".`,
      codeSnippet: `// src/SelectableList.jsx
import { useState } from "react";

export function SelectableList({ items, renderItem, emptyText = "Nothing here yet" }) {
  const [selectedId, setSelectedId] = useState(null);

  if (items.length === 0) return <p>{emptyText}</p>;

  return (
    <ul className="selectable-list">
      {items.map((item) => (
        <li key={item.id} onClick={() => setSelectedId(item.id)}>
          {/* The list owns the selection logic; the caller owns the look */}
          {renderItem(item, item.id === selectedId)}
        </li>
      ))}
    </ul>
  );
}

// src/App.jsx
import { SelectableList } from "./SelectableList";

const CITIES = [
  { id: 1, name: "Jaipur", state: "Rajasthan" },
  { id: 2, name: "Kochi", state: "Kerala" },
  { id: 3, name: "Indore", state: "Madhya Pradesh" },
];

export default function App() {
  return (
    <SelectableList
      items={CITIES}
      renderItem={(city, isSelected) => (
        <span style={{ fontWeight: isSelected ? "bold" : "normal" }}>
          {isSelected ? "✓ " : ""}{city.name}, {city.state}
        </span>
      )}
    />
  );
}`
    },
    {
      heading: "10. Higher-Order Components vs Custom Hooks",
      content: `A **higher-order component (HOC)** is a function that takes a component and returns a new component with extra behaviour. The name comes from higher-order functions. Redux's old \`connect()\` and React Router v5's \`withRouter\` were famous HOCs.
HOCs work, but they have real drawbacks:
• **Wrapper hell** — several HOCs nest the tree deeply (\`withAuth(withTheme(withData(Page)))\`), which is hard to read in React DevTools.
• **Prop name collisions** — two HOCs can inject a prop with the same name and silently overwrite each other.
• **Hidden inputs** — reading \`Page\` alone, you cannot tell where its props come from.
**Custom hooks** (functions whose names start with \`use\` and that call other hooks) share **stateful logic** without changing the component tree. The component calls the hook and gets values back explicitly, so there are no collisions and nothing is hidden. Each component that calls a hook gets its **own independent state**; hooks share logic, not data.
Rule of thumb in 2026: **reach for a custom hook first.** Use an HOC only when you must wrap a component you don't own, or when a library expects one. Use a render prop when the caller should control part of the rendered output.
The snippet uses \`useEffect\` to subscribe to the browser's online and offline events; you will study effects in detail in an upcoming lecture.`,
      codeSnippet: `// src/useOnlineStatus.js  — a custom hook (preferred)
import { useEffect, useState } from "react";

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return isOnline;
}

// src/withOnlineStatus.jsx — the same logic as an HOC (older style)
import { useOnlineStatus } from "./useOnlineStatus";

export function withOnlineStatus(WrappedComponent) {
  function WithOnlineStatus(props) {
    const isOnline = useOnlineStatus();
    return <WrappedComponent {...props} isOnline={isOnline} />;
  }
  // Helpful name in React DevTools
  WithOnlineStatus.displayName =
    "withOnlineStatus(" + (WrappedComponent.displayName || WrappedComponent.name) + ")";
  return WithOnlineStatus;
}

// src/SaveButton.jsx — using the hook: explicit and easy to read
import { useOnlineStatus } from "./useOnlineStatus";

export function SaveButton() {
  const isOnline = useOnlineStatus();
  return (
    <button disabled={!isOnline}>
      {isOnline ? "Save progress" : "Reconnecting..."}
    </button>
  );
}`
    },
    {
      heading: "11. Container and Presentational Components",
      content: `The **container/presentational** split separates two jobs:
• **Presentational components** decide **how things look**. They receive data and callbacks through props, contain little or no state (maybe UI state such as "is the dropdown open"), and don't know where data comes from. They are easy to reuse, test and preview in Storybook.
• **Container components** decide **how things work**. They fetch data, hold state, and pass everything down to presentational components.
Dan Abramov popularised this pattern in 2015 and later wrote that he no longer recommends splitting components this way **dogmatically**, because custom hooks can hold the "how it works" logic without an extra component. The underlying idea is still valuable: keep data and logic separate from markup.
In modern React the "container" is often just a custom hook, and in frameworks like Next.js a Server Component that fetches data and renders a Client Component plays the same role.`,
      codeSnippet: `// src/useOrders.js — the "container" logic as a hook
import { useState } from "react";

export function useOrders() {
  const [orders, setOrders] = useState([
    { id: "OD101", item: "Wireless Earbuds", amount: 1999, status: "Shipped" },
    { id: "OD102", item: "Yoga Mat", amount: 799, status: "Delivered" },
  ]);
  const cancelOrder = (id) =>
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Cancelled" } : o))
    );
  return { orders, cancelOrder };
}

// src/OrderList.jsx — presentational: props in, JSX out
export function OrderList({ orders, onCancel }) {
  return (
    <table>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id}>
            <td>{o.id}</td>
            <td>{o.item}</td>
            <td>₹{o.amount}</td>
            <td>{o.status}</td>
            <td>
              {o.status === "Shipped" && (
                <button onClick={() => onCancel(o.id)}>Cancel</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// src/OrdersPage.jsx — thin container wiring them together
import { useOrders } from "./useOrders";
import { OrderList } from "./OrderList";

export default function OrdersPage() {
  const { orders, cancelOrder } = useOrders();
  return <OrderList orders={orders} onCancel={cancelOrder} />;
}`
    },
    {
      heading: "12. When to Split a Component",
      content: `There is no perfect component size, but these signals tell you it's time to extract a new component:
• **Single responsibility is broken.** If you need the word "and" to describe it ("shows the cart **and** handles coupons **and** renders the address form"), split it.
• **Repeated JSX.** The same markup appears two or more times with small differences; extract it and pass the differences as props.
• **Different state lifecycles.** A part of the UI has state that the rest doesn't care about (a dropdown's open flag). Moving it into its own component keeps that state local and limits re-renders to that part.
• **The file is hard to scan.** A component that scrolls for several screens, or a \`return\` with deeply nested ternaries, is easier to follow when broken into named pieces.
• **You want to test or reuse a piece alone.**
And reasons **not** to split:
• Don't create a component for every \`<div>\`. Tiny components that are used once and add no meaning only add indirection.
• Don't split if the new component would need ten props from its parent; that often means the boundary is in the wrong place.
• **Never define a component inside another component.** Each render creates a brand new component type, so React unmounts and remounts it and its state is lost. Always declare components at the top level of a module.
A useful habit is to build the UI first as one component, notice the natural boundaries, and then extract, following the "Thinking in React" approach from the official docs.`
    },
    {
      heading: "13. Common Mistakes",
      content: `1. **Duplicating state in parent and child.** Copying a prop into state with \`useState(props.value)\` only uses the prop on the first render; later changes from the parent are ignored. Either read the prop directly or make the child fully uncontrolled and name the prop \`initialValue\` to make that clear.
2. **Storing derived values in state.** Keeping \`total\` or \`filteredList\` in state next to the source data causes out-of-sync bugs. Compute them during render.
3. **Calling the callback instead of passing it.** \`onClick={onDelete(id)}\` runs immediately during render. Write \`onClick={() => onDelete(id)}\`.
4. **Lifting state too high.** Putting every input's state in \`App\` re-renders the whole app on each keystroke and creates long prop chains. Keep state close to where it's used.
5. **Mutating props in the child.** Props are read-only. A child must ask the parent to change data through a callback, never write to \`props.items.push(...)\`.
6. **Defining components inside components.** This resets their state on every parent render (see section 12).
7. **Boolean-prop explosion.** A \`Button\` with \`isPrimary\`, \`isDanger\`, \`isSmall\`, \`isLoading\`, \`hasIcon\` is a sign you need a \`variant\` prop or composition with \`children\`.
8. **Reaching for HOCs by habit.** In new code, a custom hook is almost always simpler and clearer.`
    },
    {
      heading: "14. Top React Interview Questions on Lifting State & Composition",
      content: `**Q1: What does "lifting state up" mean?**
Answer: Moving state from child components to their closest common parent so that several components can share it. The parent passes the value down as props and passes callbacks so children can request changes.
**Q2: Data flows one way in React. How does a child update its parent?**
Answer: The parent passes a function as a prop (for example \`onChange\`). The child calls it with the new value, and the parent updates its own state. This is called inverse data flow.
**Q3: What is a controlled vs an uncontrolled component in the context of lifting state?**
Answer: A controlled component receives its important values through props and is driven by its parent. An uncontrolled component keeps that information in its own local state. Lifting state turns an uncontrolled component into a controlled one.
**Q4: What is the \`children\` prop and why is composition preferred over inheritance?**
Answer: \`children\` holds the JSX nested between a component's tags. React recommends composition because components can be combined freely with props and children; the React team has said they have not found use cases where component inheritance hierarchies are needed.
**Q5: What are compound components? Give an example.**
Answer: A set of components that work together and share implicit state through a parent, usually via Context, such as \`<Tabs>\`, \`<Tabs.Tab>\` and \`<Tabs.Panel>\`, similar to \`<select>\` and \`<option>\`.
**Q6: Render props vs custom hooks: when would you use each?**
Answer: Use a custom hook to share stateful logic between components. Use a render prop when a reusable component must let the caller decide how part of its output looks, such as a \`renderItem\` function in a list.
**Q7: What is a higher-order component and what are its drawbacks?**
Answer: A function that takes a component and returns an enhanced component. Drawbacks are deep wrapper nesting, prop name collisions and props that come from hidden sources. Custom hooks avoid all three.
**Q8: How can you reset a child's state without lifting it up?**
Answer: Give the child a different \`key\`. When the key changes, React unmounts the old instance and mounts a new one with fresh state.`
    },
    {
      heading: "15. Practical Hands-On Exercise — Bill Splitter with Lifted State",
      content: `Build a **bill splitter** for friends sharing a dinner bill in Bengaluru. It combines everything from this lecture:
• \`App\` holds the **single source of truth**: the list of friends and the bill amount.
• \`BillForm\` and \`FriendList\` are siblings that communicate only through **callbacks** to the parent (inverse data flow).
• Each friend's share is **derived** during render, not stored.
• \`Panel\` uses **composition** with \`title\`, \`actions\` and \`children\` slots.
• \`FriendList\` takes a **render prop** to let the parent decide how each row looks.
Create a Vite React project (\`npm create vite@latest bill-splitter -- --template react\`), replace \`src/App.jsx\` with the code below and run \`npm run dev\`.
**Try these extensions:** add a tip percentage input to \`BillForm\`; let each friend have a custom weight (one friend ordered more); extract the friend rows into a \`FriendRow\` component; then extract the state and handlers into a \`useBill()\` custom hook so \`App\` becomes a thin container.`,
      codeSnippet: `// src/App.jsx — Lecture 17: Bill Splitter (lifted state + composition)
import { useState } from "react";

// Presentational wrapper with slots
function Panel({ title, actions, children }) {
  return (
    <section style={{ border: "1px solid #cbd5e1", borderRadius: "12px", padding: "16px", marginBottom: "16px", background: "#ffffff" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, color: "#002057" }}>{title}</h3>
        {actions}
      </header>
      <div style={{ marginTop: "12px" }}>{children}</div>
    </section>
  );
}

// Child: reports changes up through callbacks
function BillForm({ amount, onAmountChange, onAddFriend }) {
  const [name, setName] = useState(""); // local UI state, nobody else needs it

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAddFriend(trimmed);
    setName("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
      <label>
        Total bill (₹){" "}
        <input
          type="number"
          min="0"
          value={amount}
          onChange={(e) => onAmountChange(Number(e.target.value))}
        />
      </label>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          value={name}
          placeholder="Friend's name"
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Add friend</button>
      </div>
    </form>
  );
}

// Reusable list: owns the layout, caller owns each row via a render prop
function FriendList({ friends, renderFriend }) {
  if (friends.length === 0) return <p>Add at least one friend to split the bill.</p>;
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {friends.map((friend) => (
        <li key={friend.id} style={{ padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
          {renderFriend(friend)}
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  // Single source of truth
  const [amount, setAmount] = useState(2400);
  const [friends, setFriends] = useState([
    { id: 1, name: "Rahul", paid: false },
    { id: 2, name: "Sneha", paid: true },
  ]);

  // Derived values: never stored in state
  const share = friends.length ? Math.ceil(amount / friends.length) : 0;
  const pending = friends.filter((f) => !f.paid).length * share;

  function handleAddFriend(name) {
    setFriends((prev) => [...prev, { id: Date.now(), name, paid: false }]);
  }

  function handleTogglePaid(id) {
    setFriends((prev) =>
      prev.map((f) => (f.id === id ? { ...f, paid: !f.paid } : f))
    );
  }

  function handleRemove(id) {
    setFriends((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <main style={{ maxWidth: "520px", margin: "30px auto", fontFamily: "system-ui, sans-serif" }}>
      <h2 style={{ color: "#002057" }}>Dinner Bill Splitter</h2>

      <Panel title="Bill details">
        <BillForm
          amount={amount}
          onAmountChange={setAmount}
          onAddFriend={handleAddFriend}
        />
      </Panel>

      <Panel
        title={"Friends (" + friends.length + ")"}
        actions={
          <button onClick={() => setFriends([])} disabled={friends.length === 0}>
            Clear all
          </button>
        }
      >
        <FriendList
          friends={friends}
          renderFriend={(friend) => (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ textDecoration: friend.paid ? "line-through" : "none" }}>
                {friend.name} owes ₹{share.toLocaleString("en-IN")}
              </span>
              <span style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => handleTogglePaid(friend.id)}>
                  {friend.paid ? "Mark unpaid" : "Mark paid"}
                </button>
                <button onClick={() => handleRemove(friend.id)}>Remove</button>
              </span>
            </div>
          )}
        />
      </Panel>

      <p style={{ fontWeight: "bold", color: "#2506ad" }}>
        Still to collect: ₹{pending.toLocaleString("en-IN")}
      </p>
    </main>
  );
}`
    },
    {
      heading: "16. Summary",
      content: `• Keep a **single source of truth**: each changing value lives in one component's state, and anything computable is derived during render.
• **Lift state up** to the closest common parent when several components need the same data; pass it down as props.
• Children change parent state through **callbacks** (\`onSomething\` props), which is React's **inverse data flow**.
• Keep state **as low as possible, but no lower**; use a \`key\` to reset a child's state.
• **Composition** with \`children\` and named **slot** props beats configuration-heavy components and inheritance.
• **Compound components** share implicit state through a parent (usually via Context) for flexible APIs like \`<Tabs>\`.
• **Render props** let callers control part of the output; **custom hooks** are the modern way to share stateful logic, replacing most **HOCs**.
• The **container/presentational** idea survives as "logic in hooks, markup in components".
• Split components when responsibilities, repeated markup or state lifecycles differ, and never define components inside other components.
**Next lecture:** Context API — Sharing State Without Prop Drilling`
    }
  ]
};
