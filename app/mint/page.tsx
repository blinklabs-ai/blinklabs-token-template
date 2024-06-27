"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import useNft from "@/hooks/nft/useNft";

import NftTable from "./components/NftTable";
import MintButton from "./components/MintButton";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Loading from "@/components/Loading";

import { formatBigNumber } from "@/lib/utils";
import config from "@/uiconfig.json";
import { Nft } from "@/types";

const MintPage = () => {
  const [selectingId, setSelectingId] = useState<number>(0);
  const {
    name,
    description,
    media,
    nfts,
    stage,
    totalSupply,
    supply,
    price,
    currency,
  } = config.project;
  const percentFilled = Math.ceil((supply / totalSupply) * 100);
  const tokenIds = nfts.map((nft) => nft.tokenId);
  const { owners } = useNft();
  const { data, isLoading } = owners(tokenIds) as {
    data: Array<`0x${string}` | null>;
    isLoading: boolean;
  };
  const collection = data
    ? nfts.map((nft, index) => {
        return { ...nft, owner: data[index] as `0x${string}` };
      })
    : [];
  const mintedNfts = collection.filter((nft: Nft) => nft.owner);

  if (isLoading) {
    return <Loading width={108} height={108} />;
  }

  return (
    <div className="flex flex-col gap-4 px-72">
      <div className="w-full grid grid-cols-10 gap-8">
        <div className="col-span-3 flex flex-col gap-4">
          <Image
            className="rounded-md"
            src={collection[selectingId].imgUrl}
            alt="nft-image"
            width={480}
            height={480}
          />
          <Carousel opts={{ align: "start" }}>
            <CarouselContent>
              {collection.map((nft: Nft) => (
                <CarouselItem
                  key={nft.name}
                  className={
                    "md:basis-1/2 lg:basis-1/4 pl-2 cursor-pointer relative"
                  }
                  onClick={() => setSelectingId(nft.id)}
                >
                  <Image
                    className={clsx(
                      "rounded-md",
                      nft.owner && "opacity-20",
                      selectingId === nft.id &&
                        "border-2 border-primary rounded-md"
                    )}
                    src={nft.imgUrl}
                    alt="nft-image"
                    width={92}
                    height={92}
                  />
                  {nft.owner && (
                    <p className="ml-1 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute font-bold">
                      OWNED
                    </p>
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
        </div>
        <Card className="col-span-7 h-full flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{name}</h1>
            <div className="flex gap-2">
              {Object.keys(media).map((key) => (
                <Link
                  key={key}
                  href={media[key as keyof typeof media] as string}
                  target="_blank"
                  className="bg-black rounded-full p-1"
                >
                  <img key={key} src={`logos/${key}-icon.svg`} alt={key} />
                </Link>
              ))}
            </div>
          </div>
          <p>{description}</p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <p className="font-bold">{stage.name} Stage</p>
                <div className="flex items-center justify-between gap-1 bg-green-100 px-2 py-1 rounded-md">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <p className="text-sm font-bold text-green-500">Live</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold">ENDS IN</p>
                <div className="flex gap-2">
                  <p className="flex items-center justify-center w-8 aspect-square rounded-md bg-slate-200 font-bold">
                    04
                  </p>
                  <p className="flex items-center justify-center w-8 aspect-square rounded-md bg-slate-200 font-bold">
                    06
                  </p>
                  <p className="flex items-center justify-center w-8 aspect-square rounded-md bg-slate-200 font-bold">
                    27
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-between gap-4">
              <div className="w-full font-bold">
                <div className="flex justify-between mb-1">
                  <p className="text-xs">Total Minted</p>
                  <p className="text-xs">
                    {percentFilled}% ({formatBigNumber(supply)}/
                    {formatBigNumber(totalSupply)})
                  </p>
                </div>
                <div className="w-full h-2 bg-red-200 rounded-[60px]">
                  <div
                    className="h-2 bg-red-700 rounded-[60px]"
                    style={{ width: `${percentFilled}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-sm">
                Token #{collection[selectingId].tokenId}
              </p>
              <p className="text-2xl font-bold">
                {collection[selectingId].name}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-sm">Price</p>
              <p className="text-2xl font-bold">
                {price} {currency.symbol}{" "}
                <span className="text-xs font-normal">
                  (${price * currency.price})
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-xs font-bold text-slate-700">
            <div className="w-full flex justify-between">
              <p>Mint fee</p>
              <p>
                {collection[selectingId].fee} {currency.symbol}
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p>Priority fee</p>
              <p>
                {collection[selectingId].fee} {currency.symbol}
              </p>
            </div>
          </div>
          <MintButton
            disabled={!!collection[selectingId].owner}
            selectingId={collection[selectingId].tokenId}
          />
        </Card>
      </div>
      <NftTable data={mintedNfts} />
    </div>
  );
};

export default MintPage;
