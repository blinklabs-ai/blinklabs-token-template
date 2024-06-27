"use client";

import React from "react";
import useNft from "@/hooks/nft/useNft";

import { Button } from "@/components/ui/buttons/button";
import Loading from "@/components/Loading";

interface MintButtonProps {
  disabled: boolean;
  selectingId: number;
}

const MintButton = ({ disabled, selectingId }: MintButtonProps) => {
  const { loading, mintToken } = useNft();

  const renderLabel = () => {
    if (loading) {
      return <Loading width={20} height={20} className="border-white" />;
    }
    return "Mint";
  };

  return (
    <>
      <Button
        disabled={disabled || loading}
        onClick={async () => {
          await mintToken.mutateAsync(selectingId);
        }}
      >
        {renderLabel()}
      </Button>
    </>
  );
};

export default MintButton;
