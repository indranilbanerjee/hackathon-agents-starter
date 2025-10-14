import { NextRequest, NextResponse } from "next/server";
import { ActionItems } from "@/lib/schemas";
import { readFileSync } from "node:fs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const path = body.path ?? "/mnt/data/agents-seed-pack-full/day08_Meeting_Action_Enforcer/transcript.txt";
  const text = readFileSync(path, "utf8");
  const items = [];
  const lines = text.split(/\r?\n/);
  for (const ln of lines) {
    const m = ln.match(/@([A-Za-z]+)\s+(.*)\s+by\s+(\w+\s\d{1,2})/i);
    if (m) {
      const owner = m[1];
      const title = m[2].replace(/^prepare\s*/i, "Prepare ").replace(/^update\s*/i, "Update ");
      const due = "2025-10-20"; // demo date; use parser in prod
      items.push({ owner, title, due });
    }
  }
  const parsed = ActionItems.safeParse(items);
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });
  return NextResponse.json(parsed.data);
}
