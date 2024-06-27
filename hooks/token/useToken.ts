import { ethers } from "ethers";
import { readContract } from "@wagmi/core";
import { useQuery } from "@tanstack/react-query";

import { TokenContractFactory } from "@/lib/contracts/TokenContractFactory";

import { wagmiConfig } from "@/configs/wagmi";
import { LIBS } from "@/constants/common";
import config from "@/uiconfig.json";
import { QUERY_KEYS } from "@/constants/queryKeys";

export default () => {
  const contractAddress = config.contractAddress as `0x${string}`;
  const abi = config.abi;

  const ethersjs = () => {
    const nameFn = async () => {
      try {
        const signer = await new ethers.BrowserProvider(
          window.ethereum
        ).getSigner();
        const contract = TokenContractFactory.connect(contractAddress, signer);
        const name = await contract.name();
        return name;
      } catch (error) {
        return "";
      }
    };

    const symbolFn = async () => {
      try {
        const signer = await new ethers.BrowserProvider(
          window.ethereum
        ).getSigner();
        const contract = TokenContractFactory.connect(contractAddress, signer);
        const symbol = await contract.symbol();
        return symbol;
      } catch (error) {
        return "";
      }
    };

    const tokenSupplyFn = async () => {
      try {
        const signer = await new ethers.BrowserProvider(
          window.ethereum
        ).getSigner();
        const contract = TokenContractFactory.connect(contractAddress, signer);
        const tokenSupply = await contract.maxSupply();
        return tokenSupply;
      } catch (error) {
        return 0;
      }
    };

    const ownerFn = async () => {
      try {
        const signer = await new ethers.BrowserProvider(
          window.ethereum
        ).getSigner();
        const contract = TokenContractFactory.connect(contractAddress, signer);
        const tokenSupply = await contract.owner();
        return tokenSupply;
      } catch (error) {
        return 0;
      }
    };

    const decimalsFn = async () => {
      try {
        const signer = await new ethers.BrowserProvider(
          window.ethereum
        ).getSigner();
        const contract = TokenContractFactory.connect(contractAddress, signer);
        const tokenSupply = await contract.decimals();
        return tokenSupply;
      } catch (error) {
        return 0;
      }
    };

    const { data: name, isLoading: isLoadingName } = useQuery({
      queryKey: [QUERY_KEYS.NAME],
      queryFn: nameFn,
    });

    const { data: symbol, isLoading: isLoadingSymbol } = useQuery({
      queryKey: [QUERY_KEYS.SYMBOL],
      queryFn: symbolFn,
    });

    const { data: owner, isLoading: isLoadingOwner } = useQuery({
      queryKey: [QUERY_KEYS.OWNER],
      queryFn: ownerFn,
    });

    const { data: tokenSupply, isLoading: isLoadingTokenSupply } = useQuery({
      queryKey: [QUERY_KEYS.TOKEN_SUPPLY],
      queryFn: tokenSupplyFn,
    });

    const { data: decimals, isLoading: isLoadingDecimals } = useQuery({
      queryKey: [QUERY_KEYS.DECIMALS],
      queryFn: decimalsFn,
    });

    const loading =
      isLoadingTokenSupply ||
      isLoadingName ||
      isLoadingSymbol ||
      isLoadingOwner ||
      isLoadingDecimals;

    return {
      loading,
      name,
      symbol,
      owner,
      tokenSupply: tokenSupply ? tokenSupply.toString(10) : 0,
      decimals: decimals ? decimals : 0,
    };
  };

  const wagmi = () => {
    const nameFn = async () => {
      try {
        const name = await readContract(wagmiConfig, {
          abi,
          address: contractAddress,
          functionName: "name",
        });
        return name as string;
      } catch (error) {
        return "";
      }
    };

    const symbolFn = async () => {
      try {
        const symbol = await readContract(wagmiConfig, {
          abi,
          address: contractAddress,
          functionName: "symbol",
        });
        return symbol as string;
      } catch (error) {
        return "";
      }
    };

    const ownerFn = async () => {
      try {
        const owner = await readContract(wagmiConfig, {
          abi,
          address: contractAddress,
          functionName: "owner",
        });
        return owner as string;
      } catch (error) {
        return "";
      }
    };

    const tokenSupplyFn = async () => {
      try {
        const tokenSupply = await readContract(wagmiConfig, {
          abi,
          address: contractAddress,
          functionName: "maxSupply",
        });
        return tokenSupply as number;
      } catch (error) {
        return 0;
      }
    };

    const decimalsFn = async () => {
      try {
        const decimals = await readContract(wagmiConfig, {
          abi,
          address: contractAddress,
          functionName: "decimals",
        });
        return decimals as number;
      } catch (error) {
        return 0;
      }
    };

    const { data: name, isLoading: isLoadingName } = useQuery({
      queryKey: [QUERY_KEYS.NAME],
      queryFn: nameFn,
    });

    const { data: symbol, isLoading: isLoadingSymbol } = useQuery({
      queryKey: [QUERY_KEYS.SYMBOL],
      queryFn: symbolFn,
    });

    const { data: owner, isLoading: isLoadingOwner } = useQuery({
      queryKey: [QUERY_KEYS.OWNER],
      queryFn: ownerFn,
    });

    const { data: tokenSupply, isLoading: isLoadingTokenSupply } = useQuery({
      queryKey: [QUERY_KEYS.TOKEN_SUPPLY],
      queryFn: tokenSupplyFn,
    });

    const { data: decimals, isLoading: isLoadingDecimals } = useQuery({
      queryKey: [QUERY_KEYS.DECIMALS],
      queryFn: decimalsFn,
    });

    const loading =
      isLoadingTokenSupply ||
      isLoadingName ||
      isLoadingSymbol ||
      isLoadingOwner ||
      isLoadingDecimals;

    return {
      loading,
      name,
      symbol,
      owner,
      tokenSupply: tokenSupply ? tokenSupply.toString(10) : 0,
      decimals: decimals ? decimals : 0,
    };
  };

  switch (config.lib) {
    case LIBS.ETHERS:
      return {
        ...ethersjs(),
      };
    default:
      return {
        ...wagmi(),
      };
  }
};
