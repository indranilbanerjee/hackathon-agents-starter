import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "node:fs";

export async function GET(req: NextRequest) {
  const path = "/mnt/data/agents-seed-pack-full/day13_SEO_Issue_Sentinel/sitemap.xml";
  const xml = readFileSync(path, "utf8");
  const urls = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map(m => m[1]);
  return NextResponse.json({ count: urls.length, urls });
}
