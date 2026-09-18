import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TabTitleSwitcher from "@/components/TabTitleSwitcher";

export const metadata = {
  title: "Portfolio | Ravindra Nath Jha",
  description:
    "Experienced Full Stack Developer specializing in React.js, Node.js, and mobile app development. Team Lead with expertise in MERN stack, Python, PHP, and cloud deployment.",
  keywords: [
    "Ravindra Nath Jha",
    "React developer",
    "MERN stack",
    "full stack developer",
    "Node.js developer",
    "React Native",
    "mobile app developer",
    "JavaScript expert",
    "web developer",
    "portfolio",
    "Townmanor Technology"
  ],
  authors: [{ name: "Ravindra Nath Jha" }],
  icons: {
    icon: [
      { url: "/assets/images/favicon.png", type: "image/png" }
    ],
    shortcut: "/assets/images/favicon.png",
    apple: "/assets/images/favicon.png",
  },
  openGraph: {
    type: "website",
    url: "https://ravindranathjha.in/",
    title: "Portfolio | Ravindra Nath Jha",
    description:
      "Experienced Full Stack Developer specializing in React.js, Node.js, and mobile app development with expertise in MERN stack.",
    images: ["https://ravindranathjha.in/assets/images/Ravindraprofile.jpeg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Ravindra Nath Jha",
    description:
      "Experienced Full Stack Developer specializing in React.js, Node.js, and mobile app development with expertise in MERN stack.",
    images: ["https://ravindranathjha.in/assets/images/Ravindraprofile.jpeg"]
  }
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
        <TabTitleSwitcher />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
