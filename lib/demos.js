// Full parallax website demos. Each one is a standalone page in public/demos/<slug>/index.html
// (opened in a new tab, outside the portfolio layout) with a preview image next to it.

export const PARALLAX_DEMOS = [
  {
    slug: "parallax-clothing",
    name: "Northweave Clothing Store",
    category: "Fashion & clothing",
    description:
      "A complete autumn collection website for a slow-fashion clothing brand. Every section moves in depth as you scroll, built in one HTML file with no libraries.",
    href: "/demos/parallax-clothing/index.html",
    image: "/demos/parallax-clothing/preview.jpg",
    stack: "HTML, CSS & vanilla JavaScript",
    palette: ["#17110d", "#f3ebe0", "#c4532a", "#6b6a45"],
    effects: [
      "Layered hero that moves with scroll and mouse",
      "Product columns scrolling at different speeds",
      "Pinned lookbook that scrolls sideways",
      "Photos sliding inside their frames",
      "Headline that lights up word by word",
      "Image that opens from a window as it enters",
    ],
    prompt: `Build a one-page clothing store website for a fictional slow-fashion brand called "Northweave" (Autumn/Winter collection) as a single HTML file with inline CSS and vanilla JavaScript. No libraries.

Visual style: dark espresso background (#17110d), cream text (#f3ebe0), rust accent (#c4532a). Display font Bodoni Moda (italic for accent words), body font Manrope, both from Google Fonts. A subtle film-grain overlay across the page.

Sections, in order:
1. Fixed transparent navbar that turns solid with a blur after scrolling 60px: logo, Shop, Lookbook, Our story, Collections, and a bag button with a live item count.
2. Hero: large serif headline "Wear the season, not the trend." with CTA buttons and three stats. On the right, a layered stage: an arched portrait photo, two smaller photo tiles and two floating info tags. Behind everything, a huge outlined "AW26" word.
3. A tilted rust marquee strip with shipping and returns messages that scrolls forever.
4. A centred statement paragraph whose words light up one by one as it crosses the screen, with two photos drifting at the sides.
5. New arrivals: six product cards in three columns, with badges, colour swatches, prices in ₹ and an "Add to bag" button that updates the bag count.
6. A full-screen banner photo with the headline "Crafted slowly. Worn for years."
7. A lookbook of six looks: the section pins to the screen and vertical scrolling moves the row of cards sideways, with a progress bar.
8. Our story: a photo that opens from a small window to full size as it scrolls in, text, and three count-up stats.
9. Three collection cards (Women, Men, Outdoor), a newsletter form, and a footer with a giant outlined brand word that slides sideways.

Parallax engine (one requestAnimationFrame loop on scroll):
- Elements with data-speed move by (distance from the middle of the screen × speed). Hero layers instead move by scrollY × speed so they start at rest.
- Hero layers with data-depth also follow the mouse, deeper layers moving further.
- Every photo is 124% of its frame's height and slides inside the frame as it passes.
- The pinned lookbook sets its own height to the viewport height plus the row's overflow width.

Respect prefers-reduced-motion by turning every effect off and showing the page statically. Make it fully responsive: single column on phones, and the pinned lookbook still works. Use real alt text on product photos.`,
  },
  {
    slug: "parallax-travel",
    name: "Summit Trails Trekking Company",
    category: "Travel & adventure",
    description:
      "A cinematic website for a small Himalayan trekking company. Scroll through layered mountain ridges, zoom into a photo, flip through stacking trek cards and follow a six-day itinerary.",
    href: "/demos/parallax-travel/index.html",
    image: "/demos/parallax-travel/preview.jpg",
    stack: "HTML, CSS & vanilla JavaScript",
    palette: ["#0d1b1e", "#f2f6f7", "#8fc3d6", "#f2a541"],
    effects: [
      "Mountain ridges that rise over the headline",
      "Photo that zooms in until it fills the screen",
      "Trek cards that stack on top of each other",
      "Itinerary line that fills as you scroll",
      "Photos sliding inside their frames",
      "Full-width cloud photo moving slower",
    ],
    prompt: `Build a one-page website for a fictional adventure travel company called "Summit Trails" that runs small-group guided treks in the Himalaya, as a single HTML file with inline CSS and vanilla JavaScript. No libraries.

Visual style: deep pine background (#0d1b1e), snow-white text (#f2f6f7), glacier blue (#8fc3d6) for secondary accents and a warm sunrise amber (#f2a541) for buttons and highlights. Display font Fraunces (light weight, italic for accent words), body font Outfit, both from Google Fonts. Cool, airy and cinematic, with no coloured strips on card edges.

Sections, in order:
1. Fixed transparent navbar that turns solid with a blur after scrolling 60px: an SVG peak logo, Treks, Why us, Itinerary, Contact, and an amber "Plan a trek" button.
2. Hero: a sunrise mountain photo as the sky, an amber sun glow, then four inline SVG ridge silhouettes (far, mid, near, front), each filled with a darker gradient than the one behind it. The front ridge is the page colour and has pine-tree triangles along its crest. The headline "Walk where the road ends." with two CTAs sits between the mid and near ridges, so the near and front ridges rise over it as you scroll. Small facts at the bottom (next departure, max group size, price from ₹14,500) and a scroll cue.
3. Intro: "Small groups. Local guides. Mountains that stay with you.", a short story, four count-up stats in Indian number format (1,240+ treks led, 18,600+ trekkers, 42 guides, 98% summit success), and two overlapping photos plus a floating badge drifting at different speeds.
4. Zoom-through: a 320vh section with a sticky full-screen stage. A photo of a trekker facing snowy peaks starts as a small rounded window (30% scale) between the words "Leave the" and "road behind". As you scroll, it scales up to fill the screen while the words slide outwards and fade. Then a darkening overlay and the caption "Twelve people. One trail. No road for days." fade in.
5. Signature treks: four destination cards (Markha Valley in Ladakh, Pin Bhaba Pass in Spiti, Kedarkantha in Garhwal, Annapurna Base Camp in Nepal). Each card has a photo, region, description, a duration/altitude/season row, a ₹ price and a button. The cards use position: sticky with a top offset that grows by 26px per card, so they pile on top of each other. Every card already in the pile shrinks by about 4.5% and dims a little for each card that lands on it.
6. Full-bleed band: a sea-of-clouds photo moving slower than the page, with "Day four, 6:12 am" and "The sun comes up below you."
7. Sample itinerary: a sticky left column (title "Kedarkantha in six days", chips, camp photo) and a right-hand timeline of Day 01 to Day 06. A vertical line fills with a glacier-to-amber gradient up to a marker 60% down the screen. Each day slides in from the right as it appears, and its dot lights up amber once the line passes it.
8. Booking: a lake photo background drifting behind a dark overlay, reassurance ticks on the left, and a glass enquiry form on the right (name, phone, trek, month, group size). On submit it shows a friendly demo-only status message.
9. Footer: an SVG ridge silhouette forming the top edge, brand blurb, link columns, and the lines "fictional brand, design demo" and "Photos: StockSnap, CC0 public domain."

Parallax engine (one requestAnimationFrame loop on scroll):
- Elements with data-speed move by (distance from the middle of the screen × speed), measured from their untransformed position. Hero layers instead move by scrollY × speed so they start at rest: sky 0.8, far ridge 0.52, mid 0.36, headline 0.55, near 0.16, front 0.
- Hero layers with data-depth also follow the mouse (pointer: fine only), nearer ridges moving further. Ridges are 110% wide so their edges never show.
- Every framed photo is 124% of its frame's height (absolutely positioned at top -12%) and slides inside the frame as it passes.
- The zoom section, stacking cards and timeline are all driven by scroll progress through their own section.

Respect prefers-reduced-motion by turning every effect off: the zoom photo shows full size with its caption, and all days are visible. Make it fully responsive down to phones: single columns, cards with the photo on top, the zoom words above and below the frame, and no horizontal scrolling (overflow-x: clip). Use real alt text on photos. Add a small fixed "Demo by Ravindra · Back to templates" badge bottom-left that is removed when the URL has ?preview.`,
  },
  {
    slug: "parallax-coffee",
    name: "Ember & Bean Coffee Roastery",
    category: "Café & coffee shop",
    description:
      "A warm, light website for a specialty coffee roastery and café in Bengaluru. Coffee beans float in the hero, the farm-to-cup story plays out as you scroll, and drink photos glide sideways.",
    href: "/demos/parallax-coffee/index.html",
    image: "/demos/parallax-coffee/preview.jpg",
    stack: "HTML, CSS & vanilla JavaScript",
    palette: ["#f6efe6", "#2a1a12", "#b85c27", "#6f7d5c"],
    effects: [
      "Floating beans and leaves at different depths",
      "Circular badge that spins as you scroll",
      "Sticky farm-to-cup story that swaps photos",
      "Drink photo rows sliding in opposite directions",
      "Headline halves sliding in from both sides",
      "Café photo band moving slower than the page",
    ],
    prompt: `Build a one-page website for a fictional specialty coffee roastery and café called "Ember & Bean" in Indiranagar, Bengaluru, as a single HTML file with inline CSS and vanilla JavaScript. No libraries.

Visual style: light and warm. Cream/oat background (#f6efe6), deep coffee-brown text (#2a1a12), caramel accent (#b85c27), sage secondary (#6f7d5c), with near-white paper cards (#fcf8f2). Display font Fraunces (italic caramel for accent words), body font DM Sans, both from Google Fonts. Prices in ₹. Professional and calm: no emoji, and never a coloured strip on just one edge of a card.

Sections, in order:
1. Fixed transparent navbar that turns into a frosted cream bar after scrolling 60px: a coffee-bean logo mark with "Ember & Bean", links (Our story, Menu, The café, Visit) and an "Order online" pill.
2. Hero: headline "Coffee worth slowing down for." with two CTAs and three stats. On the right is a layered stage: a large circular photo of a pour-over, a dashed ring around it, a smaller latte-art photo tile with a thick cream border, a "Today's roast" info tag, and a circular badge whose text "FRESHLY ROASTED · SINCE 2015 ·" runs around an SVG textPath and rotates as the page scrolls. Coffee beans and leaves drawn as inline SVG <symbol>s are scattered around the hero at several sizes, some softly blurred, each at its own depth.
3. Split headline "Roasted at dawn, / poured all day.": the first line slides in from the left and the second from the right as the block enters, followed by an intro paragraph and three numbered features.
4. Farm to cup: a scrollytelling section. On the left, a rounded photo panel sticks to the screen and cross-fades (with a slight zoom-out) between four photos: harvest, processing, roasting and the finished cup. It shows a big "01 / 04" step counter, the step name and four progress bars. On the right, four text steps scroll past, and the step nearest the middle of the screen becomes active (full opacity) and picks the photo.
5. A full-bleed café interior band whose background photo moves at a slower speed, with "A slow corner of Indiranagar." over a dark warm overlay.
6. Menu: four cards (Espresso, Pour-over, Cold brew, Bakes), each with a line icon, items, dotted leaders and ₹ prices. Below them are two full-width rows of drink and bake photos with price pills. They are not pinned: as the page scrolls vertically, the first row translates left and the second translates right.
7. Reviews: three quote cards (the middle one dark) where the middle card drifts at a different speed.
8. Visit: a large photo with a circular photo overlapping its corner, the address, an "Open now / Closed now" pill computed from the current time, an opening-hours list with today highlighted, and directions/brew-class buttons.
9. Order online: a dark coffee section with drifting beans and a "Build your bag" form (three blends as radio cards, a grind select and a pincode). Submitting shows a status message saying it is a demo and nothing was charged.
10. Footer with link columns, a huge faint wordmark, "fictional brand, design demo" and "Photos: StockSnap, CC0 public domain."

Parallax engine (one requestAnimationFrame loop on scroll):
- Elements with data-speed move by (distance from the middle of the screen × speed). Hero layers instead move by scrollY × speed so they start at rest (scaled down on phones).
- Hero layers with data-depth also follow the mouse on pointer:fine devices, deeper layers moving further.
- Photos in .px-img frames are 124% of the frame's height and slide inside it as they pass.
- Badge rotation = scrollY × 0.3deg. Split lines translateX by ±45% of the viewport width × (1 − eased progress).
- Strip rows: progress p through the viewport; row A x = −p × overflow, row B x = −(1 − p) × overflow.

Respect prefers-reduced-motion by turning every motion effect off; the story steps still swap. Make it fully responsive: on phones everything is a single column, the story photo panel sticks under the navbar while the steps scroll beneath it, and the floating beans are hidden so they never cover text. Use real alt text on content photos.`,
  },
  {
    slug: "parallax-audio",
    name: "Aurora One Headphones Launch",
    category: "Tech product launch",
    description:
      "A dark, Apple-style launch page for a premium wireless headphone. The product floats in depth, pins while its features arrive one by one, and changes colour live.",
    href: "/demos/parallax-audio/index.html",
    image: "/demos/parallax-audio/preview.jpg",
    stack: "HTML, CSS & vanilla JavaScript",
    palette: ["#050507", "#f5f5f7", "#8b5cf6", "#22d3ee"],
    effects: [
      "Product that shrinks and tilts as you scroll",
      "Pinned product with features appearing in turn",
      "Spec numbers that count up on arrival",
      "Word rows that slide with your scroll speed",
      "Photo grid where every tile has its own speed",
      "Colour picker that recolours the product",
    ],
    prompt: `Build a one-page product launch website for a fictional premium wireless noise-cancelling headphone called "Aurora One" by "Aurora Audio" (price ₹24,990) as a single HTML file with inline CSS and vanilla JavaScript. No libraries.

Visual style: Apple-style dark launch page. Near-black background (#050507), white text (#f5f5f7), muted grey (#9a9aa8), and a violet-to-cyan gradient (#8b5cf6 to #22d3ee) used sparingly on accent words, buttons and soft glows. Display font Sora, body font Inter, both from Google Fonts. Product photos are shot on a white background. Show them with CSS filter: invert(1) and mix-blend-mode: screen so the white backdrop turns black and the headphones read as a silver render floating on the page. Keep the blended image's parents free of transform, opacity or z-index so the blend still sees the page behind it.

Sections, in order:
1. A thin gradient scroll-progress bar at the top. A fixed navbar that turns translucent with a blur after 60px: a ring-shaped gradient logo, links (Features, Specs, Lifestyle, Colours, FAQ) and a white "Pre-order" pill.
2. Hero (full screen): two large blurred gradient orbs plus a smaller one, a giant faint "AURORA" word behind everything, the product photo large in the centre, and "Introducing Aurora One" above it. At the bottom left, the headline "Silence, sculpted." with "sculpted." in the gradient. At the bottom right, a short pitch with the price and two buttons.
3. Pinned feature story: a 440vh section whose inner stage sticks to the screen. A side-view product photo sits in the middle with a glow and three concentric rings. Four glassy callout cards (Adaptive noise cancelling: up to 32 dB; 40-hour battery: 5 min = 4 h; Spatial audio: 360° sound; All-day comfort: only 250 g) appear one after another in the four corners. Each card has a connector line that draws out to a glowing dot near the product. The newest card is fully bright and earlier ones dim. A "01 / 04" counter and a progress bar sit in the header.
4. Spec band: "Big on sound. Light on you." and a four-cell grid of big numbers that count up when visible (40 h, 32 dB, 9 mics, 250 g). Below it, two huge rows of feature words that move sideways in opposite directions with the scroll position, alternating dim and gradient words.
5. Lifestyle gallery: "Wherever the day takes you." over a three-column collage of six photos of people wearing headphones, each with a caption.
6. Design banner: a full-screen dark close-up headphone photo with the headline "Aluminium. Memory foam. Nothing extra." and three small specs.
7. Colour picker: the product on a glowing disc and ring, four round swatches (Frost, Graphite, Aurora Violet, Glacier Blue), the price with an EMI line, and a "Pre-order Aurora One" button. The button shows a status message that the colour is reserved and that this is a demo, so no order was placed. Delivery and warranty notes sit below.
8. Compare cards for Aurora One and Aurora Lite (₹12,990), with feature rows and a gradient border on the featured card. Then a "What's in the box" card with five line-icon items.
9. Three review cards from fictional early testers with a 4.8 rating, an FAQ accordion built with details/summary, a closing call to action with a glow, and a footer with link columns, a giant faint "AURORA" word, "fictional brand, design demo" and the photo credit.

Parallax engine (one requestAnimationFrame loop on scroll):
- Elements with data-speed move by (distance from the middle of the screen × speed). Hero layers instead move by scrollY × speed so they start at rest. Hero layers with data-depth also follow the mouse (pointer: fine only).
- The hero product gets one combined transform: it sinks at 0.22× scroll, rotates up to -9° and scales down to 76% over the first screen, and tilts in 3D towards the mouse with perspective, rotateX and rotateY.
- The pinned story maps progress (0 to 1) through the section to callout steps at 0.10, 0.35, 0.60 and 0.85. The product moves smoothly between keyframes of x, y, scale and rotation, one per step, and the rings pulse with progress.
- Marquee rows are offset by their position × speed, plus a small skewX from the smoothed scroll velocity.
- Each gallery tile has its own data-speed, and the middle column also moves as a whole. Every gallery photo is 124% of its frame's height and slides inside the frame.
- Colour swatches swap a CSS filter on the product (for example invert(1) sepia(1) saturate(3.2) hue-rotate(228deg) for violet) and set a CSS variable that recolours the glow disc and ring.

Respect prefers-reduced-motion by turning every effect off. The pinned story then becomes a normal section with all four cards in a grid. Make it fully responsive: on phones the gallery becomes two columns, and the pinned story shows one callout card at a time under the product. A small fixed badge at the bottom left links back to the portfolio and is hidden when the URL contains ?preview. Use real alt text on the photos.`,
  },
];
