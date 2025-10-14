import { describe, it, expect } from "vitest";

describe("SEO Pages", () => {
  it("parses sitemap and returns URLs", async () => {
    const res = await fetch("http://localhost:3000/api/seo-pages");
    const data = await res.json();
    expect(data.count).toBeGreaterThan(0);
    expect(Array.isArray(data.urls)).toBe(true);
  });
});
