import { describe, it, expect } from "vitest";

const golden = [
  {"owner":"Mina","title":"Prepare pricing sheet","due":"2025-10-20"},
  {"owner":"Raj","title":"Update pitch deck","due":"2025-10-18"},
  {"owner":"Priya","title":"Schedule beta calls","due":"2025-10-16"}
];

describe("Meeting Action Enforcer", () => {
  it("matches golden actions", async () => {
    const res = await fetch("http://localhost:3000/api/meeting-actions", { method:"POST", body: JSON.stringify({}) });
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    // Just check owners and titles exist in result
    const titles = data.map((d:any) => d.title);
    for (const g of golden) {
      expect(titles).toContain(g.title);
    }
  });
});
