import { useEffect, useState } from "react";

export function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { threshold: 0.4 }
      );

      observer.observe(el);
      return observer;
    });

    return () => observers.forEach((obs) => obs?.disconnect());
  }, []);

  return activeId;
}