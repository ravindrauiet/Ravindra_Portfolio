import { NextResponse } from "next/server";

const projectData = [
  {
    id: 1,
    name: "PujaKaro",
    desc: "MERN stack project with Firebase database integration. It features Google authentication, booking services, and an admin dashboard for streamlined management.",
    image: "pujakaro.png",
    category: "mern",
    tech_stack: ["React", "Node.js", "Express", "MongoDB", "Firebase", "Google Auth"],
    links: {
      view: "https://www.pujakaro.in/",
      code: "https://github.com/PujaKaro/frontend-vercel"
    }
  },
  {
    id: 2,
    name: "Relove WebApp",
    desc: "An AI-based project that integrates Gemini AI to filter data and find the best products, leveraging a trained model. It also includes an AI-powered form submission feature.",
    image: "relove.png",
    category: "ai",
    tech_stack: ["React", "Node.js", "Express", "MongoDB", "Gemini AI"],
    links: {
      view: "https://gloupwebapp.vercel.app/",
      code: "https://github.com/ravindrauiet/gloupwebapp"
    }
  },
  {
    id: 3,
    name: "Relove Mobile App",
    desc: "A comprehensive mobile application that incorporates all key features for a superior user experience, building on the functionalities of its web counterpart.",
    image: "reloveapp.png",
    category: "android",
    tech_stack: ["React Native", "Expo", "Node.js", "MongoDB", "Firebase"],
    links: {
      view: "#",
      code: "https://github.com/ravindrauiet"
    }
  },
  {
    id: 4,
    name: "Townmanor.ai",
    desc: "A cutting-edge AI-powered platform that integrates advanced machine learning algorithms to enhance user interactions and automate real estate processes.",
    image: "townmanor.png",
    category: "ai",
    tech_stack: ["React", "Python", "Node.js", "MongoDB", "AWS"],
    links: {
      view: "https://townmanor.ai/",
      code: "https://github.com/ravindrauiet"
    }
  },
  {
    id: 5,
    name: "Fastag Bajaj APP",
    desc: "A mobile application built with Expo and React Native, integrating with the Bajaj API to deliver fastag functionalities with seamless API connectivity.",
    image: "fastag.png",
    category: "android",
    tech_stack: ["React Native", "Expo", "Node.js", "RESTful API", "Redux"],
    links: {
      view: "#",
      code: "https://github.com/ravindrauiet/fastag_bajaj_api"
    }
  },
  {
    id: 6,
    name: "Mobile Store CRM APP",
    desc: "A React Native (Expo) based CRM solution tailored for mobile retail stores, providing inventory management, sales tracking, and customer relationship tools.",
    image: "Mobile-Store-CRM.png",
    category: "android",
    tech_stack: ["React Native", "Expo", "Node.js", "MongoDB"],
    links: {
      view: "#",
      code: "https://github.com/ravindrauiet"
    }
  }
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  if (category && category !== "all") {
    const filtered = projectData.filter((p) => p.category === category);
    return NextResponse.json({ success: true, count: filtered.length, projects: filtered });
  }

  return NextResponse.json({ success: true, count: projectData.length, projects: projectData });
}
