"use client";

import { useEffect } from "react";

export default function ClientEffects() {
  useEffect(() => {
    // Click ripple bubbles
    function createRipple(e: MouseEvent) {
      const target = e.target as HTMLElement;
      // Skip if clicking on inputs or links that handle their own effects
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      const ripple = document.createElement("span");
      ripple.className = "click-ripple";
      ripple.style.left = e.clientX + "px";
      ripple.style.top = e.clientY + "px";
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 900);
    }

    // Cursor glow that follows mouse
    const cursor = document.createElement("div");
    cursor.className = "cursor-glow";
    document.body.appendChild(cursor);

    function moveCursor(e: MouseEvent) {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    }

    document.addEventListener("click", createRipple);
    document.addEventListener("mousemove", moveCursor);

    return () => {
      document.removeEventListener("click", createRipple);
      document.removeEventListener("mousemove", moveCursor);
      cursor.remove();
    };
  }, []);

  return null;
}
