"use client";

import { useEffect } from "react";

export default function TabTitleSwitcher() {
  useEffect(() => {
    const handleVisibilityChange = () => {
      const faviconElem = document.getElementById("favicon");
      
      if (document.visibilityState === "visible") {
        document.title = "Portfolio | Ravindra Nath Jha";
        if (faviconElem) {
          faviconElem.setAttribute("href", "/assets/images/favicon.png");
        }
      } else {
        document.title = "Come Back To Portfolio 🙋‍♂️";
        if (faviconElem) {
          faviconElem.setAttribute("href", "/assets/images/favhand.png");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}
