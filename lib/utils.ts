import BigNumber from "bignumber.js";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortenAddress = (address: `0x${string}` | string) => {
  if (!address) return "";
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};

export const formatTokenAmount = (
  amount: BigNumber | null,
  decimals: number
) => {
  if (!amount) return "0";
  const amountStr = amount
    .div(10 ** (decimals || 18))
    .toFixed(6, BigNumber.ROUND_DOWN);
  const removedTralingZerosAmountStr = amountStr.replace(/\.?0+$/, "");
  return new Intl.NumberFormat("en-US", {
    roundingMode: "floor",
    maximumFractionDigits: 6,
  }).format(Number(removedTralingZerosAmountStr));
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  timeout = 300
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): void => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};
