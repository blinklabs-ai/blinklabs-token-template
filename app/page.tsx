"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import config from "@/uiconfig.json";

import ButtonTray from "@/app/components/ButtonTray";
import TokenInfo from "@/app/components/TokenInfo/TokenInfo";
import TokenTabs from "@/app/components/TokenTabs";
import ChatGroup from "@/app/components/ChatGroup";
import { Icons } from "@/components/Icons";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/app/components/ui/resizable";
import ConnectWalletButton from "@/components/ui/buttons/ConnectWalletButton";
import SwapWidget from "@/app/components/SwapWidget/SwapWidget";

const socialIcons = {
  x: {
    icon: <Icons.twitterX />,
    activeColor: "text-black",
    inactiveColor: "text-gray-500",
  },
  discord: {
    icon: <Icons.discord />,
    activeColor: "text-black",
    inactiveColor: "text-gray-500",
  },
  telegram: {
    icon: <Icons.telegram />,
    activeColor: "text-black",
    inactiveColor: "text-gray-500",
  },
};

const SocialIcons = ({ media }: { media: Record<string, string> }) => (
  <div className="flex gap-2 sm:mt-0 mb-8">
    {Object.entries(socialIcons).map(
      ([key, { icon, activeColor, inactiveColor }]) => {
        const url = media[key];
        const isActive = !!url;

        const socialIcon = (
          <div
            className={`flex h-[27px] w-[27px] items-center justify-center rounded-full p-1 ${
              isActive
                ? `${activeColor} bg-white`
                : `${inactiveColor} bg-gray-300/30`
            }`}
          >
            {icon}
          </div>
        );

        return (
          <div className="flex items-center" key={key}>
            <Link href={url} target="_blank" rel="noopener noreferrer">
              {socialIcon}
            </Link>
            {/* <Icons.externalLink className="ml-1 h-3 w-3" /> */}
          </div>
        );
      }
    )}
  </div>
);

const MintPage = () => {
  const { project } = config;
  const { name, description, logoUrl, bannerUrl, media } = project;
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex flex-col px-4 pb-8">
      <div className="py-4 flex items-center justify-between">
        <button
          onClick={handleGoBack}
          className="inline-flex items-center text-sm font-medium text-inactive hover:text-inactive-hover transition-colors"
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back to Explore
        </button>

        <ConnectWalletButton />
      </div>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={70}>
          <div className="flex flex-col h-full pr-2">
            <div className="relative">
              <div className="w-full h-[200px] sm:h-[360px] relative">
                <Image
                  src={bannerUrl}
                  alt="banner"
                  fill
                  unoptimized
                  priority={true}
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="w-full px-4 flex flex-col sm:flex-row items-center sm:items-end justify-between absolute -bottom-[50px]">
                <Image
                  src={logoUrl}
                  alt="logo"
                  height={100}
                  width={100}
                  unoptimized
                  className="rounded-lg mb-2 sm:mb-0"
                />
                <SocialIcons media={media} />
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-5 xl:grid-cols-5 xl:gap-8 pt-16 pb-6 px-5">
              <div className="xl:col-span-3">
                <div className="flex flex-col gap-8">
                  <div className="sm:col-span-2 flex flex-col gap-3">
                    <h4 className="text-lg font-bold">{name}</h4>
                    <p className="text-sm line-clamp-4">{description}</p>
                    <ButtonTray />
                  </div>
                  <div className="py-6 px-4 bg-neutral-800 rounded-lg">
                    <TokenInfo />
                  </div>
                </div>
              </div>

              <div className="xl:col-span-2">
                <SwapWidget />
              </div>
            </div>

            <TokenTabs />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={30}>
          <ChatGroup />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default MintPage;
