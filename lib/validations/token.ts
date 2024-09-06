import { boolean, object, string } from "zod";

export const SwapTokenSchema = object({
  inToken: string(),
  amount: string(),
  slippage: string(),
  isCustomSlippage: boolean(),
});
