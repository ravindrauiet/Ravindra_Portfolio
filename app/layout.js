import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TabTitleSwitcher from "@/components/TabTitleSwitcher";
import JsonLd from "@/components/JsonLd";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://ravindranathjha.in"),
  title: {
    default: "Ravindra Nath Jha | Full Stack Developer | React.js & MERN Specialist",
    template: "%s | Ravindra Nath Jha"
  },
  description:
    "Official portfolio of Ravindra Nath Jha — Full Stack Developer & Team Lead specializing in React.js, Next.js, Node.js, Express, MongoDB, and React Native mobile app development. Available for freelance projects & full-stack development roles.",
  keywords: [
    "Ravindra Nath Jha",
    "Ravindra Nath Jha Portfolio",
    "Full Stack Developer",
    "React.js Developer India",
    "MERN Stack Developer",
    "Node.js Backend Developer",
    "Next.js App Router Specialist",
    "React Native Mobile Developer",
    "JavaScript Expert",
    "Freelance Web Developer India",
    "Townmanor Technology Team Lead",
    "Python Developer",
    "REST API Integration",
    "Web Development Services"
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
    title: "Ravindra Nath Jha | Full Stack Developer & React Specialist",
    description:
      "Full Stack Developer & Team Lead specializing in React.js, Next.js, Node.js, and mobile app development. Explore projects, skills, and freelance services.",
    images: [
      {
        url: "https://ravindranathjha.in/assets/images/Ravindraprofile.jpeg",
        width: 1200,
        height: 630,
        alt: "Ravindra Nath Jha - Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ravindra Nath Jha | Full Stack Developer",
    description:
      "Full Stack Developer & Team Lead specializing in React.js, Node.js, and mobile app development.",
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
      </body>
    </html>
  );
}
