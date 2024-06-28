import React from "react";
import Image from "next/image";
import Link from "next/link";

import TokenInfo from "./components/TokenInfo/TokenInfo";
import TokenTabs from "./components/TokenTabs";
import ButtonTray from "./components/ButtonTray";

import config from "@/uiconfig.json";

const MintPage = () => {
  const { project } = config;
  const { name, description, logoUrl, bannerUrl, media } = project;

  return (
    <div>
      <div className="relative">
        <div className="w-full h-[360px] relative">
          <Image src={bannerUrl} alt="banner" fill object-fit="cover" />
        </div>
        <div className="w-full px-4 flex items-end justify-between absolute -bottom-[50px]">
          <Image
            src={logoUrl}
            alt="logo"
            height={100}
            width={100}
            className="rounded-lg"
          />
          <div className="flex gap-2">
            {Object.keys(media).map((key) => (
              <Link
                key={key}
                href={media[key as keyof typeof media] as string}
                target="_blank"
                className="bg-white rounded-full p-1 w-[27px] h-[27px] flex items-center justify-center"
              >
                <img key={key} src={`logos/${key}-icon.svg`} alt={key} />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 grid-rows-1 gap-20 px-4 py-16">
        <div className="col-span-2 flex flex-col gap-3 font-bold">
          <h4 className="text-lg">{name}</h4>
          <p className="text-sm line-clamp-4">{description}</p>
          <ButtonTray />
        </div>
        <TokenInfo />
      </div>
      <TokenTabs />
    </div>
  );
};

export default MintPage;
