import { useState } from "react";
import {
  writeContract,
  readContract,
  getTransactionConfirmations,
} from "@wagmi/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useWallet from "../wallet/useWallet";
import { ethers } from "ethers";

import { NftContractFactory } from "@/lib/contracts/NftContractFactory";

import { wagmiConfig } from "@/configs/wagmi";
import { LIBS } from "@/constants/common";
import config from "@/uiconfig.json";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { Abi } from "viem";

export default () => {
  const contractAddress = config.contractAddress;
  const [loading, setLoading] = useState<boolean>(false);
  const { address, switchChain } = useWallet();
  const queryClient = useQueryClient();

  const getOwnersWithEthersFn = async (
    tokenIds: number[] | undefined
  ): Promise<Array<string | null>> => {
    const abi = config.abi;
    if (tokenIds === undefined || tokenIds.length === 0) {
      return new Promise((resolve) => resolve([]));
    }
    if (!contractAddress || !abi) {
      return new Promise((resolve) => resolve([]));
    }
    const signer = await new ethers.BrowserProvider(
      window.ethereum
    ).getSigner();
    const contract = NftContractFactory.connect(contractAddress, signer);
    const result = [] as Array<string | null>;
    for (const tokenId of tokenIds) {
      try {
        const owner = await contract.ownerOf(tokenId);
        result.push(owner);
      } catch (error) {
        result.push(null);
      }
    }
    return new Promise((resolve) => resolve(result));
  };

  const getOwnersWithEthers = (tokenIds: number[]) =>
    useQuery({
      queryKey: [QUERY_KEYS.OWNERS, { tokenIds }],
      queryFn: () => getOwnersWithEthersFn(tokenIds),
      enabled: !!tokenIds && tokenIds.length !== 0,
    });

  const mintWithEthersFn = async (tokenId: number) => {
    const abi = config.abi;
    if (!contractAddress || !abi || !address) {
      return;
    }
    setLoading(true);
    try {
      if (window.ethereum.chainId !== config.chain.id) {
        await switchChain(config.chain.id.toString(16));
      }
      const signer = await new ethers.BrowserProvider(
        window.ethereum
      ).getSigner();
      const tx = NftContractFactory.connect(contractAddress, signer).mint(
        address,
        tokenId,
        ""
      );
      await (await tx).wait();
      console.log("Minted token successfully");
      return tokenId;
    } catch (error) {
      console.log({ error });
      console.log("Failed to mint token");
    } finally {
      setLoading(false);
    }
  };

  const mintWithEthers = useMutation({
    mutationFn: mintWithEthersFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.OWNERS,
          { tokenIds: config.project.nfts.map((nft) => nft.tokenId) },
        ],
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  const getOwnersWithWagmiFn = async (tokenIds: number[]) => {
    const abi = config.abi as Abi;
    if (!contractAddress || !abi) {
      return new Promise((resolve) => resolve([]));
    }
    const result = [] as Array<string | null>;
    for (const tokenId of tokenIds) {
      if (!tokenId) {
        break;
      }
      try {
        const owner = (await readContract(wagmiConfig, {
          abi,
          address: contractAddress as `0x${string}`,
          functionName: "ownerOf",
          args: [tokenId],
        })) as string;
        result.push(owner);
      } catch (error) {
        result.push(null);
      }
    }
    return new Promise((resolve) => resolve(result));
  };

  const getOwnersWithWagmi = (tokenIds: number[]) =>
    useQuery({
      queryKey: [QUERY_KEYS.OWNERS, { tokenIds }],
      queryFn: () => getOwnersWithWagmiFn(tokenIds),
      enabled: !!tokenIds && tokenIds.length !== 0,
    });

  const mintWithWagmiFn = async (tokenId: number) => {
    const abi = config.abi;
    if (!contractAddress || !abi || !address) {
      return;
    }
    setLoading(true);
    try {
      if (window.ethereum.chainId !== config.chain.id) {
        await switchChain(config.chain.id.toString(16));
      }
      const txHash = await writeContract(wagmiConfig, {
        abi,
        address: contractAddress as `0x${string}`,
        functionName: "mint",
        args: [address, tokenId, ""],
      });
      await getTransactionConfirmations(wagmiConfig, {
        hash: txHash as `0x${string}`,
      });
      console.log("Minted token successfully");
    } catch (error) {
      console.log("Failed to mint token");
    } finally {
      setLoading(false);
    }
  };

  const mintWithWagmi = useMutation({
    mutationFn: mintWithWagmiFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.OWNERS,
          { tokenIds: config.project.nfts.map((nft) => nft.tokenId) },
        ],
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  switch (config.lib) {
    case LIBS.ETHERS:
      return {
        loading,
        mintToken: mintWithEthers,
        owners: getOwnersWithEthers,
      };
    default:
      return {
        loading,
        mintToken: mintWithWagmi,
        owners: getOwnersWithWagmi,
      };
  }
};
