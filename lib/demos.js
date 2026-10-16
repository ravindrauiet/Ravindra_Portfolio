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
  {
    slug: "parallax-wedding",
    name: "Rivaah Wedding Photography Studio",
    category: "Wedding & events",
    description:
      "A light, romantic site for a Jaipur and Udaipur wedding studio. Photo prints drift apart, a scattered gallery settles into a grid and a curved thread draws the wedding day.",
    href: "/demos/parallax-wedding/index.html",
    image: "/demos/parallax-wedding/preview.jpg",
    stack: "HTML, CSS & vanilla JavaScript",
    palette: ["#fbf6f0", "#6b1f2f", "#f5e6e0", "#a9844f"],
    effects: [
      "Photo prints that drift apart and turn",
      "Scattered prints settling into a grid",
      "Curved timeline path that draws itself",
      "Curtain panels sliding apart on scroll",
      "Film cards gliding sideways",
      "Band photo moving slower than the page",
    ],
    prompt: `Build a one-page website for a fictional wedding photography and films studio called "Rivaah Studio", based in Jaipur and Udaipur and shooting destination weddings across India, as a single HTML file with inline CSS and vanilla JavaScript. No libraries. Packages are priced in lakh: ₹2.5 L, ₹4.5 L and ₹7.5 L (+ GST).

Visual style: light, romantic and editorial. Ivory background (#fbf6f0) with white "paper" (#fffdf9), blush panels (#f5e6e0, #ecd4cc), deep maroon for headings, accent words and buttons (#6b1f2f), muted rose (#b86b72), antique gold for eyebrows, rules and ticks (#a9844f), and dark plum-brown text (#2c1a1e). Display font Playfair Display (italic maroon accent words), Pinyon Script only for small handwritten accents and print captions, body font Mulish, all from Google Fonts. Photos sit in white print frames with soft shadows. Never put a coloured strip on just one edge of a card, and use no emoji.

Sections, in order:
1. Fixed transparent navbar that turns ivory with a blur after scrolling 60px: an italic maroon "Rivaah" logo with a small gold "STUDIO", links (Stories, The day, Films, Packages) and a maroon "Enquire" pill.
2. Hero: a centred headline "Your wedding, as it felt." with a script line, eyebrow, copy and two CTAs inside a thin gold circle. Six polaroid-style prints with script captions sit around it at different depths, slightly rotated.
3. Studio intro: a large Playfair quote and a four-column stats row (340 weddings, 11 states, 8 storytellers, 12 years) that counts up.
4. Scatter-to-grid gallery: a 320vh section with a sticky stage. Nine white-framed prints start scattered and rotated (data-g="x,y,rotation,scale") and move into a neat 3×3 grid as you scroll. The heading cross-fades from "A thousand moments, scattered" to "gathered into one story".
5. The wedding day: five alternating rows (Haldi, Mehendi, Sangeet, Pheras, Reception), each with a photo, a gold time label, title, script subtitle, paragraph and an honest "Pictured" caption. A curved SVG path built in JavaScript through one node per row draws itself down to 62% of the screen, and dots fill as it reaches them.
6. Curtain reveal: a 250vh section with a sticky full-bleed sunset couple photo covered by two blush panels ("Every frame" / "is a promise.") that slide apart with scroll while the photo settles from scale 1.18 to 1, then a caption fades up.
7. Films: a row of six 16:10 video-style cards (photo, kind pill, play button, duration, title) moving sideways with the section's progress.
8. Testimonials: three white cards with gold stars and italic quotes.
9. Full-bleed band: a sparkler send-off photo moving slower than the page under a maroon overlay, "The 2027 muhurat season" and a "Hold my date" button.
10. Packages: three cards (Intimate ₹2.5 L, Signature ₹4.5 L, Grand Destination ₹7.5 L); the middle one solid maroon and raised. Buttons preselect the package in the form.
11. Enquiry: a portrait photo with inner parallax and a form (names, contact, wedding date, city, guests, package, notes) that shows a demo-only status message.
12. Footer on blush with link columns, a giant pale "Rivaah Studio" in script sliding sideways, "fictional brand, design demo" and "Photos: StockSnap, CC0 public domain."

Parallax engine (one requestAnimationFrame loop on scroll):
- Elements with data-speed move by (distance from the middle of the screen × speed), measured from their untransformed position. Hero layers move by scrollY × speed so they start at rest; hero prints also drift sideways (data-dx) and turn (data-spin) so the cluster spreads apart.
- Hero layers with data-depth follow the mouse (pointer: fine only).
- Every framed photo is 124% of its frame's height and slides inside the frame as it passes.
- Gallery, curtain and films each compute a 0–1 progress value and apply eased transforms. The timeline path is rebuilt on resize, load and when fonts are ready.

Respect prefers-reduced-motion: turn off motion, show the gallery as a plain grid, remove the curtain panels and draw the full path. Fully responsive with no horizontal scrolling (overflow-x: clip on html and body). Add a fixed "Demo by Ravindra · Back to templates" badge bottom-left linking to /templates#parallax-websites, removed when the URL has ?preview. Write honest alt text and captions that describe exactly what each photo shows.`,
  },
  {
    slug: "parallax-pizza",
    name: "Forno Rosso Wood-Fired Pizzeria",
    category: "Pizza & restaurant",
    description:
      "A giant pizza spins through flying ingredients, a pinned scene builds a Margherita layer by layer, the menu scrolls sideways and the oven heats to 485°C.",
    href: "/demos/parallax-pizza/index.html",
    image: "/demos/parallax-pizza/preview.jpg",
    stack: "HTML, CSS, GSAP ScrollTrigger & Lenis",
    palette: ["#d7261e", "#f7efe1", "#2f7d3a", "#140e0c"],
    effects: [
      "Giant pizza that spins and grows on scroll",
      "Ingredients flying past at five depths",
      "Pinned scene that builds a Margherita",
      "Sideways menu with rotating pizzas",
      "Oven glow, rising embers, 485°C counter",
      "Magnetic buttons and a custom cursor",
    ],
    prompt: `Build a single-file, premium parallax website for "Forno Rosso", a fictional wood-fired Neapolitan pizzeria in Indiranagar, Bengaluru (pizzas ₹449–₹849, delivery and dine-in). Plain HTML with inline CSS and JS. Load GSAP 3.12.5 + ScrollTrigger from cdnjs and Lenis 1.1.13 from jsDelivr. Wire Lenis to ScrollTrigger (lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0)). Fonts: Bowlby One for chunky display type and Instrument Sans for body. Palette: tomato red #d7261e, mozzarella cream #f7efe1, basil green #2f7d3a, charred black #140e0c, plus gold #f6a534. Add a soft film-grain overlay.

1) Hero, pinned for 110% on desktop. A dark char background with a red radial glow. Giant "FORNO" (cream) and "ROSSO" (tomato) words above and below a big top-down pizza photo cropped to a circle. On load the letters rise in one by one and the pizza drops in spinning. Scrubbed on scroll: the pizza rotates 300° and scales to about 1.45, the two words slide apart in opposite directions, and the hero copy fades. Draw inline SVG ingredients as <symbol>s (basil leaf, tomato slice, chilli, garlic bulb, olive ring, flour dust) and place about 24 of them at depths 1–5: far ones small and dim, depth 4 slightly blurred, depth 5 huge and blurred about 7px. Each flies outward and upward by its depth with rotation, bobs gently and leans with the mouse. Add a custom cursor (pointer:fine only) and magnetic buttons.

2) A tilted tomato-red marquee band whose text moves with scroll.

3) "Build a Margherita": a cream section pinned for about 320%. On the left, four steps (Dough · 48 h, San Marzano sauce, Fior di latte, Fresh basil) highlight in turn with a progress line. On the right, a CSS/SVG pizza assembles in one scrubbed timeline: the dough disc scales in while flour puffs out, the sauce spreads by growing a clip-path circle, mozzarella blobs drop in, basil leaves fly in from all sides spinning, then it bakes (leopard spots on the rim, golden crust, steam) and a "Margherita · ₹449" label pops up. A giant outlined "MARGHERITA" drifts behind.

4) Menu: a tomato-red section pinned while vertical scroll moves a row of cards sideways. Each card has a circular pizza photo that rotates as it crosses the screen (containerAnimation), an Indian veg/non-veg mark, a name, an honest description of the photo, a ₹ price and an Add button that pre-selects that pizza in the order form. On phones the cards stack vertically.

5) "Into the fire": a black section pinned for about 200%. A photo of a pizza on a peel before a wood fire brightens and zooms out, radial glows grow, canvas ember particles rise faster, and a "485°C" counter counts up, then "90 seconds", while a heat bar fills.

6) Reviews with a clip-path photo reveal, a 4.8 rating disc, three cards drifting at different speeds and a giant outlined "GRAZIE" sliding across.

7) Order form (demo only): pizza tiles, size 10"/12"/14", quantity, extras, delivery or pick-up, and a sticky summary with an animated live total. Submitting shows a "design demo, nothing sent" status.

8) Hours with today highlighted, an address and a stylised SVG map with a pulsing pin. 9) Tomato footer with a giant "FORNO ROSSO" word sliding sideways.

Use gsap.matchMedia so phones (<768px) get lighter versions. Under prefers-reduced-motion, or if GSAP fails to load, show every final state with Lenis off. Use overflow-x: clip on html and body, responsive to 360px, no emoji, and a fixed "Demo by Ravindra · Back to templates" badge linking to /templates#parallax-websites that is removed with ?preview. Footer: "fictional brand, design demo" and "Photos: StockSnap, CC0 public domain."`,
  },
  {
    slug: "parallax-brew",
    name: "Blackbuck Coffee",
    category: "Coffee brand & café",
    description:
      "A dark, cinematic site for an Indian specialty coffee brand. Beans burst out around a cup, a pinned scene turns cherries into a full cup, and a map lights up three coffee hills.",
    href: "/demos/parallax-brew/index.html",
    image: "/demos/parallax-brew/preview.jpg",
    stack: "HTML, CSS, GSAP ScrollTrigger & Lenis",
    palette: ["#0b0705", "#2a170e", "#ff6b2c", "#f5e6cc"],
    effects: [
      "Coffee beans bursting out at three depths",
      "Pinned cherry-to-cup story that fills a cup",
      "Beans roasting from green to dark brown",
      "Sideways drinks menu with 3D tilt",
      "India map that draws, zooms and lights up",
      "Custom cursor and magnetic buttons",
    ],
    prompt: `Build a one-page website for a fictional Indian specialty coffee brand called "Blackbuck Coffee" (cold brew cans, single-estate beans and a flagship café in Bandra West, Mumbai) as a single HTML file with inline CSS and JavaScript. Load GSAP 3.12.5 and ScrollTrigger from cdnjs and Lenis 1.1.13 from jsDelivr, wire Lenis to ScrollTrigger (lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0)) and use gsap.matchMedia() so heavy scenes simplify under 768px. Under prefers-reduced-motion, or if the libraries fail to load, show every scene in its final state. Drinks cost ₹180 to ₹420 and 250 g bean bags ₹650 to ₹1,100.

Visual style: dark, cinematic and luxurious. Espresso-black background (#0b0705) with roasted-brown panels (#2a170e), cream text (#f5e6cc), taupe body copy and a vivid burnt-orange accent (#ff6b2c). Display font Unbounded (700 to 900), body font Hanken Grotesk. Fixed film-grain overlay, glossy highlights, deep shadows. No coloured strips on one edge of a card, no emoji, overflow-x: clip on html and body.

Draw one detailed SVG coffee-bean symbol (radial gradient body, S-shaped crease, gloss highlights) and reuse it everywhere.

Sections, in order:
1. Fixed navbar that turns solid with a blur after 60px, with a magnetic orange "Build a box" pill.
2. Hero, pinned and scrubbed: a giant outlined "BLACKBUCK" split into letters behind a circular top-down cappuccino photo inside a rotating circular text path, steam wisps, and a tilted SVG cold brew can. About 40 beans at three depths (blurred back, sharp mid, huge blurred front) fly outward, spin and drift up on scroll; the cup grows and its latte art rotates; the can spins away; the letters spread apart. All layers follow the mouse by depth.
3. Two rows of giant words sliding in opposite directions with scroll.
4. A statement whose words light up one by one, plus four counters.
5. "From cherry to cup", pinned and scrubbed: red cherries on a branch become green beans, which roast from green to dark brown with a heat glow and a 24°C to 218°C counter, then burst into grounds that arc into a dripper and pour. A big cup outline fills with a wavy liquid level throughout. Step text and a matching circular photo change per step.
6. Menu, pinned and scrolled sideways: eight drink cards with 3D tilt by distance from the screen centre, each named to match its photo, ₹180–₹420.
7. Origins, pinned: an SVG India outline draws itself, zooms to Chikmagalur and Coorg, pans to Araku, then dashed routes draw from a Mumbai café marker. Three origin cards highlight in step.
8. Subscription plans, a "build your box" form with steppers and an animated live total (demo-only status), reviews over a parallax photo, the café with a live "Open now" check, and a footer with a giant gradient word sliding sideways, "fictional brand, design demo" and "Photos: StockSnap, CC0 public domain."

Desktop micro-interactions: a dot cursor with a lagging ring, magnetic buttons. Add a fixed "Demo by Ravindra · Back to templates" badge linking to /templates#parallax-websites, removed with ?preview.`,
  },
  {
    slug: "parallax-momos",
    name: "Momo Mountain Himalayan Momo House",
    category: "Momos & street food",
    description:
      "A playful-premium site for a Himalayan momo house in Delhi: layered mountain ridges, a bamboo steamer that lifts its lid on scroll, a pleat-by-pleat making-of and a sideways menu.",
    href: "/demos/parallax-momos/index.html",
    image: "/demos/parallax-momos/preview.jpg",
    stack: "HTML, CSS, GSAP ScrollTrigger & Lenis",
    palette: ["#232a52", "#cf3b2b", "#c99a5b", "#f1eadc"],
    effects: [
      "Five mountain ridges moving at different speeds",
      "Steamer lid lifts and dishes rise from steam",
      "Pinned making-of scene with a pleat counter",
      "Pinned menu row that slides sideways",
      "Chutney picker with a live heat level",
      "Order form with a live rupee total",
    ],
    prompt: `Build a one-page restaurant website for a fictional upscale Himalayan momo house in Delhi called "Momo Mountain" (Majnu ka Tilla vibe) as a single HTML file with inline CSS and JavaScript. Use GSAP 3.12.5 + ScrollTrigger from cdnjs and Lenis 1.1.13 from jsDelivr for smooth scrolling (wire Lenis to ScrollTrigger.update and the GSAP ticker, lagSmoothing(0)). Momos and thukpa cost ₹149 to ₹349.

Visual style: warm, playful-premium, mountain-inspired. Deep indigo night (#161a33 / #232a52), rice-paper cream (#f1eadc), chilli red (#cf3b2b), bamboo (#c99a5b), saffron accents (#eaa53a), and muted prayer-flag colours used sparingly. Display font Gloock, body font Hanken Grotesk. A fixed film-grain overlay. No coloured strips on one edge of cards, no emoji.

Shared inline SVG art: a side-view momo with pleats, a top-down momo, chilli, coriander leaf, garlic clove, spring-onion ring, and a bamboo steamer drawn as back, woven front wall and lid.

Sections, in order:
1. Fixed nav that turns solid with a blur after 60px, with a red "Order now" button.
2. Hero, pinned on desktop: dusk sky with stars, a giant outlined "MOMO", a glowing sun, five SVG ridge layers with snow caps and pines, drifting mist bands, swaying prayer flags, an open steamer full of momos in the foreground with rising steam, and floating ingredients at back and front depths (front ones blurred). The headline "Momo Mountain" is split into letters. Scrubbing moves far peaks and near ridges at very different speeds, scales the steamer up, flings ingredients away and scatters the letters. Layers follow the mouse; a custom cursor shows labels like "Hot" and "Lift".
3. Intro: two giant word rows sliding in opposite directions, a story, four count-up stats and a photo collage.
4. "Lift the lid", pinned: the lid rattles, lifts and flies off, steam puffs billow and fade, and five circular dishes rise out of the basket and fan into an arc with labels.
5. "How a momo is made", pinned on desktop: Dough, Filling, Pleat, Steam cross-fade with a pleat counter running 00 to 12 while twelve pleat lines draw in.
6. Menu, pinned and scrolled sideways: nine cards with veg/non-veg marks, an "Illustration" tag where the dish is drawn rather than photographed, ₹ prices and a five-chilli spice meter.
7. A chutney picker whose chips and heat slider recolour an SVG chutney bowl and dip a momo into it.
8. Reviews over a Himalaya photo, a Visit section with a live "Open now" pill and a stylised map, an order form with steppers and a live total including delivery and GST (demo-only status), and a footer with prayer flags and a giant "MOMO MTN." whose letters rise.

Use gsap.matchMedia: full pinned scenes at 768px and wider, lighter versions on phones, and final states shown statically under prefers-reduced-motion. Use overflow-x: clip on html and body, responsive to 360px. Every alt text and label must match its photo honestly. Add a fixed "Demo by Ravindra · Back to templates" badge linking to /templates#parallax-websites, removed with ?preview. Footer: "fictional brand, design demo" and "Photos: StockSnap, CC0 public domain."`,
  },
];
