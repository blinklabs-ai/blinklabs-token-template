import React, { useState } from "react";
import * as z from "zod";
import BigNumber from "bignumber.js";
import { useForm } from "react-hook-form";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Abi, createWalletClient, custom } from "viem";
import {
  Token,
  Fetcher,
  Route,
  Trade,
  TokenAmount,
  TradeType,
  Percent,
} from "@uniswap/sdk";
import { cn } from "@/lib/utils";
import { Chain } from "@/types";
import config from "@/uiconfig.json";
import swapRouterContractAbi from "@/constants/abis/SwapRouterContract.json";
import { CHAINS } from "@/constants/chains";
import { SwapTokenSchema } from "@/lib/validations/token";
import { waitForTransactionReceipt } from "viem/actions";

import SelectToken from "@/app/components/SwapWidget/SelectToken";
import AmountInput from "@/components/AmountInput";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/buttons/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import Loading from "@/components/Loading";

type FormData = z.infer<typeof SwapTokenSchema>;

const SwapWidget = () => {
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
  const { chainId, project, contractAddress } = config;
  const chain = CHAINS[chainId as keyof typeof CHAINS] as Chain;
  const swapRouterContractAddress = chain.swapRouterContractAddress;
  const { address } = useAccount();
  const { data: balanceData, isSuccess } = useBalance({ address });
  const { data: decimals } = useReadContract({
    address: contractAddress as `0x${string}`,
    functionName: "decimals",
    args: [],
  });

  const [isLoading, setLoading] = useState(false);
  const [isViewingSlippage, setIsViewSlippage] = useState(false);
  const [customSlippage, setCustomSlippage] = useState("");

  const balance = isSuccess
    ? BigNumber(balanceData.value.toString(10))
        .div(1e18)
        .toFixed(6, BigNumber.ROUND_DOWN)
    : "0";

  const form = useForm<FormData>({
    resolver: zodResolver(SwapTokenSchema),
    defaultValues: {
      inToken: chain.swapTokens[0].address,
      amount: "",
      slippage: DEFAULT_SLIPPAGE_LIST[0].value,
      isCustomSlippage: false,
    },
  });

  const onToggleSlippageView = () => setIsViewSlippage((prev) => !prev);

  const onSetSlippage = (slippage: string, isCustomSlippage: boolean) => {
    form.setValue("slippage", slippage);
    form.setValue("isCustomSlippage", isCustomSlippage);
    if (!isCustomSlippage) {
      setCustomSlippage("");
    }
  };

  const onSetHalfBalance = () =>
    form.setValue(
      "amount",
      balance === "0"
        ? "0"
        : BigNumber(balance).div(2).toFixed(6, BigNumber.ROUND_DOWN)
    );

  const onSetMaxBalance = () =>
    form.setValue("amount", balance === "0" ? "0" : balance);

  const onSubmit = async () => {
    // TODO: Implement swap logic
    try {
      if (!swapRouterContractAddress) {
        throw new Error("This network does not supported for swapping");
      }
      if (!address) {
        throw new Error("Please connect your wallet");
      }
      setLoading(true);
      const client = createWalletClient({
        chain: { ...chain, rpcUrls: { default: { http: [chain.rpc] } } },
        transport: custom(window.ethereum!),
      });
      const tokenAmount = form.getValues("amount");
      const tokenInAddress = "0x4200000000000000000000000000000000000006";
      const tokenOutAddress = contractAddress;
      const tokenInDecimals = 18;
      const tokenOutDecimals = decimals as number;
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
      const amountIn = BigNumber(tokenAmount)
        .times(10 ** tokenInDecimals)
        .toString(10);
      const to = address;
      const path = [tokenInAddress, tokenOutAddress];
      const tokenIn = new Token(chainId, tokenInAddress, tokenInDecimals);
      const tokenOut = new Token(chainId, contractAddress, tokenOutDecimals);
      const pair = await Fetcher.fetchPairData(tokenIn, tokenOut);
      const route = new Route([pair], tokenIn);
      const trade = new Trade(
        route,
        new TokenAmount(tokenIn, amountIn),
        TradeType.EXACT_INPUT
      );
      const slippage = form.getValues("slippage");
      const slippageTolerance = new Percent(slippage, "10000");
      const amountOutMin = trade.minimumAmountOut(slippageTolerance).toFixed();
      const hash = await client.writeContract({
        account: address,
        abi: swapRouterContractAbi as Abi,
        functionName: "swapExactTokensForTokens",
        address: swapRouterContractAddress,
        args: [amountIn, amountOutMin, path, to, deadline],
      });

      await waitForTransactionReceipt(client, { hash });
    } catch (error) {
      console.log({ error });
    } finally {
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
                  <div className="w-3/4 flex flex-1">
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
                            form.watch("slippage") === slippage.value
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
                      "w-1/4 border-2 rounded-md",
                      form.watch("isCustomSlippage")
                        ? "border-primary"
                        : "border-transparent"
                    )}
                  >
                    <AmountInput
                      value={customSlippage}
                      onChange={(e) => setCustomSlippage(e.target.value)}
                      placeholder="Custom"
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
                        if (!balanceData) return "Failed to get token data";
                        if (
                          BigNumber(value)
                            .times(10 ** balanceData.decimals)
                            .gte(balanceData.value.toString(10))
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
                          />
                        </FormControl>
                        {/* <FormMessage /> */}
                      </FormItem>
                    )}
                  />
                  <div>
                    <SelectToken tokenList={chain.swapTokens} />
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
                      {balance} {chain.nativeCurrency.symbol}
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
                >
                  {isLoading ? (
                    <Loading width={16} height={16} />
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
                  <span className="font-bold text-neutral-500 text-xl">0</span>
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
                    30.234 USDC
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex justify-end mt-2">
        <Button className="font-bold px-10" variant={"default"}>
          View on Uniswap
        </Button>
      </div>
    </Form>
  );
};

export default SwapWidget;
