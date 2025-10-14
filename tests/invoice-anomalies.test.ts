import { describe, it, expect } from "vitest";

describe("Invoice anomalies", () => {
  it("returns top5 by amount", async () => {
    const res = await fetch("http://localhost:3000/api/invoice-anomalies");
    const data = await res.json();
    expect(Array.isArray(data.top5)).toBe(true);
    expect(data.top5.length).toBe(5);
  });
});
