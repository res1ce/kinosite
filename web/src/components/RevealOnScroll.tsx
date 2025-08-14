"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const selector = ".reveal";
    const observed = new WeakSet<Element>();

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    const scan = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
      els.forEach((el) => {
        if (!observed.has(el) && !el.classList.contains("is-visible")) {
          obs.observe(el);
          observed.add(el);
        }
      });
    };

    // Initial scan
    scan();

    // Observe DOM mutations to catch dynamically added elements
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });

    // Failsafe: ensure above-the-fold content isn't stuck hidden on slow paints
    const timeout = setTimeout(() => {
      Array.from(document.querySelectorAll<HTMLElement>(selector)).forEach((el) => {
        if (!el.classList.contains("is-visible")) el.classList.add("is-visible");
      });
    }, 1500);

    return () => {
      clearTimeout(timeout);
      mo.disconnect();
      obs.disconnect();
    };
  }, [pathname]);

  return null;
}


