"use client";

import React from "react";

import WagmiButton from "./ui/buttons/wagmi";
import EthersButton from "./ui/buttons/ethersjs";
import ChainButton from "./ui/buttons/chain";

import config from "@/uiconfig.json";
import { LIBS } from "@/constants/common";

const Header = () => {

  return (
    <div className="w-full flex gap-2 justify-between p-4">
      <div className="w-[140px]" />
      <div className="flex gap-4">
        <ChainButton />
        {config.lib === LIBS.WAGMI ? <WagmiButton /> : <EthersButton />}
      </div>
    </div>
  );
};

export default Header;
