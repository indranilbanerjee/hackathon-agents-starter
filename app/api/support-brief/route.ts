import { NextRequest, NextResponse } from "next/server";
import { TicketBrief } from "@/lib/schemas";
import { readFileSync } from "node:fs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const path = body.path ?? "/mnt/data/agents-seed-pack-full/day21_Support_Summarizer_and_Router/zendesk_tickets.json";
  const raw = JSON.parse(readFileSync(path, "utf8"));
  const t = raw[0];
  const brief = {
    issue: t.subject,
    env: "prod",
    steps_tried: (t.comments && t.comments.join("; ")) || "n/a",
    severity: t.priority === "high" ? "high" : "medium",
    next_action: t.subject.includes("Billing") ? "Route to Billing" : "Ask for logs",
  };
  const parsed = TicketBrief.safeParse(brief);
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });
  return NextResponse.json(parsed.data);
}
