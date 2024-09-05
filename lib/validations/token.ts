import { object, string } from "zod";

export const SwapTokenSchema = object({
  amount: string(),
});
