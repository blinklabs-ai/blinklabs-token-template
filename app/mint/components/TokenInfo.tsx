"use client";

import React from "react";
import BigNumber from "bignumber.js";
import useToken from "@/hooks/token/useToken";

import { Skeleton } from "@/components/ui/skeleton";

import config from "@/uiconfig.json";
import { formatBigNumber, shortenAddress } from "@/lib/utils";

const TokenInfo = () => {
  const { contractAddress } = config;
  const { loading, tokenSupply, name, symbol, owner, decimals } = useToken();

  if (loading) {
    return (
      <div className="flex flex-col gap-3 justify-between font-bold">
        <div className="w-full flex justify-between items-center">
          <p>Token Name</p>
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="w-full flex justify-between items-center">
          <p>Ticker</p>
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="w-full flex justify-between items-center">
          <p>Token Supply</p>
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="w-full flex justify-between items-center">
          <p>Creator Address</p>
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="w-full flex justify-between items-center">
          <p>Contract Address</p>
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 justify-between font-bold">
      <div className="w-full flex justify-between">
        <p>Token Name</p>
        <p>{name}</p>
      </div>
      <div className="w-full flex justify-between">
        <p>Ticker</p>
        <p>{symbol}</p>
      </div>
      <div className="w-full flex justify-between">
        <p>Token Supply</p>
        <p>
          {formatBigNumber(
            BigNumber(tokenSupply)
              .dividedBy(BigNumber(10).exponentiatedBy(decimals))
              .toString(10)
          )}
        </p>
      </div>
      <div className="w-full flex justify-between">
        <p>Creator Address</p>
        <p>{shortenAddress(owner as `0x${string}`)}</p>
      </div>
      <div className="w-full flex justify-between">
        <p>Contract Address</p>
        <p>{shortenAddress(contractAddress as `0x${string}`)}</p>
      </div>
    </div>
  );
};

export default TokenInfo;
