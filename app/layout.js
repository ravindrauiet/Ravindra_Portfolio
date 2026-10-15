import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TabTitleSwitcher from "@/components/TabTitleSwitcher";
import JsonLd from "@/components/JsonLd";
import WhatsAppButton from "@/components/WhatsAppButton";
import MotionEffects from "@/components/MotionEffects";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://ravindranathjha.in"),
  title: {
    default: "Ravindra Nath Jha | Full Stack Developer & AI Engineer | M.Tech AI, IIT Jodhpur",
    template: "%s | Ravindra Nath Jha"
  },
  description:
    "Official portfolio of Ravindra Nath Jha, Full Stack Developer, AI Engineer and Team Lead with an M.Tech in Artificial Intelligence from IIT Jodhpur. React.js, Next.js, Node.js, MongoDB, React Native, Python, LLM and Generative AI apps. Free coding notes, UI templates and AI prompts.",
  keywords: [
    "Ravindra Nath Jha",
    "Ravindra Jha",
    "Ravindra Nath Jha IIT Jodhpur",
    "Ravindra Nath Jha M.Tech AI",
    "Ravindra Nath Jha Portfolio",
    "Ravindra Nath Jha Full Stack Developer",
    "M.Tech Artificial Intelligence IIT Jodhpur",
    "IIT Jodhpur AI",
    "AI Engineer India",
    "Generative AI Developer",
    "LLM Application Developer",
    "Machine Learning Engineer",
    "Full Stack Developer",
    "Full Stack Developer Faridabad",
    "React.js Developer India",
    "Next.js Developer",
    "MERN Stack Developer",
    "Node.js Backend Developer",
    "React Native Mobile Developer",
    "Python Developer",
    "Freelance Web Developer India",
    "Townmanor Technology Team Lead",
    "Free React Notes",
    "Free Next.js Course",
    "Free UI Templates",
    "AI Website Prompts"
  ],
  authors: [{ name: "Ravindra Nath Jha", url: "https://ravindranathjha.in" }],
  creator: "Ravindra Nath Jha",
  publisher: "Ravindra Nath Jha",
  alternates: {
    canonical: "https://ravindranathjha.in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/assets/images/favicon.png", type: "image/png" }
    ],
    shortcut: "/assets/images/favicon.png",
    apple: "/assets/images/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ravindranathjha.in",
    siteName: "Ravindra Nath Jha Portfolio",
    title: "Ravindra Nath Jha | Full Stack Developer & AI Engineer (M.Tech AI, IIT Jodhpur)",
    description:
      "Full Stack Developer, AI Engineer and Team Lead with an M.Tech in Artificial Intelligence from IIT Jodhpur. React.js, Next.js, Node.js, React Native and Generative AI. Projects, skills, free notes and templates.",
    images: [
      {
        url: "https://ravindranathjha.in/assets/images/Ravindraprofile.jpeg",
        width: 1200,
        height: 630,
        alt: "Ravindra Nath Jha - Full Stack Developer & AI Engineer, M.Tech AI IIT Jodhpur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ravindra Nath Jha | Full Stack Developer & AI Engineer",
    description:
      "Full Stack Developer & AI Engineer with an M.Tech in Artificial Intelligence from IIT Jodhpur. React.js, Next.js, Node.js and Generative AI.",
    images: ["https://ravindranathjha.in/assets/images/Ravindraprofile.jpeg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link id="favicon" rel="icon" href="/assets/images/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/assets/images/favicon.png" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/assets/images/favicon.png" />
      </head>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-580YQFGF8V"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-580YQFGF8V');
          `}
        </Script>
        <JsonLd />
        <TabTitleSwitcher />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <MotionEffects />
      </body>
    </html>
  );
}
