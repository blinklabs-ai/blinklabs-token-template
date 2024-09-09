import React, { useState } from "react";
import Link from "next/link";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { useForm } from "react-hook-form";
import {
  useAccount,
  useReadContract,
  useSwitchChain,
  useWalletClient,
} from "wagmi";
import { Abi } from "viem";
import {
  Percent,
  TokenAmount,
  Fraction,
  Token as TokenObject,
} from "@uniswap/sdk";
import {
  addChainAsync,
  checkChainAsync,
  cn,
  debounce,
  formatTokenAmount,
} from "@/lib/utils";
import { Chain, Token } from "@/types";
import config from "@/uiconfig.json";
import swapRouterContractAbi from "@/constants/abis/SwapRouterContract.json";
import { CHAINS } from "@/constants/chains";
import { readContract, waitForTransactionReceipt } from "viem/actions";

import SelectToken from "@/app/components/SwapWidget/SelectToken";
import AmountInput from "@/components/AmountInput";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/buttons/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Loading from "@/components/Loading";
import { toast } from "@/components/ui/use-toast";

const DEFAULT_SLIPPAGE_LIST = [
  {
    value: "0.0001",
    label: "0.01%",
    key: 0,
  },
  {
    value: "0.0005",
    label: "0.05%",
    key: 1,
  },
  {
    value: "0.001",
    label: "0.1%",
    key: 2,
  },
];

const SwapWidget = () => {
  const { chainId, project, contractAddress, abi } = config;
  const chain = CHAINS[chainId as keyof typeof CHAINS] as Chain;
  const isLiquidityUrlAvailable =
    project?.liquidityUrl && project.liquidityUrl.trim() !== "";

  const form = useForm({
    defaultValues: {
      inToken: JSON.stringify(chain.swap.pancake.swapTokens[0]),
      amount: "",
      slippage: DEFAULT_SLIPPAGE_LIST[0].value,
      isCustomSlippage: false,
    },
    mode: "onChange",
  });

  const [isLoading, setLoading] = useState(false);
  const [isViewingSlippage, setIsViewSlippage] = useState(false);
  const [customSlippage, setCustomSlippage] = useState("");

  const swapRouterContractAddress = chain.swap.pancake.routerContractAddress;
  const queryClient = useQueryClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const watchInToken = form.watch("inToken");
  const currentInToken: Token = JSON.parse(watchInToken);

  const { data: decimals } = useReadContract({
    chainId,
    address: contractAddress as `0x${string}`,
    functionName: "decimals",
    abi: config.abi,
    args: [],
  }) as { data: number };

  const { data: tokenInBalance, queryKey: tokenInQueryKey } = useReadContract({
    chainId,
    address: currentInToken.address as `0x${string}`,
    functionName: "balanceOf",
    abi: config.abi,
    args: [address],
    query: { enabled: !!currentInToken.address },
  }) as { data: BigInt; queryKey: QueryKey };

  const { data: tokenOutBalance, queryKey: tokenOutQueryKey } = useReadContract(
    {
      chainId,
      address: contractAddress as `0x${string}`,
      functionName: "balanceOf",
      abi: config.abi,
      args: [address],
    }
  ) as { data: BigInt; queryKey: QueryKey };

  const { data: amountOuts, queryKey: amountOutQueryKey } = useReadContract({
    chainId,
    address: swapRouterContractAddress as `0x${string}`,
    functionName: "getAmountsOut",
    abi: swapRouterContractAbi,
    args: [
      BigNumber(form.watch("amount"))
        .times(BigNumber(10).pow(decimals))
        .toString(10),
      [currentInToken.address as `0x${string}`, contractAddress],
    ],
    query: { enabled: !!currentInToken.address && !!decimals },
  }) as { data: Array<BigInt>; queryKey: QueryKey };

  const onToggleSlippageView = () => setIsViewSlippage((prev) => !prev);

  const onSetSlippage = (slippage: string, isCustomSlippage: boolean) => {
    form.setValue("slippage", slippage);
    form.setValue("isCustomSlippage", isCustomSlippage);
    if (!isCustomSlippage) {
      setCustomSlippage("");
    }
  };

  const onSetHalfBalance = () => {
    const tokenInBalanceBn = BigNumber(tokenInBalance.toString(10));
    form.setValue(
      "amount",
      tokenInBalanceBn.eq(0)
        ? "0"
        : formatTokenAmount(tokenInBalanceBn.div(2), decimals)
    );
  };

  const onSetMaxBalance = () => {
    const tokenInBalanceBn = BigNumber(tokenInBalance.toString(10));
    form.setValue(
      "amount",
      tokenInBalanceBn.eq(0)
        ? "0"
        : formatTokenAmount(tokenInBalanceBn, decimals)
    );
  };

  const onSubmit = async () => {
    try {
      if (!swapRouterContractAddress) {
        throw new Error("This network does not supported for swapping");
      }
      if (!walletClient || !address) {
        throw new Error("Please connect your wallet");
      }
      setLoading(true);
      const currentChainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      if (currentChainId !== chainId) {
        const hasChainInWallet = await checkChainAsync(chainId);
        if (!hasChainInWallet) {
          await addChainAsync(chain);
        }
        await switchChainAsync({ chainId });
      }
      const values = form.getValues();
      const selectedToken: Token = JSON.parse(values.inToken);

      const tokenInAddress = selectedToken.address as `0x${string}`;
      const tokenOutAddress = contractAddress;
      const tokenInDecimals = selectedToken.decimals;
      const tokenOutDecimals = decimals as number;
      const tokenAmount = BigNumber(form.getValues("amount")).times(
        BigNumber(10).pow(tokenInDecimals)
      );
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
      const amountIn = tokenAmount.toString(10);
      const to = address;
      const path = [tokenInAddress, tokenOutAddress];
      const tokenOut = new TokenObject(
        chainId,
        tokenOutAddress,
        tokenOutDecimals
      );
      const slippage = (Number(form.watch("slippage")) * 10000).toString(10);
      const slippageTolerance = new Percent(slippage, "10000");
      const amountOut = new TokenAmount(tokenOut, amountOuts[1].toString(10));
      const slippageAdjustedAmountOut = new Fraction("1")
        .add(slippageTolerance)
        .invert()
        .multiply(amountOut.quotient)
        .toFixed(
          Math.abs(Math.log10(Number(form.watch("slippage")))),
          { groupSeparator: "" },
          0
        );
      const amountOutMin = BigNumber(BigNumber(10).pow(tokenOutDecimals))
        .times(slippageAdjustedAmountOut)
        .toString(10);
      const approvalHash = await walletClient.writeContract({
        address: tokenInAddress,
        abi,
        functionName: "approve",
        account: address,
        args: [swapRouterContractAddress, amountIn],
      });
      await waitForTransactionReceipt(walletClient, { hash: approvalHash });
      const allowance = (await readContract(walletClient, {
        address: tokenInAddress,
        abi,
        functionName: "allowance",
        args: [address, swapRouterContractAddress],
      })) as BigInt;
      if (BigNumber(allowance.toString(10)).lt(amountIn)) {
        throw new Error("Insufficient allowance");
      }
      const hash = await walletClient.writeContract({
        account: address,
        abi: swapRouterContractAbi as Abi,
        functionName: "swapExactTokensForTokens",
        address: swapRouterContractAddress,
        args: [amountIn, amountOutMin, path, to, deadline],
      });
      await waitForTransactionReceipt(walletClient, { hash });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: tokenInQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: tokenOutQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: amountOutQueryKey,
        }),
      ]);

      toast({
        title: "Swap successfully",
      });
    } catch (error) {
      console.error({ error });
      toast({
        title: "Swap failed. Please try again",
      });
    } finally {
      form.reset();
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <div className="bg-neutral-700 rounded-lg p-2 font-medium">
        {isViewingSlippage ? (
          <div>
            <Button
              onClick={onToggleSlippageView}
              className="flex gap-1 bg-neutral-700 py-1 px-0 h-fit mb-2"
            >
              <span>
                <Icons.chevronLeft width={16} height={16} />
              </span>
              Back
            </Button>
            <div className="flex flex-col gap-2 mx-2">
              <p>Slippage Settings</p>
              <p className="text-sm text-neutral-400">
                Select a preset or set a custom max slippage amount. MEV
                protection is activated on the backend to hide transactions from
                MEV or sandwich attacks.
              </p>
              <div className="bg-neutral-800 p-2 rounded-md">
                <p className="mb-4">Set Max Slippage:</p>
                <div className="flex">
                  <div className="w-[67%] flex flex-1">
                    {DEFAULT_SLIPPAGE_LIST.map(
                      (slippage: {
                        value: string;
                        label: string;
                        key: number;
                      }) => (
                        <div
                          key={slippage.key}
                          className={cn(
                            "w-1/3 p-2 cursor-pointer rounded-lg border-2 flex justify-center",
                            form.watch("slippage") === slippage.value &&
                              !form.watch("isCustomSlippage")
                              ? "border-primary"
                              : "border-transparent"
                          )}
                          onClick={() => onSetSlippage(slippage.value, false)}
                        >
                          <p>{slippage.label}</p>
                        </div>
                      )
                    )}
                  </div>
                  <div
                    className={cn(
                      "w-[33%] border-2 rounded-md",
                      form.watch("isCustomSlippage")
                        ? "border-primary"
                        : "border-transparent"
                    )}
                  >
                    <AmountInput
                      value={customSlippage}
                      onChange={(e) => setCustomSlippage(e.target.value)}
                      placeholder="Custom..."
                      className="bg-neutral-800 text-base text-center focus-visible:ring-offset-0 focus-visible:ring-0"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end px-2 pt-2">
              <Button
                disabled={customSlippage === ""}
                onClick={() => onSetSlippage(customSlippage, true)}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-2">
              <Button
                className="flex gap-1 bg-neutral-800 px-2 py-1 h-fit"
                onClick={onToggleSlippageView}
              >
                <span>
                  <Icons.settings width={16} height={16} />
                </span>
                Slippage
              </Button>
            </div>
            <div className="relative flex flex-col gap-3">
              <div className="bg-neutral-800 p-3 pb-6 rounded-lg">
                <p className="text-base text-neutral-400 mb-2">You Pay</p>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <FormField
                    control={form.control}
                    name="amount"
                    rules={{
                      validate: (value) => {
                        if (!tokenInBalance || !decimals)
                          return "Failed to get token data";
                        if (
                          BigNumber(value)
                            .times(BigNumber(10).pow(decimals))
                            .gte(tokenInBalance.toString(10))
                        ) {
                          return "Insufficient balance";
                        }
                        return undefined;
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <AmountInput
                            {...field}
                            className="bg-transparent text-xl text-neutral-500 p-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                            placeholder="0"
                            onChange={(e) => {
                              debounce(async () => {
                                await queryClient.invalidateQueries({
                                  queryKey: [tokenInQueryKey],
                                });
                              }, 2000);
                              field.onChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <FormField
                      control={form.control}
                      name="inToken"
                      render={({ field: { value, onChange } }) => (
                        <FormItem>
                          <FormControl>
                            <SelectToken
                              tokenList={chain.swap.pancake.swapTokens}
                              value={value}
                              onValueChange={onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-neutral-500">$0</span>

                    <Button
                      variant="outline"
                      size="icon"
                      className="w-6 h-6 rounded-full bg-neutral-900"
                    >
                      <Icons.refreshCw
                        size={12}
                        strokeWidth={1}
                        color="#ffffff"
                      />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-neutral-500 font-medium">
                      {tokenInBalance
                        ? formatTokenAmount(
                            BigNumber(tokenInBalance.toString(10)),
                            decimals
                          )
                        : "0"}{" "}
                      {currentInToken.name}
                    </span>
                    <Button
                      className="text-neutral-200 text-xs rounded-full bg-neutral-700 hover:bg-neutral-600 h-6 px-2"
                      onClick={onSetHalfBalance}
                    >
                      50%
                    </Button>
                    <Button
                      className="text-neutral-200 text-xs rounded-full bg-neutral-700 hover:bg-neutral-600 h-6 px-2"
                      onClick={onSetMaxBalance}
                    >
                      Max
                    </Button>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 rounded-full bg-primary shadow-sm hover:bg-primary hover:opacity-95"
                  onClick={onSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loading className="fill-white" />
                  ) : (
                    <Icons.arrowDownUp
                      size={20}
                      strokeWidth={2}
                      color="#000000"
                    />
                  )}
                </Button>
              </div>
              <div className="bg-neutral-800 p-3 pb-6 rounded-lg">
                <p className="text-base text-neutral-400 mb-4">You Receive</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-neutral-500 text-xl">
                    {amountOuts
                      ? formatTokenAmount(
                          BigNumber(amountOuts[1].toString(10)),
                          decimals
                        )
                      : "0"}
                  </span>
                  <div>
                    <div className="rounded-full bg-neutral-700 py-1 px-2 h-7">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-white"></span>
                        <span className="text-sm text-white block">
                          {project.symbol}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">$0</span>
                  <span className="text-neutral-500 font-medium">
                    {tokenOutBalance
                      ? formatTokenAmount(
                          BigNumber(tokenOutBalance.toString(10)),
                          decimals
                        )
                      : "0"}{" "}
                    {project.symbol}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex justify-end mt-2">
        <Button
          className="font-bold"
          variant={"default"}
          disabled={!isLiquidityUrlAvailable}
        >
          {isLiquidityUrlAvailable ? (
            <Link href={project.liquidityUrl} target="_blank">
              View on PancakeSwap
            </Link>
          ) : (
            "Liquidity not supplied"
          )}
        </Button>
      </div>
    </Form>
  );
};

export default SwapWidget;
