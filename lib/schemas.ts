import { z } from "zod";

export const ActionItem = z.object({
  owner: z.string(),
  title: z.string(),
  due: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export const ActionItems = z.array(ActionItem);

export const TicketBrief = z.object({
  issue: z.string(),
  env: z.string(),
  steps_tried: z.string(),
  severity: z.enum(["low","medium","high","critical"]),
  next_action: z.string(),
});
