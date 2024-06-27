import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortenAddress = (address: `0x${string}`) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

export const formatBigNumber = (
  value: undefined | string | number | bigint
) => {
  if (!value) return 0;
  return new Intl.NumberFormat("en-US").format(Number(value));
};
