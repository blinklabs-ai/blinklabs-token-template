import React from "react";
import { ConnectButton, Theme, darkTheme } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { client } from "@/configs/thirdweb";

const wallets = [
  inAppWallet(),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
];

const ConnectWalletButton = () => {
  const theme: Theme = {
    colors: {
      ...darkTheme().colors,
      primaryButtonBg: "#ff551e",
      primaryButtonText: "#ffffff",
      skeletonBg: "#ff551e",
    },
    type: "dark",
    fontFamily: "satoshi",
  };
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      theme={theme}
      connectButton={{ style: { height: "40px" } }}
    />
  );
};

export default ConnectWalletButton;
