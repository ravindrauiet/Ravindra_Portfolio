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
  {
    slug: "parallax-realestate",
    name: "Aravali Residences Luxury Homes",
    category: "Real estate & architecture",
    description:
      "A calm, architectural website for a boutique developer of villas and apartments near Gurugram. An arch opens into the hero, columns scroll in opposite directions and a floor plan draws itself.",
    href: "/demos/parallax-realestate/index.html",
    image: "/demos/parallax-realestate/preview.jpg",
    stack: "HTML, CSS & vanilla JavaScript",
    palette: ["#f3f0ea", "#1d1d1b", "#2f4b3c", "#e4ddd0"],
    effects: [
      "Arch window that opens into a full-screen photo",
      "Spaced-out letters that slide into a wordmark",
      "Split screen with columns moving opposite ways",
      "Floor plan that draws itself room by room",
      "Listing photos sliding and zooming in frames",
      "Count-up numbers and a slower photo band",
    ],
    prompt: `Build a one-page website for a fictional boutique property developer called "Aravali Residences" that builds luxury villas and apartments in the Aravali foothills near Gurugram, as a single HTML file with inline CSS and vanilla JavaScript. No libraries.

Visual style: light, architectural and minimal. Warm stone background (#f3f0ea), off-white panels (#faf8f4), charcoal text (#1d1d1b), one deep forest-green accent (#2f4b3c) and a sand tone (#e4ddd0) for the footer and soft details. Display font Cormorant Garamond (light weight, italic green accent words, lining numerals), body font Jost, both from Google Fonts. Lots of whitespace, thin 1px rules, small uppercase letter-spaced labels with a short line before them. No coloured strips on card edges and no emoji.

Sections, in order:
1. Fixed navbar: an SVG arch logo with "ARAVALI / Residences", links (Living, Residences, Floor plan, Location) and an outlined "Book a visit" pill. It gets a blurred stone background after 40px of scrolling.
2. Hero (260vh tall with a sticky full-screen stage): a modern villa-with-infinity-pool photo shown through an arch-shaped clip-path window in the centre (about 28% of the width, rounded top corners only). Text sits either side of the arch: on the left "Phase II · Now selling", a short paragraph and map coordinates; on the right "Residences from ₹4.2 Cr", the possession date, a "Book a private visit" link and a scroll cue. Along the bottom the letters A R A V A L I are spread across the whole width in huge light serif. On load the letters slide in from the sides. As you scroll, the arch widens until the photo is full-bleed (the bottom opens first), the photo scales from 1.28 down to about 1.08, the side text fades out, and the letters slide inwards into a tight wordmark. They turn from charcoal to off-white once the photo is behind them, while a bottom-heavy dark gradient fades in. Finally a centred eyebrow, the headline "Homes set into the hills." and two buttons fade up over the photo.
3. Studio intro: a thin rule, a small "The studio" note on the left and a large light serif statement on the right. Below it, two captioned photos (a curved white facade and a sunlit kitchen) drifting at different speeds.
4. Split screen (420vh, sticky stage, two 50% columns): three chapters (01 Architecture, 02 Interiors, 03 Outdoors). The left column holds photo A, text B and photo C. The right column holds text A, photo B and text C, displayed with flex-direction: column-reverse. As you scroll, the left track translates up and the right track translates down, with an ease that rests whenever a photo and its text line up. Text panels have a big pale numeral, a serif title, a paragraph and pill tags. A small "01 — 03" pill with a progress line sits at the bottom centre. On phones the two columns become top and bottom rows.
5. Residences: "Four ways to live on the ridge". Four listings in two columns, with the right column offset down and the columns moving at slightly different speeds: The Ridge Villa ₹9.8 Cr, Courtyard House ₹7.4 Cr, Sky Residence ₹6.1 Cr and Garden Terrace ₹4.2 Cr. Each listing has a 4:3 photo with a type tag (photo slides inside its frame and zooms on hover), name and price, a location with a pin icon, a beds / baths / sq ft row between thin rules, and a dark "View residence" button that preselects that home in the enquiry form and scrolls to it.
6. Floor plan (240vh, sticky): text and a two-column room legend on the left, and an inline SVG ground plan of the Courtyard House on the right inside a thin-bordered board. The plan has outer walls, living, dining, kitchen, a green-tinted central court with a tree, a study, a main suite with bath and two bedrooms, plus simple furniture, door arcs and dimension lines. Every shape has pathLength="1" with stroke-dasharray 1. Scroll progress drives each room's stroke-dashoffset from 1 to 0 in turn, then fades in its labels and lights up its legend row.
7. Number band on charcoal: 18 years, 640 homes delivered, 36 acres of green and 42 Phase II residences, counting up when they come into view, separated by faint vertical rules.
8. Full-bleed photo band: a veranda-and-garden photo moving slower than the page behind a dark overlay, with "Wake up to the forest, not the road."
9. Location: heading, paragraph and a small minimal SVG map (roads, a dashed metro line, a green ridge shape and a pulsing site marker). On the right, a list of drive times (4, 6, 12, 25, 35 min) in large light serif numerals.
10. Testimonial: a centred serif quote with a green opening mark, plus two small photos drifting at the sides on wide screens.
11. Enquiry: intro text and contact rows on the left. On the right a bordered form with underline-only fields (name, phone, email, residence select, budget select, message). On submit it shows a friendly demo-only status message.
12. Footer on sand: logo and blurb, link columns, a huge faint "ARAVALI" word, and the lines "fictional brand, design demo" and "Photos: StockSnap, CC0 public domain."

Parallax engine (one requestAnimationFrame loop on scroll):
- Elements with data-speed move by (distance from the middle of the screen × speed), measured from their untransformed position. Hero layers instead move by scrollY × speed so they start at rest.
- Hero layers with data-depth also follow the mouse (pointer: fine only).
- Every framed photo is 124% of its frame's height (absolutely positioned at top -12%) and slides inside the frame. Hover zoom uses the scale property so it does not fight the transform.
- The hero mask, split screen and floor plan are each driven by scroll progress through their own section.

Respect prefers-reduced-motion by turning every effect off: the hero shows the full-bleed photo with its headline, the split screen becomes a static two-column list in reading order, and the floor plan is fully drawn. Make it fully responsive down to phones with no horizontal scrolling (overflow-x: clip on html and body). Use real alt text on photos. Add a small fixed "Demo by Ravindra · Back to templates" badge bottom-left linking to /templates#parallax-websites, removed when the URL has ?preview.`,
  },
  {
    slug: "parallax-ev",
    name: "Volt GT Electric Car Launch",
    category: "Automotive & product launch",
    description:
      "A launch website for a fictional electric sports car. The car drives out of the hero, a speedometer hits 100 as you scroll, a route map draws itself and a configurator repaints the car.",
    href: "/demos/parallax-ev/index.html",
    image: "/demos/parallax-ev/preview.jpg",
    stack: "HTML, CSS & vanilla JavaScript",
    palette: ["#141619", "#eef0eb", "#c6ff3d", "#2c3036"],
    effects: [
      "Car that drives out of frame as you scroll",
      "Speedometer that climbs from 0 to 100",
      "Route map that draws itself across Rajasthan",
      "Feature panels sliding in from both sides",
      "Paint swatches that recolour the car",
      "Night photo band moving slower than the page",
    ],
    prompt: `Build a one-page launch website for a fictional electric car maker called "Volt Motors" introducing the "Volt GT", a four-seat electric grand tourer launching in India, as a single HTML file with inline CSS and vanilla JavaScript. No libraries.

Visual style: kinetic and motorsport-inspired but premium. Light off-white sections (#eef0eb) alternate with graphite sections (#141619, panels #1d2024, borders #2c3036), with ONE electric lime accent (#c6ff3d) used for buttons, highlights, the gauge arc and the route line. On light backgrounds lime is only ever a fill behind graphite text (for example a marker-style highlight behind one word of each headline), never lime text. Display font Barlow Condensed (800 weight, uppercase, italic for accent words), body font Archivo, both from Google Fonts. Square-ish 6-8px corners, no emoji, and no coloured strips on card edges.

Sections, in order:
1. Fixed navbar: a lightning-bolt logo tile with "VOLT" in condensed italic and a small "MOTORS", links (Performance, Range, Design, Configure) and a dark "Test drive" button. After 60px it turns solid with a blur. Whenever a dark section sits under it, it switches to a graphite bar with a lime button (check document.elementFromPoint just below the nav).
2. Hero on the light background with a faint 120px grid: a giant outlined italic "VOLT GT" (-webkit-text-stroke, 27vw) behind everything, about ten thin animated speed lines (CSS keyframes streaking right to left, some in lime), and a side-view car photo inside a slanted parallelogram frame (clip-path) on the right with a small "New · Volt GT India launch 2026" tag. On the left: the eyebrow "Volt Motors · India launch", the headline "Silence, at full throttle.", a short paragraph, "Ex-showroom, from ₹48.9 lakh", "Book a test drive" and "Build yours" buttons, and a three-part spec strip (3.4 s 0-100 km/h, 620 km range, 18 min 10-80% charge).
3. A slightly skewed lime ticker band with a looping marquee of specs in condensed italic.
4. Launch control: a 340vh graphite section with a sticky full-screen stage over a faint, desaturated light-trail photo. On the left, "0-100 in 3.4 seconds." and three phase rows (0.0 s launch, 1.6 s traction, 3.4 s done) that light up in turn. On the right, an inline SVG speedometer: a 270° track arc, ticks every 5 km/h with labels every 20 from 0 to 120, a lime progress arc (stroke-dasharray/dashoffset from getTotalLength), a white needle rotated with the SVG transform attribute, and a big numeric km/h readout plus a lime "x.x s" timer chip. Scroll progress p through the section drives speed = 100 × (1 − (1 − p)^1.7) so it tapers like a real car, and time = p × 3.4.
5. Spec grid on light: six cells (3.4 s, 620 km, 18 min, 480 kW, 760 Nm, 250 km/h) with big condensed numbers that count up (decimals supported) and a thin bar that fills when the cell appears.
6. Range: a 300vh graphite section with a sticky stage over a faint desert-road photo. On the left, "Delhi to Udaipur. One coffee stop.", a km counter, a battery % readout with a lime bar, and a status line that changes at each city. On the right, a stylised SVG map in a dark rounded panel: a dot-grid pattern, a dashed outline labelled RAJASTHAN, faint side roads, and a smooth NH48 route path from Delhi via Neemrana, Jaipur and Ajmer to Udaipur. The route draws itself with stroke-dashoffset as you scroll, a white marker follows it (getPointAtLength), and city markers turn lime as the line reaches them (find each city's position along the path by sampling). The km counter interpolates between city distances (0, 122, 280, 415, 662). The battery drains at 6.2 km per %, gets a 55% → 80% top-up at Jaipur, and you arrive with 18%.
7. Feature panels on light, "Designed in four acts": four rows (Shaped by the wind / A lounge for four / Charge in a chai break / Calm in a monsoon). Each row has a large photo, a smaller overlapping thumbnail photo with a paper-coloured border, and a white card with an outlined italic number, a heading, text and spec chips. Rows alternate sides. As each row enters, the media slides in from one side and the card from the other (translateX eased by scroll progress, fading up). The main photo and the thumbnail have different data-speed values.
8. Full-bleed night band: a city light-trail photo moving at a fraction of the scroll speed behind a radial vignette, with "Made for the 2 a.m. expressway."
9. Configurator on graphite: a 4:3 stage with a white car photo, plus a tint overlay clipped to the car body with a percentage clip-path polygon and blended with mix-blend-mode: multiply, so only the paint changes colour. A sheen sweeps across when the paint changes, and a label shows the paint and trim. Four swatch buttons (Glacier White included, Volt Lime +₹1.2 lakh, Monsoon Blue +₹0.8 lakh, Carbon Graphite +₹0.5 lakh) use aria-pressed. On the right, a panel with a two-way trim toggle (Long Range: ₹48.9 lakh, 3.4 s, 620 km, 480 kW, 21" Aero; Performance: ₹56.4 lakh, 2.9 s, 560 km, 560 kW, 22" Forged), a spec table, the live total price in big lime type, and a "Reserve for ₹51,000" button.
10. Test drive on light: a framed photo with inner parallax and a floating lime "40 cities at launch" badge, the headline "Feel 3.4 seconds yourself.", and a form (name, mobile, city select, preferred date). It checks for a name and a 10-digit number, then shows a demo-only status message.
11. Graphite footer: logo and blurb, link columns, a giant outlined "VOLT GT · VOLT MOTORS" line that slides sideways on scroll, and the lines "fictional brand, design demo" and "Photos: StockSnap, CC0 public domain."

Parallax engine (one requestAnimationFrame loop on scroll):
- Elements with data-speed move by (distance from the middle of the screen × speed), measured from their untransformed position (store the last offset and subtract it). Hero layers instead move by scrollY × speed so they start at rest.
- The hero car moves sideways by progress² × 95% of the viewport width over the first 90% of a screen of scroll, so it drives out of frame. Meanwhile the speed-line layer stretches with scaleX(1 + 2.6p) and brightens, and the giant type drifts down at 0.35.
- Hero layers with data-depth also follow the mouse (pointer: fine only).
- Every framed photo is 124% of its frame's height (top margin −12%) and slides inside the frame as it passes.
- The speedometer, route map and feature slides are driven by scroll progress through their own sections.

Respect prefers-reduced-motion by turning all motion off: the gauge shows 100 km/h and 3.4 s, the route is fully drawn with every city lit, panels sit in place, and the speed lines and ticker stop. Make it fully responsive down to phones: single columns, the hero car below the copy, the sticky gauge and map stages trimmed so they fit one screen, larger map labels, two-column swatches, and no horizontal scrolling (overflow-x: clip on html and body). Use real alt text on photos. Add a small fixed "Demo by Ravindra · Back to templates" badge bottom-left that links to /templates#parallax-websites and is removed when the URL has ?preview.`,
  },
  {
    slug: "parallax-restaurant",
    name: "Zafraan Fine-Dining Restaurant",
    category: "Restaurant & food",
    description:
      "A dark, candle-lit website for a modern Indian tasting-menu restaurant. A plate turns as you scroll, spices float in depth and a sticky menu counts through seven courses.",
    href: "/demos/parallax-restaurant/index.html",
    image: "/demos/parallax-restaurant/preview.jpg",
    stack: "HTML, CSS & vanilla JavaScript",
    palette: ["#160b17", "#f5ecdc", "#e3a43b", "#3b2140"],
    effects: [
      "Plate that turns as you scroll",
      "Spices floating at different depths",
      "Giant word filled with a moving photo",
      "Sticky course number with a progress rail",
      "Dish row that tilts with scroll speed",
      "Chef photos drifting at different speeds",
    ],
    prompt: `Build a one-page website for a fictional modern Indian fine-dining restaurant called "Zafraan" in Bandra West, Mumbai, as a single HTML file with inline CSS and vanilla JavaScript. No libraries. The tasting menu costs ₹4,800 per guest (wine pairing ₹3,200).

Visual style: deep aubergine night background (#160b17) with plum panels (#211121, #3b2140), ivory text (#f5ecdc), muted mauve body copy (#bba5b6) and saffron gold (#e3a43b, lighter #f3c873) for accents, thin rules and buttons. Display font Cormorant Garamond (italic for accent words, lining numerals), body font Jost, both from Google Fonts. Dark, luxurious and calm: square-cornered gold buttons, hairline gold borders that go all the way round a box, and no coloured strip on just one edge of a card. Use no emoji.

Sections, in order:
1. Fixed transparent navbar that turns solid with a blur after scrolling 60px: an inline SVG saffron-crocus logo with the letter-spaced word ZAFRAAN, links (Tasting menu, The chef, Signatures, Visit) and a gold "Reserve" button.
2. Hero: eyebrow "Bandra West, Mumbai", headline "The spice route, plated in seven courses.", a short intro, two CTAs and three stats (₹4,800 per guest, 7 courses, 28 seats a night). On the right, a square stage: a soft saffron halo, a thin gold SVG ring with a dotted inner circle and tick marks, and a top-down photo of a vegetarian dish cropped into a circle (gold outline, deep shadow). The plate rotates slowly as you scroll and the ring turns the other way. Around it, inline SVG spices float at different depths: two star anise, a red chilli, two green cardamom pods, a curry leaf and saffron strands, each spinning at its own rate. A small glass note card names tonight's first course.
3. Awards strip on a plum band: four centred items with thin line icons, all from fictional guides.
4. Photo-filled word: a giant "ZAFRAAN" in bold Cormorant whose letters are filled with a photo of dried red chillies (background-clip: text, a faint gold text stroke). The photo pans diagonally inside the letters as the word crosses the screen. Below: "Saffron, in Hindi and Persian." in italics and two columns of story text with a gold drop cap.
5. Tasting menu: a heading and a bordered price box, then a two-column layout. The left column is sticky: a thin vertical rail with seven dots that fills with gold as you scroll, a large outlined course number (01 to 07), the course type, the dish name and its region, plus "Course 03 of 07". The right column lists seven courses, each with a 4:3 photo with a hairline inset frame, a kicker, the name, an italic region, a description and a wine pairing. The sticky number cross-fades to whichever course photo has passed 55% of the screen. On screens under 860px the sticky column becomes a slim bar under the navbar with a horizontal progress line.
6. Chef's story: two overlapping photos (chef plating, steaming kitchen pots) moving at different speeds, plus a round gold seal with "ZAFRAAN · MUMBAI · SINCE 2019" on a text path, spinning with scroll. Beside them a short story and a large italic pull quote with a gold quotation mark.
7. Full-bleed dining-room band: a warm, dark interior photo moving slower than the page under plum gradients, a small gold ornament, "Dinner, slowly." and one line of copy.
8. Signature plates: a horizontal row of seven dish cards (3:4 photo, name, short note, ₹ price) that drifts sideways as the section scrolls past. The row also tilts in 3D according to scroll speed (rotateY plus a slight skewY and scale-down, inside a perspective wrapper), easing back to flat when scrolling stops.
9. Visit and reserve: opening hours as a ruled list (Monday closed, shown in gold), address and contact. On the right, a bordered glass reservation form with date (min today, max 60 days), time, guests (1 to 8), name, and pill radios for Tasting menu / Vegetarian tasting / Bar, à la carte. On submit it shows a friendly demo-only status message with the formatted date, and no booking is made.
10. Footer: centred logo, italic tagline, links, the gold ornament, and the lines "fictional brand, design demo" and "Photos: StockSnap, CC0 public domain."

Parallax engine (one requestAnimationFrame loop on scroll):
- Elements with data-speed move by (distance from the middle of the screen × speed), measured from their untransformed position. Hero layers instead move by scrollY × speed so they start at rest, softened on narrow screens where the hero stacks.
- Hero layers with data-depth also follow the mouse (pointer: fine only), the nearest spices moving furthest.
- Rotation comes from one CSS variable (--rot = scrollY × 0.06deg) that the plate, ring, spices and seal each multiply by their own factor.
- Every framed photo is 124% of its frame's height (absolutely positioned at top -12%) and slides inside the frame as it passes.
- The tilt row keeps a velocity value that eases towards (scroll delta × factor) and keeps scheduling frames until it settles at zero.

Respect prefers-reduced-motion by turning every motion effect off while the sticky menu still updates. Make it fully responsive down to phones with no horizontal scrolling (overflow-x: clip on html and body). Add a fixed "Demo by Ravindra · Back to templates" badge at the bottom-left linking to /templates#parallax-websites, removed when the URL has ?preview. Use real alt text on all dish photos.`,
  },
];
