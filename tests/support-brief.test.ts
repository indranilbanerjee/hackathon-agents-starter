import { describe, it, expect } from "vitest";

const golden = {
  "issue":"Billing issue",
  "env":"prod",
  "steps_tried":"Charged twice; Refund requested",
  "severity":"high",
  "next_action":"Route to Billing"
};

describe("Support Ticket Brief", () => {
  it("produces a valid brief close to golden", async () => {
    const res = await fetch("http://localhost:3000/api/support-brief", { method:"POST", body: JSON.stringify({}) });
    const data = await res.json();
    expect(data.issue).toContain("Billing");
    expect(["high","medium","low","critical"]).toContain(data.severity);
  });
});
