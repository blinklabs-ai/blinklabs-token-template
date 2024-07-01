"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import BigNumber from "bignumber.js";
import useToken from "@/hooks/token/useToken";

import TokenInfoLoading from "./TokenInfoLoading";

import { copyToClipboard, formatBigNumber, shortenAddress } from "@/lib/utils";
import config from "@/uiconfig.json";

const TokenInfo = () => {
  const { contractAddress } = config;
  const { loading, tokenSupply, name, symbol, owner, decimals } = useToken();

  if (loading) {
    return <TokenInfoLoading />;
  }

  console.log({ tokenSupply, decimals });

  return (
    <div className="flex flex-col gap-3 justify-between font-bold">
      <div className="w-full flex justify-between">
        <p>Token Name</p>
        <p className="text-neutral-400">{name}</p>
      </div>
      <div className="w-full flex justify-between">
        <p>Ticker</p>
        <p className="text-neutral-400">{symbol}</p>
      </div>
      <div className="w-full flex justify-between">
        <p>Token Supply</p>
        <p className="text-neutral-400">
          {formatBigNumber(
            BigNumber(tokenSupply)
              .dividedBy(BigNumber(10).exponentiatedBy(decimals))
              .toString(10)
          )}
        </p>
      </div>
      <div className="w-full flex justify-between">
        <p>Creator Address</p>
        <div className="flex items-center gap-1">
          <Link href={""} target="_blank_" className="text-blue-400 underline">
            {shortenAddress(config.owner)}
          </Link>
          <Image
            src={"/icons/copy.svg"}
            height={14}
            width={14}
            alt="copy"
            className="cursor-pointer"
            onClick={() => copyToClipboard(config.owner)}
          />
        </div>
      </div>
      <div className="w-full flex justify-between">
        <p>Contract Address</p>
        <div className="flex items-center gap-1">
          <Link href={""} target="_blank_" className="text-blue-400 underline">
            {shortenAddress(contractAddress)}
          </Link>
          <Image
            src={"/icons/copy.svg"}
            height={14}
            width={14}
            alt="copy"
            className="cursor-pointer"
            onClick={() => copyToClipboard(contractAddress)}
          />
        </div>
      </div>
    </div>
  );
};

export default TokenInfo;
