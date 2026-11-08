import { useEffect, useState } from "react";

// A tiny hash router: "#/dev/style" -> path "/dev/style" (a "?query" part is ignored).
// Hash routing means static hosting needs no rewrite rules for deep links.

function readPath(): string {
  const hash = window.location.hash.replace(/^#/, "");
  const path = hash.split("?")[0] ?? "";
  return path === "" ? "/" : path;
}

export function useHashRoute(): string {
  const [path, setPath] = useState(readPath);
  useEffect(() => {
    const onChange = () => setPath(readPath());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return path;
}

export function hrefFor(path: string): string {
  return `#${path}`;
}
