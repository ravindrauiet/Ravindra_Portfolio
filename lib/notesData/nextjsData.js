// Complete Next.js 16 course — each lecture lives in lib/notesData/nextjs/
import { lecture01 } from "./nextjs/lecture01";
import { lecture02 } from "./nextjs/lecture02";
import { lecture03 } from "./nextjs/lecture03";
import { lecture04 } from "./nextjs/lecture04";
import { lecture05 } from "./nextjs/lecture05";
import { lecture06 } from "./nextjs/lecture06";
import { lecture07 } from "./nextjs/lecture07";
import { lecture08 } from "./nextjs/lecture08";
import { lecture09 } from "./nextjs/lecture09";
import { lecture10 } from "./nextjs/lecture10";
import { lecture11 } from "./nextjs/lecture11";
import { lecture12 } from "./nextjs/lecture12";
import { lecture13 } from "./nextjs/lecture13";
import { lecture14 } from "./nextjs/lecture14";
import { lecture15 } from "./nextjs/lecture15";
import { lecture16 } from "./nextjs/lecture16";
import { lecture17 } from "./nextjs/lecture17";
import { lecture18 } from "./nextjs/lecture18";

const lectures = [
  lecture01,
  lecture02,
  lecture03,
  lecture04,
  lecture05,
  lecture06,
  lecture07,
  lecture08,
  lecture09,
  lecture10,
  lecture11,
  lecture12,
  lecture13,
  lecture14,
  lecture15,
  lecture16,
  lecture17,
  lecture18,
];

export const nextjsData = {
  id: "nextjs",
  slug: "nextjs",
  name: "Next.js",
  icon: "fas fa-cubes",
  iconColor: "#ffffff",
  badge: "Full-Stack Framework",
  description: "Complete Next.js 16 course in 18 lectures: App Router, Server & Client Components, data fetching, Cache Components, Server Actions, Proxy, SEO, auth, databases, MDX & CMS, i18n, View Transitions, PWAs and deployment.",
  totalLectures: lectures.length,
  lectures,
};
